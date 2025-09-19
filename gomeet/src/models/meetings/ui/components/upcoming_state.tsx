import { EmptyState } from '@/components/empty_state'
import { Button } from '@/components/ui/button'
import { BanIcon, VideoIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'


interface Props{
    meetingId:string,
    onCancelMeeting:()=>void,
    isCancelling:boolean,
}

export const UpcomingState = ({meetingId,onCancelMeeting,isCancelling}:Props) => {
  return (
    <div className="bg-white rounded-lg px-4 py-4 flex flex-col gap-y-8 items-center justify-center" >
         <EmptyState 
         image="/upcoming.svg"
         title="Not Started yet"
         description="Once you start this meating,A summary will appear here"
         />
         <div className="flex flex-col-reverse lg:flex-row lg:justify-center items-center gap-2 w-full" >
            <Button 
            variant="secondary"
            className="w-full lg:w-auto"
            onClick={onCancelMeeting}
            disabled={isCancelling}
            >
                <BanIcon/>
                Cancel Meeting
            </Button>
             <Button disabled={isCancelling} asChild className="w-full lg:w-auto">
                <Link href={`/call/${meetingId}`}>
                <VideoIcon/>
                Start Meeting
                </Link>
            </Button>
         </div>
    </div>
  )
}
