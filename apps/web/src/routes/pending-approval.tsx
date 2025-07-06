import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock } from "lucide-react";

export const Route = createFileRoute("/pending-approval")({
  component: PendingApprovalPage,
});

function PendingApprovalPage() {
  return (
    <div className="flex h-screen items-center justify-center bg-muted/40">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Clock className="size-12 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl">Request Pending</CardTitle>
          <CardDescription>
            Your request to join this workspace is pending approval by a
            workspace administrator.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button asChild>
            <Link to="/dashboard">Back to Dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
