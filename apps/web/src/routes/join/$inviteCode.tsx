import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { trpc } from "@/utils/trpc";
import { useEffect } from "react";
import { toast } from "sonner";
import { MoonLoader } from "react-spinners";

// 1. Import the main `useMutation` hook from TanStack Query
import { useMutation } from "@tanstack/react-query";

export const Route = createFileRoute("/join/$inviteCode")({
  component: JoinWorkspacePage,
});

function JoinWorkspacePage() {
  const { inviteCode } = Route.useParams();
  const navigate = useNavigate();

  // 2. Use the correct, established pattern for mutations
  const joinMutation = useMutation(
    trpc.workspace.join.mutationOptions({
      onSuccess: (data) => {
        // Show the success message from the backend
        toast.success(data.message);
        // Redirect to the main dashboard after showing the message
        navigate({ to: "/dashboard" });
      },
      onError: (error) => {
        toast.error(error.message);
        navigate({ to: "/dashboard" });
      },
    })
  );

  // Trigger the mutation when the component mounts
  useEffect(() => {
    if (inviteCode) {
      joinMutation.mutate({ inviteCode });
    }
  }, [inviteCode]); // Dependency array ensures this runs once

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-y-4">
      <h2 className="text-xl font-medium">Joining workspace...</h2>
      <MoonLoader color="#000aff" loading size={40} />
    </div>
  );
}
