import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { trpc } from "@/utils/trpc";
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
import type { RouterOutput } from "@/utils/trpc";

type Project = RouterOutput["project"]["getById"];

export const DangerZoneProject = ({ project }: { project: Project }) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation(
    trpc.project.delete.mutationOptions({
      onSuccess: () => {
        toast.success(`Project "${project.name}" deleted.`);
        
        // Invalidate queries to update the project list in the sidebar
        queryClient.invalidateQueries({
          queryKey: trpc.project.getAllByWorkspace.queryOptions({ workspaceId: project.workspaceId }).queryKey,
        });

        // Navigate away from the deleted project's page
        navigate({ to: `/dashboard/workspaces/${project.workspaceId}` });
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
            This action is permanent and cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-end">
          <Button
            variant="destructive"
            onClick={() => setIsConfirmOpen(true)}
            disabled={deleteMutation.isPending}
          >
            Delete this project
          </Button>
        </CardContent>
      </Card>

      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the
              <strong className="mx-1">{project.name}</strong>
              project and all of its associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
              onClick={() => deleteMutation.mutate({ id: project.id })}
            >
              {deleteMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Yes, delete project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};