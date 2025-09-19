"use client"

interface Props{
    meetingId:string;
}

import { ErrorState } from '@/components/error_state';
import { LoadingState } from '@/components/loading_state';
import { useTRPC } from '@/trpc/client';
import { QueryClient, useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import React, { useState } from 'react'
import { MeetingIdViewHeader } from '../components/meeting-id-view-header';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useConfirm } from '@/hooks/use_confirm';
import { UpdateMeetingDialog } from '../components/Update-meeting-dialog';
import { UpcomingState } from '../components/upcoming_state';
import { ActiveState } from '../components/active_state';
import { CancelledState } from '../components/cancelled_state ';
import { ProcessingState } from '../components/processing_state ';

export const MeetingIdView = ({meetingId}:Props) => {
    const trpc=useTRPC();
    const router =useRouter();
    const queryClient=useQueryClient();

    const [UpdateMeetingDialogopen,setUpdateMeetingDialogOpen]=useState(false);

    const [RemoveConfirmation,confirmRemove]=useConfirm(
        "are you sure ??",
        "the following action will be removed!!"
    )

    const {data}=useSuspenseQuery(
        trpc.meetings.getOne.queryOptions({id:meetingId})
    );
    const removemeeting=useMutation(
        trpc.meetings.remove.mutationOptions({
            onSuccess:()=>{
                queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({})),
                router.push("/meetings")
            },
        })
    );
    const HandeRemoveMeeting=async()=>{
        const ok =await confirmRemove();
        if(!ok)return;
        await removemeeting.mutateAsync({id:meetingId})
    }

    const isActive=data.status==="active";
    const isUpcoming=data.status==="upcoming";
    const isCancelled=data.status==="cancelled";
    const isCompleted=data.status==="completed";
    const isProcessing=data.status==="processing";

  return (
    <>
    <RemoveConfirmation />
    <UpdateMeetingDialog  
    open={UpdateMeetingDialogopen}
    onOpenChange={setUpdateMeetingDialogOpen}
    initialValues={data}
    />
    <div className="flex flex-1 py-4 px-4 flex-col gap-y-4 md:px-8 ">
        <MeetingIdViewHeader
        MeetingId={meetingId}
        MeetingName={data.name}
        onEdit={()=>setUpdateMeetingDialogOpen(true)}
        onRemove={HandeRemoveMeeting}
        />
        {isCancelled && <CancelledState/>}
        {isActive && <ActiveState meetingId={meetingId} />}
        {isCompleted && <div>Completed</div>}
        {isUpcoming && (<UpcomingState 
        meetingId={meetingId}
        onCancelMeeting={()=>{}}
        isCancelling={false}
        />)}
        {isProcessing && <ProcessingState/>}

    </div>
    </>
  )
}
export const MeetingIdViewLoading=()=>{ 
    return(
        <LoadingState 
        title="loading..."
        description="this may take a while"
        />
    );
};

export const MeetingIdViewError=()=>{ 
    return(
       <ErrorState title={'Error'} description={'Something went wrong'}/>
    );
};
