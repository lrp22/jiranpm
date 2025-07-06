import { z } from "zod";
import { protectedProcedure, router, isWorkspaceAdmin } from "../lib/trpc";
import { db } from "../db";
import { workspaces } from "../db/schema/workspaces";
import { and, eq, inArray } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";
import { workspaceMembers } from "../db/schema/workspace-members";

export const workspaceRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const { user } = ctx.session;

    // Update the subquery to only include workspaces where the user is
    // an active member (ADMIN or MEMBER).
    const memberWorkspacesQuery = db
      .select({ id: workspaceMembers.workspaceId })
      .from(workspaceMembers)
      .where(
        and(
          eq(workspaceMembers.userId, user.id),
          // Add this condition to exclude PENDING roles
          inArray(workspaceMembers.role, ["ADMIN", "MEMBER"])
        )
      );

    const allWorkspaces = await db
      .select()
      .from(workspaces)
      .where(inArray(workspaces.id, memberWorkspacesQuery));

    return allWorkspaces;
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const { user } = ctx.session;

      const membership = await db.query.workspaceMembers.findFirst({
        where: and(
          eq(workspaceMembers.userId, user.id),
          eq(workspaceMembers.workspaceId, input.id)
        ),
        with: {
          workspace: true,
        },
      });

      if (!membership?.workspace) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Workspace not found or you do not have access.",
        });
      }

      // NEW: Check if the user's role is PENDING.
      // If so, deny access with a specific 'FORBIDDEN' error.
      if (membership.role === "PENDING") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Your request to join this workspace is pending approval.",
        });
      }

      return membership.workspace;
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(3, "Name must be at least 3 characters long"),
        imageUrl: z.string().url("Must be a valid URL").optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx.session;
      return await db.transaction(async (tx) => {
        const [created] = await tx
          .insert(workspaces)
          .values({
            name: input.name,
            imageUrl: input.imageUrl,
            inviteCode: nanoid(10),
          })
          .returning();

        if (!created) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

        await tx.insert(workspaceMembers).values({
          userId: user.id,
          workspaceId: created.id,
          role: "ADMIN",
        });
        return created;
      });
    }),

  join: protectedProcedure
    .input(z.object({ inviteCode: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx.session;

      const [workspaceToJoin] = await db
        .select()
        .from(workspaces)
        .where(eq(workspaces.inviteCode, input.inviteCode));

      if (!workspaceToJoin) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invalid invite link.",
        });
      }

      const [existingMembership] = await db
        .select()
        .from(workspaceMembers)
        .where(
          and(
            eq(workspaceMembers.userId, user.id),
            eq(workspaceMembers.workspaceId, workspaceToJoin.id)
          )
        );

      // If user is already a full member or has a pending request, do nothing.
      if (existingMembership) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "You are already a member or your request is pending.",
        });
      }

      // Add the user with a 'PENDING' role
      await db.insert(workspaceMembers).values({
        userId: user.id,
        workspaceId: workspaceToJoin.id,
        role: "PENDING",
      });

      // We don't return the workspace anymore, just a success message.
      return { success: true, message: "Your request to join has been sent." };
    }),

  // ADMIN-PROTECTED ROUTES
  update: isWorkspaceAdmin
    .input(
      z.object({
        name: z.string().min(3).optional(),
        imageUrl: z.string().url().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id: workspaceId, ...valuesToUpdate } = input;
      const [updatedWorkspace] = await db
        .update(workspaces)
        .set(valuesToUpdate)
        .where(eq(workspaces.id, workspaceId))
        .returning();
      if (!updatedWorkspace) throw new TRPCError({ code: "NOT_FOUND" });
      return updatedWorkspace;
    }),

  delete: isWorkspaceAdmin.mutation(async ({ input }) => {
    const workspaceId = input.id;

    // Get counts for admins and total members
    const membersInWorkspace = await db
      .select()
      .from(workspaceMembers)
      .where(eq(workspaceMembers.workspaceId, workspaceId));
    const adminCount = membersInWorkspace.filter(
      (m) => m.role === "ADMIN"
    ).length;

    // The new, corrected logic:
    // Deny deletion ONLY IF the user is the last admin AND there are other members.
    if (adminCount <= 1 && membersInWorkspace.length > 1) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message:
          "Please promote another admin or remove other members before deleting.",
      });
    }

    const [deletedWorkspace] = await db
      .delete(workspaces)
      .where(eq(workspaces.id, workspaceId))
      .returning({ id: workspaces.id });

    if (!deletedWorkspace) throw new TRPCError({ code: "NOT_FOUND" });

    return deletedWorkspace;
  }),

  getMembers: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      // This first check to ensure the caller is a member is still correct.
      const [membership] = await db
        .select()
        .from(workspaceMembers)
        .where(
          and(
            eq(workspaceMembers.userId, ctx.session.user.id),
            eq(workspaceMembers.workspaceId, input.id)
          )
        );
      if (!membership) throw new TRPCError({ code: "FORBIDDEN" });

      // Fetch all members for that workspace
      const members = await db.query.workspaceMembers.findMany({
        // FIX: Update the `where` clause to filter by role.
        where: and(
          eq(workspaceMembers.workspaceId, input.id),
          // Only include users who are active members, not pending ones.
          inArray(workspaceMembers.role, ["ADMIN", "MEMBER"])
        ),
        with: {
          user: {
            // Include user details, but only public-safe columns
            columns: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      });

      return members;
    }),

  updateMemberRole: isWorkspaceAdmin
    .input(
      z.object({ memberUserId: z.string(), role: z.enum(["ADMIN", "MEMBER"]) })
    )
    .mutation(async ({ input }) => {
      const { id: workspaceId, memberUserId, role } = input;
      if (role === "MEMBER") {
        const adminCountResult = await db
          .select()
          .from(workspaceMembers)
          .where(
            and(
              eq(workspaceMembers.workspaceId, workspaceId),
              eq(workspaceMembers.role, "ADMIN")
            )
          );
        if (
          adminCountResult.length <= 1 &&
          adminCountResult[0]?.userId === memberUserId
        ) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Cannot demote the last admin.",
          });
        }
      }
      return (
        await db
          .update(workspaceMembers)
          .set({ role })
          .where(
            and(
              eq(workspaceMembers.workspaceId, workspaceId),
              eq(workspaceMembers.userId, memberUserId)
            )
          )
          .returning()
      )[0];
    }),

  removeMember: isWorkspaceAdmin
    .input(z.object({ memberUserId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id: workspaceId, memberUserId } = input;
      if (ctx.session.user.id === memberUserId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "Admin cannot remove themselves. Transfer ownership or promote another admin first.",
        });
      }
      const [removed] = await db
        .delete(workspaceMembers)
        .where(
          and(
            eq(workspaceMembers.workspaceId, workspaceId),
            eq(workspaceMembers.userId, memberUserId)
          )
        )
        .returning();
      if (!removed)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Member not found.",
        });
      return removed;
    }),
  /**
   * Get all members with a PENDING role for a workspace.
   * ADMIN ONLY.
   */
  getPendingMembers: isWorkspaceAdmin.query(async ({ input }) => {
    const pendingMembers = await db.query.workspaceMembers.findMany({
      where: and(
        eq(workspaceMembers.workspaceId, input.id),
        eq(workspaceMembers.role, "PENDING")
      ),
      with: {
        user: { columns: { id: true, name: true, email: true, image: true } },
      },
    });
    return pendingMembers;
  }),

  /**
   * Approve a pending request, changing the role to MEMBER.
   * ADMIN ONLY.
   */
  approveRequest: isWorkspaceAdmin
    .input(z.object({ memberUserId: z.string() }))
    .mutation(async ({ input }) => {
      const { id: workspaceId, memberUserId } = input;
      const [approvedMember] = await db
        .update(workspaceMembers)
        .set({ role: "MEMBER" })
        .where(
          and(
            eq(workspaceMembers.workspaceId, workspaceId),
            eq(workspaceMembers.userId, memberUserId),
            eq(workspaceMembers.role, "PENDING") // Make sure we only approve pending members
          )
        )
        .returning();

      if (!approvedMember)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Pending request not found.",
        });
      return approvedMember;
    }),

  /**
   * Deny a pending request, deleting the membership record.
   * ADMIN ONLY.
   */
  denyRequest: isWorkspaceAdmin
    .input(z.object({ memberUserId: z.string() }))
    .mutation(async ({ input }) => {
      const { id: workspaceId, memberUserId } = input;
      const [deniedMember] = await db
        .delete(workspaceMembers)
        .where(
          and(
            eq(workspaceMembers.workspaceId, workspaceId),
            eq(workspaceMembers.userId, memberUserId),
            eq(workspaceMembers.role, "PENDING")
          )
        )
        .returning({ id: workspaceMembers.userId });

      if (!deniedMember)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Pending request not found.",
        });
      return deniedMember;
    }),
});
