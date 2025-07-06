import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UpdateProjectForm } from "@/components/projects/update-project-form";
import { Separator } from "@/components/ui/separator";
import { DangerZoneProject } from "../../../../../../components/projects/danger-zone-project";

export const Route = createFileRoute(
  "/dashboard/workspaces/$workspaceId/projects/$projectId/settings"
)({
  component: ProjectSettingsPage,
});

function ProjectSettingsPage() {
  const { project } = Route.useRouteContext();
  // Get the params from the route to pass them to the Link
  const { workspaceId, projectId } = Route.useParams();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon">
          <Link
            to="/dashboard/workspaces/$workspaceId/projects/$projectId"
            params={{
              workspaceId,
              projectId,
            }}
          >
            <ArrowLeftIcon className="size-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Project Settings</h2>
          <p className="text-muted-foreground">
            Manage settings for {project.name}
          </p>
        </div>
      </div>
      <Separator />
      <div className="max-w-3xl space-y-8">
        <UpdateProjectForm project={project} />
        <DangerZoneProject project={project} />
      </div>
    </div>
  );
}
