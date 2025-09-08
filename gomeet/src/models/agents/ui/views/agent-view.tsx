"use client";


import { ErrorState } from "@/components/error_state";
import { LoadingState } from "@/components/loading_state";
import { useTRPC } from "@/trpc/client";
import {  useSuspenseQuery } from "@tanstack/react-query";
import { DataTable } from "../components/data_table";
import { columns} from "../components/columns";
import { AgentGetOne } from "../../types";
import { EmptyState } from "@/components/empty_state";

export const AgentsView =()=>{ 
    const trpc = useTRPC();
    const {data} = useSuspenseQuery(trpc.agents.getMany.queryOptions());

    return(
        <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
            <DataTable data={data} columns={columns} />
            {data.length===0 &&(
             <EmptyState
             title="create your first Agent"
             description="get started with creating your first Agent to attend a meeting "
             />
            )}
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