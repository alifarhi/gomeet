import { AgentsView, AgentViewError, AgentViewLoading } from "@/models/agents/ui/views/agent-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import { AgentListHeader } from "@/models/agents/ui/components/list-header";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

 const page = async() => {
    const session = await auth.api.getSession({
        headers: await headers(),
      });
      if(!session){
        redirect("/sign-in")
      }
   const queryClient=getQueryClient();
   void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions())
  return (
    <>
    <AgentListHeader/>
    <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<AgentViewLoading/>}>
        <ErrorBoundary fallback={<AgentViewError/>}>
            <AgentsView/>
        </ErrorBoundary>
            
        </Suspense>
        
    </HydrationBoundary> 
    </> 
);
};
export default page;