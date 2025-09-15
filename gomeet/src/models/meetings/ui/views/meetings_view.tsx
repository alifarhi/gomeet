"use client";

import { ErrorState } from "@/components/error_state";
import { LoadingState } from "@/components/loading_state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export const MeetingsView=()=>{
    
    const trpc=useTRPC();
    const {data}=useSuspenseQuery(trpc.meetings.getMany.queryOptions({}));

    return(
        <div>
            todo
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