import { toast } from "sonner";
import { CopyIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Workspace } from "@/lib/types";

type Props = {
  workspace: Workspace;
};

export const InviteCard = ({ workspace }: Props) => {
  // Construct the full, shareable invite link
  const inviteLink = `${window.location.origin}/join/${workspace.inviteCode}`;

  const onCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    toast.success("Invite link copied to clipboard!");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invite Members</CardTitle>
        <CardDescription>
          Share this link with others to invite them to your workspace.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="invite-link">Invite Link</Label>
          <div className="flex items-center gap-x-2">
            <Input id="invite-link" readOnly value={inviteLink} />
            <Button onClick={onCopy} variant="ghost" size="icon">
              <span className="sr-only">Copy invite link</span>
              <CopyIcon className="size-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
