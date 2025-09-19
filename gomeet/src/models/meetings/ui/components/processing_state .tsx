import { EmptyState } from '@/components/empty_state'
import React from 'react'


export const ProcessingState = () => {
  return (
    <div className="bg-white rounded-lg px-4 py-4 flex flex-col gap-y-8 items-center justify-center" >
         <EmptyState 
         image="/processing.svg"
         title="Meeting is completed "
         description=" this Meeting was completed a summary will appear soon "
         />
    </div>
  )
}
