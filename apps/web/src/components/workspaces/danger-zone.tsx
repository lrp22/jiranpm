import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { trpc } from "@/utils/trpc";
import { useWorkspaceStore } from "@/stores/use-workspace-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Workspace } from "@/lib/types";

type Props = {
  workspace: Workspace;
};

export const DangerZone = ({ workspace }: Props) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const setLastWorkspaceId = useWorkspaceStore((s) => s.setLastWorkspaceId);

  const deleteMutation = useMutation(
    trpc.workspace.delete.mutationOptions({
      onSuccess: () => {
        toast.success(`Workspace "${workspace.name}" deleted.`);
        // Clear the persisted ID if it was the one we just deleted
        if (useWorkspaceStore.getState().lastWorkspaceId === workspace.id.toString()) {
            setLastWorkspaceId("");
        }
        // Invalidate queries and navigate away
        queryClient.invalidateQueries({
          queryKey: trpc.workspace.getAll.queryOptions().queryKey,
        });
        navigate({ to: "/dashboard/workspaces" });
      },
      onError: (error) => {
        toast.error(`Failed to delete: ${error.message}`);
      },
    })
  );

  return (
    <>
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle>Danger Zone</CardTitle>
          <CardDescription>
            These actions are permanent and cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-end">
          <Button
            variant="destructive"
            onClick={() => setIsConfirmOpen(true)}
            disabled={deleteMutation.isPending}
          >
            Delete this workspace
          </Button>
        </CardContent>
      </Card>

      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              <strong className="mx-1">{workspace.name}</strong>
              workspace and all of its associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
              onClick={() => deleteMutation.mutate({ id: workspace.id })}
            >
              {deleteMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Yes, delete workspace
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};