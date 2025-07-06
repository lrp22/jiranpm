// apps/web/src/components/workspace-switcher.tsx

import { RiAddCircleFill } from "react-icons/ri";
import { trpc } from "@/utils/trpc";
import { useCreateWorkspaceModal } from "@/hooks/use-create-workspace-modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useWorkspaceStore } from "@/stores/use-workspace-store";
import { useNavigate, useRouterState } from "@tanstack/react-router";

const WorkspaceAvatar = ({
  name,
  image,
}: {
  name: string;
  image?: string | null;
}) => {
  if (image) {
    return (
      <img src={image} alt={name} className="size-8 rounded-2xl object-cover" />
    );
  }
  return (
    <div className="size-8 rounded-sm bg-neutral-700 text-white flex items-center justify-center text-xs font-bold">
      {name[0].toUpperCase()}
    </div>
  );
};

export const WorkspaceSwitcher = () => {
  const navigate = useNavigate();
  const { matches } = useRouterState();
  const lastMatch = matches[matches.length - 1];
  const params = lastMatch?.params ?? {}; // Safely get params, default to empty object
  const workspaceId =
    "workspaceId" in params ? String(params.workspaceId) : undefined;

  const { data: workspaces, isLoading } = useQuery(
    trpc.workspace.getAll.queryOptions()
  );

  const { open } = useCreateWorkspaceModal();

  const setLastWorkspaceId = useWorkspaceStore(
    (state) => state.setLastWorkspaceId
  );

  const onSelect = (id: string) => {
    setLastWorkspaceId(id);
    navigate({ to: `/dashboard/workspaces/${id}` });
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between mb-2">
        <p className="text-lg uppercase text-neutral-500">Workspaces</p>
        <RiAddCircleFill
          onClick={open}
          className="size-6 text-neutral-500 cursor-pointer hover:opacity-75 transition"
          aria-label="Create new workspace"
        />
      </div>
      <Select onValueChange={onSelect} value={workspaceId}>
        <SelectTrigger className="w-full bg-neutral-200 dark:bg-neutral-800 font-medium p-2 h-auto">
          <SelectValue placeholder="Select a workspace" />
        </SelectTrigger>
        <SelectContent>
          {workspaces?.map((workspace) => (
            <SelectItem key={workspace.id} value={workspace.id.toString()}>
              <div className="flex justify-start items-center gap-2 font-medium">
                <WorkspaceAvatar
                  name={workspace.name}
                  image={workspace.imageUrl}
                />
                <span className="text-lg truncate">{workspace.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
