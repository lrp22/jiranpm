import { initTRPC, TRPCError } from "@trpc/server";
import type { Context } from "./context";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { workspaceMembers } from "@/db/schema/workspace-members";
import { db } from "@/db";

export const t = initTRPC.context<Context>().create();
export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Authentication required",
      cause: "No session",
    });
  }
  return next({
    ctx: {
      ...ctx,
      session: ctx.session,
    },
  });
});

export const isWorkspaceAdmin = protectedProcedure
  .input(z.object({ id: z.number() }))
  .use(async ({ ctx, input, next }) => {
    const { user } = ctx.session;

    const [membership] = await db // FIX: Select from the table schema `workspaceMembers`, not the relations object.
      .select({ role: workspaceMembers.role })
      .from(workspaceMembers)
      .where(
        and(
          eq(workspaceMembers.userId, user.id),
          eq(workspaceMembers.workspaceId, input.id)
        )
      );
    if (membership?.role !== "ADMIN") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You must be an admin to perform this action.",
      });
    }

    return next({
      ctx: {
        ...ctx,
        membership,
      },
    });
  });
