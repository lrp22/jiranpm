import { createFileRoute } from "@tanstack/react-router";

// This is the index route for a specific workspace, e.g., /dashboard/workspaces/1
export const Route = createFileRoute("/dashboard/workspaces/$workspaceId/")({
  component: WorkspaceDashboard,
});

function WorkspaceDashboard() {
  // Get the workspace data from the parent layout route's context
  const { workspace } = Route.useRouteContext();

  return (
    <div>
      <h2 className="text-3xl font-bold">Welcome to {workspace.name}</h2>
      <p className="mt-2 text-muted-foreground">
        This is the main dashboard for your workspace.
      </p>
      {/* All your dashboard widgets and components go here */}
    </div>
  );
}
