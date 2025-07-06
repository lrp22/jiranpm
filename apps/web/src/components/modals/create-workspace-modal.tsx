import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { useCreateWorkspaceModal } from "@/hooks/use-create-workspace-modal";
import { trpc } from "@/utils/trpc";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// We reuse the exact same schema
const workspaceFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters."),
  imageUrl: z.string().url("Please provide a valid URL.").or(z.literal("")),
});

// A helper for form fields, also reused
function FieldInfo({ field }: { field: any }) {
  return field.state.meta.touchedErrors ? (
    <p className="text-xs text-red-500">{field.state.meta.touchedErrors}</p>
  ) : null;
}

export const CreateWorkspaceModal = () => {
  const { isOpen, close } = useCreateWorkspaceModal();
  const queryClient = useQueryClient();

  const createWorkspaceMutation = useMutation(
    trpc.workspace.create.mutationOptions({
      onSuccess: (newWorkspace) => {
        toast.success(`Workspace "${newWorkspace.name}" created!`);
        // Invalidate the query to refetch the list for the switcher
        queryClient.invalidateQueries({
          queryKey: trpc.workspace.getAll.queryOptions().queryKey,
        });
        form.reset();
        close(); // Close the modal on success
      },
      onError: (error) => {
        toast.error(`Failed to create workspace: ${error.message}`);
      },
    })
  );

  const form = useForm({
    defaultValues: { name: "", imageUrl: "" },
    validators: { onChange: workspaceFormSchema },
    onSubmit: async ({ value }) => {
      createWorkspaceMutation.mutate({
        name: value.name,
        imageUrl: value.imageUrl || undefined,
      });
    },
  });

  const onOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
      close();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a New Workspace</DialogTitle>
          <DialogDescription>
            Give your new workspace a name to get started.
          </DialogDescription>
        </DialogHeader>
        {/* The exact same form logic */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4 pt-4"
        >
          <form.Field
            name="name"
            children={(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Workspace Name</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="e.g., Q2 Marketing Campaign"
                  disabled={createWorkspaceMutation.isPending}
                />
                <FieldInfo field={field} />
              </div>
            )}
          />
          <form.Field
            name="imageUrl"
            children={(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Image URL (Optional)</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="https://example.com/logo.png"
                  disabled={createWorkspaceMutation.isPending}
                />
                <FieldInfo field={field} />
              </div>
            )}
          />
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={close}
              disabled={createWorkspaceMutation.isPending}
            >
              Cancel
            </Button>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  disabled={
                    !canSubmit || isSubmitting || createWorkspaceMutation.isPending
                  }
                >
                  {createWorkspaceMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Create
                </Button>
              )}
            />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};