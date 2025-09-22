"use client";

interface Props {
  meetingId: string;
  meetingName: string;
}

import { authClient } from "@/lib/auth-clients";
import { LoaderIcon } from "lucide-react";
import React from "react";
import { CallConnect } from "./call-connect";
import { generateAvatarUi } from "@/lib/avatar";

export const CallProvider = ({ meetingId, meetingName }: Props) => {
  const { data, isPending } = authClient.useSession();

  if (!data || isPending) {
    return (
      <div className="flex items-center h-screen justify-center bg-radial from-sidebar-accent to-sidebar">
        <LoaderIcon className="size-6 animate-spin text-white" />
      </div>
    );
  }
  return (
    <CallConnect
      meetingId={meetingId}
      meetingName={meetingName}
      userId={data.user.id}
      userName={data.user.name}
      userImage={data.user.image ?? generateAvatarUi({seed:data.user.name,variant:"initials"})}
    />
  );
};
