"use client";

import { DataTable } from "@/components/data_table";
import { ErrorState } from "@/components/error_state";
import { LoadingState } from "@/components/loading_state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { columns } from "../components/columns";

export const MeetingsView=()=>{
    
    const trpc=useTRPC();
    const {data}=useSuspenseQuery(trpc.meetings.getMany.queryOptions({}));

    return(
        <div className="flex flex-col flex-1 pb-4 px-4 gap-y-4">
            <DataTable data={data.items} columns={columns} />
        </div>
    )
}
export const MeetingsViewLoading=()=>{ 
    return(
        <LoadingState 
        title="loading..."
        description="this may take a while"
        />
    );
};

export const MeetingsViewError=()=>{ 
    return(
       <ErrorState title={'Error'} description={'Something went wrong'}/>
    );
};