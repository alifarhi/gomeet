

import { AgentIdView, AgentIdViewError, AgentIdViewLoading } from "@/models/agents/ui/views/agent-id-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary, queryOptions } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";


interface Props{
    params:Promise<{agentId: string}>
}


export const page = async({params}:Props) => {
    const {agentId}=await params;
    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(
        trpc.agents.getOne.queryOptions({id:agentId})
    );

  return (
<HydrationBoundary state={dehydrate(queryClient)}>
  <Suspense fallback={<AgentIdViewLoading/>} >
    <ErrorBoundary  fallback={<AgentIdViewError/>}>
         <AgentIdView agentId={agentId}/>
    </ErrorBoundary>
  </Suspense>
</HydrationBoundary>
)
};

export default page;
