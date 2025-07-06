import { createFileRoute } from "@tanstack/react-router";
import { UpdateWorkspaceForm } from "@/components/workspaces/update-workspace-form";
import { DangerZone } from "@/components/workspaces/danger-zone";
import { Separator } from "@/components/ui/separator";
import { InviteCard } from "@/components/workspaces/invite-card";

export const Route = createFileRoute("/dashboard/workspaces/$workspaceId/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  // Get the workspace data from the parent layout route's context
  const { workspace } = Route.useRouteContext();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Workspace Settings</h2>
        <p className="text-muted-foreground">
          Manage settings for <span className="font-semibold">{workspace.name}</span>.
        </p>
      </div>
      <Separator />
      <div className="max-w-3xl space-y-6">
        <UpdateWorkspaceForm workspace={workspace} />
        <InviteCard workspace={workspace} />
        <DangerZone workspace={workspace} />
      </div>
    </div>
  );
}