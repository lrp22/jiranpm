import { z } from "zod";
import { protectedProcedure, router } from "../lib/trpc";
import { db } from "../db";
import { projects } from "../db/schema/projects";
import { and, eq, inArray } from "drizzle-orm";
import { workspaceMembers } from "../db/schema/workspace-members";
import { TRPCError } from "@trpc/server";

export const projectRouter = router({
  /**
   * Get all projects for a given workspace.
   * User must be a member of the workspace to view its projects.
   */
  getAllByWorkspace: protectedProcedure
    .input(z.object({ workspaceId: z.number() }))
    .query(async ({ ctx, input }) => {
      // Security Check: Verify user is a member of the workspace
      const [membership] = await db
        .select()
        .from(workspaceMembers)
        .where(
          and(
            eq(workspaceMembers.userId, ctx.session.user.id),
            eq(workspaceMembers.workspaceId, input.workspaceId)
          )
        );
      if (!membership || membership.role === "PENDING") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      // Fetch projects
      return db
        .select({
          id: projects.id,
          name: projects.name,
          imageUrl: projects.imageUrl,
          workspaceId: projects.workspaceId,
          createdAt: projects.createdAt,
          updatedAt: projects.updatedAt,
        })
        .from(projects)
        .where(eq(projects.workspaceId, input.workspaceId));
    }),

  /**
   * Create a new project in a workspace.
   * User must be a member of the workspace to create a project.
   */
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, "Name is required."),
        workspaceId: z.number(),
        imageUrl: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Security Check: Verify user is a member of the workspace
      const [membership] = await db
        .select()
        .from(workspaceMembers)
        .where(
          and(
            eq(workspaceMembers.userId, ctx.session.user.id),
            eq(workspaceMembers.workspaceId, input.workspaceId)
          )
        );
      if (!membership || membership.role === "PENDING") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      // Create the project
      const [newProject] = await db.insert(projects).values(input).returning();
      return newProject;
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1, "Name is required."),
        imageUrl: z.string().optional().nullable(), // Make imageUrl optional and nullable
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...rest } = input;

      const [projectToUpdate] = await db
        .select()
        .from(projects)
        .where(eq(projects.id, id));

      if (!projectToUpdate) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found.",
        });
      }

      // Security Check: Ensure the user is a member of the workspace the project belongs to
      const [membership] = await db
        .select()
        .from(workspaceMembers)
        .where(
          and(
            eq(workspaceMembers.userId, ctx.session.user.id),
            eq(workspaceMembers.workspaceId, projectToUpdate.workspaceId)
          )
        );
      if (!membership || membership.role === "PENDING") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const [updatedProject] = await db
        .update(projects)
        .set(rest)
        .where(eq(projects.id, id))
        .returning();

      return updatedProject;
    }),
  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const [project] = await db
        .select()
        .from(projects)
        .where(eq(projects.id, input.id));

      if (!project) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      // Security Check: Verify user is a member of the parent workspace
      const [membership] = await db
        .select()
        .from(workspaceMembers)
        .where(
          and(
            eq(workspaceMembers.userId, ctx.session.user.id),
            eq(workspaceMembers.workspaceId, project.workspaceId),
            inArray(workspaceMembers.role, ["ADMIN", "MEMBER"])
          )
        );

      if (!membership) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      return project;
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      // First, find the project to get its workspaceId for the security check
      const [projectToDelete] = await db
        .select({ workspaceId: projects.workspaceId })
        .from(projects)
        .where(eq(projects.id, id));

      if (!projectToDelete) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found.",
        });
      }

      // Security Check: Verify user is an ADMIN of the parent workspace
      const [membership] = await db
        .select()
        .from(workspaceMembers)
        .where(
          and(
            eq(workspaceMembers.userId, ctx.session.user.id),
            eq(workspaceMembers.workspaceId, projectToDelete.workspaceId)
          )
        );

      if (membership?.role !== "ADMIN") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You must be a workspace admin to delete projects.",
        });
      }

      // If security check passes, delete the project
      const [deletedProject] = await db
        .delete(projects)
        .where(eq(projects.id, id))
        .returning({ id: projects.id });

      return deletedProject;
    }),
});
