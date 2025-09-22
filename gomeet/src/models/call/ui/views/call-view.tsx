"use client"

import { ErrorState } from "@/components/error_state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQueries, useSuspenseQuery } from "@tanstack/react-query";
import { CallProvider } from "../components/call-provider";

interface Props {
  meetingId: string;
}

export const CallView = ({ meetingId }: Props) => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.meetings.getOne.queryOptions({id:meetingId}));
if(data.status==="completed"){
   return(
   <div className="flex h-screen items-center justify-center" >
       <ErrorState 
       title="Meeting ended"
       description="the Meeting ended you can no longer enter "
       />
    </div>
)}

  return <CallProvider meetingId={meetingId} meetingName={data.name} />
};
