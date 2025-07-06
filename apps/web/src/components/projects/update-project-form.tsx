import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { trpc } from "@/utils/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { RouterOutput } from "@/utils/trpc";

type Project = RouterOutput["project"]["getById"];

const formSchema = z.object({
  name: z.string().min(1, "Name is required."),
  imageUrl: z.string().url("Please provide a valid URL.").or(z.literal("")),
});

export const UpdateProjectForm = ({ project }: { project: Project }) => {
  const queryClient = useQueryClient();

  const updateMutation = useMutation(
    trpc.project.update.mutationOptions({
      onSuccess: (updatedProject) => {
        toast.success("Project updated!");
        // Invalidate queries to update the UI everywhere
        queryClient.invalidateQueries({
          queryKey: trpc.project.getAllByWorkspace.queryOptions({
            workspaceId: project.workspaceId,
          }).queryKey,
        });
        queryClient.invalidateQueries({
          queryKey: trpc.project.getById.queryOptions({ id: project.id })
            .queryKey,
        });
      },
      onError: (err) => toast.error(err.message),
    })
  );

  const form = useForm({
    defaultValues: {
      name: project.name,
      imageUrl: project.imageUrl || "",
    },
    validators: { onChange: formSchema },
    onSubmit: async ({ value }) => {
      updateMutation.mutate({
        id: project.id,
        name: value.name,
        imageUrl: value.imageUrl || null, // Send null if empty
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
                <Label htmlFor={field.name}>Project Name</Label>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  disabled={updateMutation.isPending}
                />
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
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  disabled={updateMutation.isPending}
                />
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
