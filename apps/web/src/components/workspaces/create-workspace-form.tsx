import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/utils/trpc";

const workspaceFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters."),
  imageUrl: z.string().url("Please provide a valid URL.").or(z.literal("")),
});

function FieldInfo({ field }: { field: any }) {
  return (
    <>
      {field.state.meta.touchedErrors ? (
        <p className="text-xs text-red-500">{field.state.meta.touchedErrors}</p>
      ) : null}
    </>
  );
}

export const CreateWorkspaceForm = () => {
  const queryClient = useQueryClient();

  const createWorkspaceMutation = useMutation(
    trpc.workspace.create.mutationOptions({
      onSuccess: (newWorkspace) => {
        toast.success(`Workspace "${newWorkspace.name}" created!`);
        // Refetch all workspaces to update lists across the app
        queryClient.invalidateQueries({
          queryKey: trpc.workspace.getAll.queryOptions().queryKey,
        });
        form.reset();
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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create Your First Workspace</CardTitle>
        <CardDescription>
          Give your new workspace a name to get started.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
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
                  placeholder="e.g., Marketing Team"
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
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <Button
                type="submit"
                disabled={
                  !canSubmit ||
                  isSubmitting ||
                  createWorkspaceMutation.isPending
                }
              >
                {createWorkspaceMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Workspace
              </Button>
            )}
          />
        </form>
      </CardContent>
    </Card>
  );
};
