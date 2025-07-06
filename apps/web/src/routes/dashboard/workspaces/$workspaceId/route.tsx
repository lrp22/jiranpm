import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
// FIX: Import both `trpc` and `queryClient` from the correct path
import { trpc, queryClient } from "@/utils/trpc";
import { TRPCClientError } from "@trpc/client";

export const Route = createFileRoute("/dashboard/workspaces/$workspaceId")({
  beforeLoad: async ({ params }) => {
    // This logic does not need to change
    const workspaceId = parseInt(params.workspaceId, 10);
    if (isNaN(workspaceId)) {
      throw redirect({ to: "/dashboard" });
    }

    try {
      const workspace = await queryClient.fetchQuery(
        trpc.workspace.getById.queryOptions({ id: workspaceId })
      );
      return { workspace };
    } catch (error) {
      if (
        error instanceof TRPCClientError &&
        error.data?.code === "FORBIDDEN"
      ) {
        throw redirect({ to: "/pending-approval" });
      }
      throw redirect({ to: "/dashboard" });
    }
  },
  component: () => <Outlet />,
});
