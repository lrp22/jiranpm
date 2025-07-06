import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";

import { trpc } from "@/utils/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Button } from "@/components/ui/button";
import { useSession } from "@/hooks/use-session";

import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "../../../../../../server/src/routers/index";
import { PendingRequestsList } from "@/components/workspaces/pending-requests";

// Use tRPC's official type helper for robust types
type RouterOutput = inferRouterOutputs<AppRouter>;
type Member = RouterOutput["workspace"]["getMembers"][number];

export const Route = createFileRoute(
  "/dashboard/workspaces/$workspaceId/members"
)({
  component: MembersPage,
});

function MembersPage() {
  // 1. Get workspace data from the parent route's context
  const { workspace } = Route.useRouteContext();
  const session = useSession();
  const queryClient = useQueryClient();
  const [memberToRemove, setMemberToRemove] = useState<Member | null>(null);

  // 2. Set up data fetching and mutations using established patterns
  const getQueryOptions = () =>
    trpc.workspace.getMembers.queryOptions({ id: workspace.id });

  const { data: members, isLoading } = useQuery(getQueryOptions());

  const updateRoleMutation = useMutation(
    trpc.workspace.updateMemberRole.mutationOptions({
      onSuccess: () => {
        toast.success("Member role updated.");
        queryClient.invalidateQueries({ queryKey: getQueryOptions().queryKey });
      },
      onError: (error) => toast.error(error.message),
    })
  );

  const removeMemberMutation = useMutation(
    trpc.workspace.removeMember.mutationOptions({
      onSuccess: () => {
        toast.success("Member removed from workspace.");
        queryClient.invalidateQueries({ queryKey: getQueryOptions().queryKey });
        setMemberToRemove(null);
      },
      onError: (error) => toast.error(error.message),
    })
  );

  // 3. Guard against null session object before rendering
  if (!session || !session.user) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // 4. Correctly check for admin privileges using the right data shape
  const currentUserMembership = members?.find(
    (m) => m.userId === session.user.id
  );
  const isCurrentUserAdmin = currentUserMembership?.role === "ADMIN";

  return (
    <>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold">Members</h2>
          <p className="text-muted-foreground">
            Manage who has access to{" "}
            <span className="font-semibold">{workspace.name}</span>.
          </p>
        </div>
        <Card>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <div className="space-y-4">
                {members?.map((member) => (
                  <div
                    key={member.userId}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-x-4">
                      <Avatar>
                        <AvatarImage src={member.user.image ?? ""} />
                        <AvatarFallback>{member.user.name?.[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{member.user.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {member.user.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-x-2">
                      {/* Conditionally render admin controls */}
                      {isCurrentUserAdmin && (
                        <Select
                          defaultValue={member.role}
                          disabled={
                            updateRoleMutation.isPending ||
                            member.userId === session.user.id // Admin can't change their own role
                          }
                          onValueChange={(role: "ADMIN" | "MEMBER") => {
                            updateRoleMutation.mutate({
                              id: workspace.id,
                              memberUserId: member.userId,
                              role,
                            });
                          }}
                        >
                          <SelectTrigger className="w-[110px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ADMIN">Admin</SelectItem>
                            <SelectItem value="MEMBER">Member</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                      {isCurrentUserAdmin &&
                        member.userId !== session.user.id && ( // Admin can't remove themself
                          <Button
                            size="icon"
                            variant="ghost"
                            disabled={removeMemberMutation.isPending}
                            onClick={() => setMemberToRemove(member)}
                          >
                            <Trash2 className="size-4 text-destructive" />
                          </Button>
                        )}
                      {!isCurrentUserAdmin && (
                        <p className="w-[110px] text-right text-sm font-medium text-muted-foreground">
                          {member.role}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        {isCurrentUserAdmin && <PendingRequestsList workspace={workspace} />}
      </div>

      {/* Confirmation Dialog for Removing a Member */}
      <AlertDialog
        open={!!memberToRemove}
        onOpenChange={(isOpen) => !isOpen && setMemberToRemove(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove{" "}
              <strong>{memberToRemove?.user.name}</strong> from the workspace.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={removeMemberMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              disabled={removeMemberMutation.isPending}
              onClick={() => {
                if (memberToRemove) {
                  removeMemberMutation.mutate({
                    id: workspace.id,
                    memberUserId: memberToRemove.userId,
                  });
                }
              }}
            >
              {removeMemberMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Yes, remove member
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
