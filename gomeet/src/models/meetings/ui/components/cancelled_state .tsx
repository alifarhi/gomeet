import { EmptyState } from '@/components/empty_state'
import React from 'react'


export const CancelledState = () => {
  return (
    <div className="bg-white rounded-lg px-4 py-4 flex flex-col gap-y-8 items-center justify-center" >
         <EmptyState 
         image="/cancelled.svg"
         title="Meeting is cancelled "
         description=" this Meeting was cancelled "
         />
    </div>
  )
}
