import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";
import { CreateWorkspaceForm } from "@/components/workspaces/create-workspace-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardIndexPage,
});

function DashboardIndexPage() {
  const { data: workspaces, isLoading } = useQuery(
    trpc.workspace.getAll.queryOptions()
  );

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {workspaces && workspaces.length > 0 ? (
        <div>
          <h2 className="text-3xl font-bold">Your Workspaces</h2>
          <p className="text-muted-foreground">
            Select a workspace from the sidebar to continue.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {workspaces.map((ws) => (
              <Link
                to="/dashboard/workspaces/$workspaceId"
                params={{
                  // FIX: Convert the numeric ID to a string
                  workspaceId: ws.id.toString(),
                }}
                key={ws.id}
              >
                <Card className="hover:border-primary/60 transition">
                  <CardHeader>
                    <CardTitle>{ws.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Created on: {new Date(ws.createdAt).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="max-w-2xl">
          <CreateWorkspaceForm />
        </div>
      )}
    </div>
  );
}
