import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { trpc } from "@/utils/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Workspace } from "@/lib/types";

// Reusable schema for validation
const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters."),
  imageUrl: z.string().url("Please provide a valid URL.").or(z.literal("")),
});

// Helper for displaying field errors
function FieldInfo({ field }: { field: any }) {
  return field.state.meta.touchedErrors ? (
    <p className="text-xs text-red-500">{field.state.meta.touchedErrors}</p>
  ) : null;
}

type Props = {
  workspace: Workspace;
};

export const UpdateWorkspaceForm = ({ workspace }: Props) => {
  const queryClient = useQueryClient();

  const updateMutation = useMutation(
    trpc.workspace.update.mutationOptions({
      onSuccess: (updatedWorkspace) => {
        toast.success("Workspace settings saved!");
        // Invalidate queries to refetch data and update the UI everywhere
        queryClient.invalidateQueries({
          queryKey: trpc.workspace.getAll.queryOptions().queryKey,
        });
        queryClient.invalidateQueries({
          queryKey: trpc.workspace.getById.queryOptions({
            id: updatedWorkspace.id,
          }).queryKey,
        });
      },
      onError: (error) => {
        toast.error(`Failed to save: ${error.message}`);
      },
    })
  );

  const form = useForm({
    // Pre-populate the form with the current workspace data
    defaultValues: {
      name: workspace.name,
      imageUrl: workspace.imageUrl || "",
    },
    validators: { onChange: formSchema },
    onSubmit: async ({ value }) => {
      updateMutation.mutate({
        id: workspace.id,
        name: value.name,
        imageUrl: value.imageUrl || undefined,
      });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>General Settings</CardTitle>
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
                  disabled={updateMutation.isPending}
                />
                <FieldInfo field={field} />
              </div>
            )}
          />
          <form.Field
            name="imageUrl"
            children={(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Avatar URL (Optional)</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  disabled={updateMutation.isPending}
                />
                <FieldInfo field={field} />
              </div>
            )}
          />
          <div className="flex justify-end">
            <form.Subscribe
              selector={(state) => [
                state.canSubmit,
                state.isSubmitting,
                state.isDirty,
              ]}
              children={([canSubmit, isSubmitting, isDirty]) => (
                <Button
                  type="submit"
                  disabled={
                    !canSubmit ||
                    isSubmitting ||
                    updateMutation.isPending ||
                    !isDirty
                  }
                >
                  {updateMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save Changes
                </Button>
              )}
            />
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
