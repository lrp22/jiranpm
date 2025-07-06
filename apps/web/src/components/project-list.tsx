import { useQuery } from "@tanstack/react-query";
import { Link, useRouterState } from "@tanstack/react-router";
import { PlusCircle } from "lucide-react";
import { trpc } from "@/utils/trpc";
import { useCreateProjectModal } from "@/hooks/use-create-project-modal";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "./ui/button";

// 1. Import the Avatar components
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export const ProjectList = () => {
  const { open } = useCreateProjectModal();
  const { matches } = useRouterState();
  const lastMatch = matches[matches.length - 1];
  const params = lastMatch?.params ?? {};
  const workspaceId =
    "workspaceId" in params ? parseInt(String(params.workspaceId)) : null;

  const { data: projects, isLoading } = useQuery(
    trpc.project.getAllByWorkspace.queryOptions(
      { workspaceId: workspaceId! },
      { enabled: !!workspaceId }
    )
  );

  if (!workspaceId) return null;

  return (
    <div className="flex flex-col gap-y-2 mt-4">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-neutral-500">Projects</p>
        <Button variant="ghost" size="icon" onClick={() => open(workspaceId)}>
          <PlusCircle className="size-4 text-neutral-500 cursor-pointer hover:opacity-75 transition" />
        </Button>
      </div>
      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-7 w-full" />
          <Skeleton className="h-7 w-full" />
        </div>
      ) : (
        <ul className="space-y-1">
          {projects?.map((project) => (
            <li key={project.id}>
              <Link
                to="/dashboard/workspaces/$workspaceId/projects/$projectId"
                params={{
                  workspaceId: workspaceId.toString(),
                  projectId: project.id.toString(),
                }}
                // 2. Add flexbox classes to align the avatar and text
                className="flex items-center gap-x-2 text-sm p-1.5 rounded-md text-neutral-600 hover:bg-neutral-200 dark:text-neutral-300 dark:hover:bg-neutral-800"
                activeProps={{
                  className:
                    "!bg-neutral-200 dark:!bg-neutral-800 font-semibold",
                }}
              >
                {/* 3. Add the Avatar component */}
                <Avatar className="size-5">
                  <AvatarImage
                    src={project.imageUrl ?? ""}
                    alt={project.name}
                  />
                  <AvatarFallback className="text-xs">
                    {project.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="truncate">{project.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
