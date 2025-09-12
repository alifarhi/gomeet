"use client";

import { ErrorState } from "@/components/error_state";
import { LoadingState } from "@/components/loading_state";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { AgentIdViewHeader } from "../components/agent-id-view-header";
import { UpdateAgentDialog } from "../components/update_agent_dialog";
import { GeneratedAvatar } from "@/components/generator-avatar";
import { Badge } from "@/components/ui/badge";
import { VideoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/use_confirm";
import { useState } from "react";


interface Props{
    agentId:string;
}


export const AgentIdView = ({agentId}:Props) => {
const [UpdateAgentDialogOpen,setupdateAgentDialogOpen]=useState(false);
const router =useRouter();
const queryClient =useQueryClient();
const trpc= useTRPC();
const {data}= useSuspenseQuery(trpc.agents.getOne.queryOptions({id:agentId}));
const removeAgent =useMutation(
    trpc.agents.remove.mutationOptions({
        onSuccess:()=>{
            queryClient.invalidateQueries(trpc.agents.getMany.queryOptions({}));
           router.push("/agents");
        },
        onError:(error)=>{
              toast.error(error.message)
        }
    }),
);
 const [RemoveConfirmation,confirmRemove]=useConfirm(
    "are you sure?",
    `the following action will remove ${data.meetingCount} associated meetings`
 );

 const handleRemoveAgent=async()=>{
    const ok=await confirmRemove();

    if(!ok) return;
    await removeAgent.mutate({id:agentId})
 }
 
  return (
    <>
    
    <RemoveConfirmation/>
    <UpdateAgentDialog 
        open={UpdateAgentDialogOpen}
        onOpenChange={setupdateAgentDialogOpen}
        initialValues={data}
    />
    <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
         <AgentIdViewHeader
         agentId={agentId}
         agentName={data.name}
         onEdit={()=>setupdateAgentDialogOpen(true)}
         onRemove={handleRemoveAgent}
         />
         <div className="bg-white rounded-lg border">
            <div className="px-4 py-5 gap-y-5 flex flex-col col-span-5">
                 <div className="flex items-center gap-x-3">
                     <GeneratedAvatar variant="botttsNeutral" seed={data.name} className="size-10" />
                     <h2 className="text-2xl font-medium" >{data.name}</h2>
                 </div>
                 <Badge variant="outline" className="flex items-center gap-x-2 [&>svg]:size-4" >
                    <VideoIcon className="text-blue-700"/>
                    {data.meetingCount} {data.meetingCount===1?"meeting":"meetings"}
                 </Badge>
                 <div className="flex flex-col gap-y-4 " >
                      <p className="font-medium text-lg underline" >Instructions:</p>
                      <p className="text-neutral-800 pl-2.5 pr-2.5">{data.instractions}</p>
                 </div>
            </div>
         </div>
    </div>
     </>
  );
};

export const AgentIdViewLoading=()=>{ 
    return(
        <LoadingState 
        title="loading..."
        description="this may take a while"
        />
    );
};

export const AgentIdViewError=()=>{ 
    return(
       <ErrorState title={'Error'} description={'Something went wrong'}/>
    );
};
