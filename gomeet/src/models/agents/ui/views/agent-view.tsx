"use client";


import { ErrorState } from "@/components/error_state";
import { LoadingState } from "@/components/loading_state";
import { useTRPC } from "@/trpc/client";
import {  useSuspenseQuery } from "@tanstack/react-query";

export const AgentsView =()=>{ 
    const trpc = useTRPC();
    const {data} = useSuspenseQuery(trpc.agents.getMany.queryOptions());


    return(
        <div>
            {JSON.stringify(data,null,2)}
        </div>
    );
};

export const AgentViewLoading=()=>{ 
    return(
        <LoadingState 
        title="loading..."
        description="this may take a while"
        />
    );
};

export const AgentViewError=()=>{ 
    return(
       <ErrorState title={'Error'} description={'Something went wrong'}/>
    );
};