import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute(
  "/dashboard/workspaces/$workspaceId/projects/$projectId/"
)({
  component: ProjectPage,
});

function ProjectPage() {
  const { project } = Route.useRouteContext();
  // Get the params from the route to pass them to the Link
  const { workspaceId, projectId } = Route.useParams();

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex items-center gap-x-4">
          {project.imageUrl && (
            <Avatar className="size-10">
              <AvatarImage src={project.imageUrl} alt={project.name} />
              <AvatarFallback>
                {project.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          )}
          <div>
            <h1 className="text-3xl font-bold">{project.name}</h1>
            <p className="text-muted-foreground">
              Monitor your project's tasks and progress.
            </p>
          </div>
        </div>

        <Button asChild>
          {/* FIX: Use the full, absolute path and provide params */}
          <Link
            to="/dashboard/workspaces/$workspaceId/projects/$projectId/settings"
            params={{
              workspaceId,
              projectId,
            }}
          >
            Edit Project
          </Link>
        </Button>
      </div>

      <Separator />

      <div className="h-96 flex items-center justify-center border-2 border-dashed rounded-lg">
        <p className="text-muted-foreground">
          Task board or issue list will be displayed here.
        </p>
      </div>
    </div>
  );
}
