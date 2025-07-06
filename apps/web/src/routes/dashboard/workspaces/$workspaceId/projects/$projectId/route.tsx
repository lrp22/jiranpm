import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { queryClient } from "@/utils/trpc";
import { trpc } from "@/utils/trpc";

export const Route = createFileRoute(
  "/dashboard/workspaces/$workspaceId/projects/$projectId"
)({
  // Fetch the specific project before loading the component
  beforeLoad: async ({ params }) => {
    const projectId = parseInt(params.projectId, 10);
    if (isNaN(projectId)) {
      throw redirect({ to: ".." }); // Redirect to parent if ID is invalid
    }
    const project = await queryClient.fetchQuery(
      trpc.project.getById.queryOptions({ id: projectId })
    );
    return { project }; // Provide project data to all child routes
  },
  component: () => <Outlet />, // This component just renders child routes
});
