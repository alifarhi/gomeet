"use client";

import { DataTable } from "@/components/data_table";
import { ErrorState } from "@/components/error_state";
import { LoadingState } from "@/components/loading_state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { columns } from "../components/columns";
import { useRouter } from "next/navigation";
import { useMeetingsFiltre } from "../../hooks/use-meetings-filtre";
import { DataPagination } from "@/components/datapagination";
import { EmptyState } from "@/components/empty_state";

export const MeetingsView=()=>{
    const [filters,setFilters]=useMeetingsFiltre();
    const router=useRouter()
    const trpc=useTRPC();
    const {data}=useSuspenseQuery(trpc.meetings.getMany.queryOptions({
        ...filters,
    }));

    return(
        <div className="flex flex-col flex-1 pb-4 px-4 gap-y-4">
            <DataTable data={data.items} columns={columns} onRowClick={(row)=>router.push(`/meetings/${row.id}`)} />
            <DataPagination page={filters.page} totalPages={data.totalPages} onPageChange={(page)=>setFilters({page})} />
                {data.items.length===0 &&(
            <EmptyState
             title="create your first Meeting"
             description="get started with creating your first Agent to attend a meeting "
            />
             )}
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