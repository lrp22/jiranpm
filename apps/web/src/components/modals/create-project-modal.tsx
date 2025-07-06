import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { useCreateProjectModal } from "@/hooks/use-create-project-modal";
import { trpc } from "@/utils/trpc";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// FIX #1: The Zod schema now expects a string, which can be a valid URL or an empty string.
const formSchema = z.object({
  name: z.string().min(1, "Name is required."),
  imageUrl: z.string().url("Please provide a valid URL.").or(z.literal("")),
});

export const CreateProjectModal = () => {
  const { isOpen, close, workspaceId } = useCreateProjectModal();
  const queryClient = useQueryClient();

  const createMutation = useMutation(
    trpc.project.create.mutationOptions({
      onSuccess: () => {
        toast.success("Project created!");
        if (!workspaceId) return;
        queryClient.invalidateQueries({
          queryKey: trpc.project.getAllByWorkspace.queryOptions({ workspaceId })
            .queryKey,
        });
        form.reset();
        close();
      },
      onError: (err) => toast.error(err.message),
    })
  );

  const form = useForm({
    // FIX #2: The default value for imageUrl is now an empty string, not null.
    defaultValues: { name: "", imageUrl: "" },
    validators: { onChange: formSchema },
    onSubmit: async ({ value }) => {
      if (!workspaceId) return;
      // FIX #3: If imageUrl is an empty string, send `undefined` to the backend.
      createMutation.mutate({
        name: value.name,
        workspaceId,
        imageUrl: value.imageUrl || undefined,
      });
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
        </DialogHeader>
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
                <Label htmlFor={field.name}>Project Name</Label>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="e.g., Q3 Marketing Launch"
                  disabled={createMutation.isPending}
                />
              </div>
            )}
          />
          {/* This `name` prop is now correct because the form type is consistent */}
          <form.Field
            name="imageUrl"
            children={(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Image URL (Optional)</Label>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="https://example.com/image.png"
                  disabled={createMutation.isPending}
                />
              </div>
            )}
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
