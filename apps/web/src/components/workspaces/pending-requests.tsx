import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Check, Loader2, X } from "lucide-react";

import { trpc } from "@/utils/trpc";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { Workspace } from "@/lib/types";

export const PendingRequestsList = ({
  workspace,
}: {
  workspace: Workspace;
}) => {
  const queryClient = useQueryClient();

  // Define query options to be reused for fetching and invalidation
  const pendingQueryOptions = trpc.workspace.getPendingMembers.queryOptions({
    id: workspace.id,
  });
  const membersQueryOptions = trpc.workspace.getMembers.queryOptions({
    id: workspace.id,
  });

  const { data: pendingMembers, isLoading } = useQuery(pendingQueryOptions);

  const approveMutation = useMutation(
    trpc.workspace.approveRequest.mutationOptions({
      onSuccess: () => {
        toast.success("Member approved.");
        queryClient.invalidateQueries({
          queryKey: pendingQueryOptions.queryKey,
        });
        queryClient.invalidateQueries({
          queryKey: membersQueryOptions.queryKey,
        });
      },
      onError: (err) => toast.error(err.message),
    })
  );

  const denyMutation = useMutation(
    trpc.workspace.denyRequest.mutationOptions({
      onSuccess: () => {
        toast.info("Request denied.");
        queryClient.invalidateQueries({
          queryKey: pendingQueryOptions.queryKey,
        });
      },
      onError: (err) => toast.error(err.message),
    })
  );

  if (isLoading) return <Loader2 className="h-6 w-6 animate-spin" />;
  if (!pendingMembers || pendingMembers.length === 0) return null;

  return (
    <Card className="border-amber-500">
      <CardHeader>
        <CardTitle>Pending Requests</CardTitle>
        <CardDescription>
          Approve or deny requests to join this workspace.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {pendingMembers.map((req) => (
          <div key={req.userId} className="flex items-center justify-between">
            <div className="flex items-center gap-x-4">
              <Avatar>
                <AvatarImage src={req.user.image ?? ""} />
                <AvatarFallback>{req.user.name?.[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{req.user.name}</p>
                <p className="text-sm text-muted-foreground">
                  {req.user.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-x-2">
              <Button
                size="icon"
                variant="outline"
                disabled={approveMutation.isPending || denyMutation.isPending}
                onClick={() =>
                  denyMutation.mutate({
                    id: workspace.id,
                    memberUserId: req.userId,
                  })
                }
              >
                <X className="size-4 text-destructive" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                disabled={approveMutation.isPending || denyMutation.isPending}
                onClick={() =>
                  approveMutation.mutate({
                    id: workspace.id,
                    memberUserId: req.userId,
                  })
                }
              >
                <Check className="size-4 text-emerald-500" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
