import { Children } from "react";
import { MeetingStatus } from "../../types";
import { CircleXIcon, ClockArrowUpIcon, LoaderIcon, VideoIcon } from "lucide-react";


const options=[
    {
    id:MeetingStatus.Upcoming,
    value:MeetingStatus.Upcoming,
    children:(
        <div className="flex items-center capitalize gap-x-2">
           <ClockArrowUpIcon/>
           {MeetingStatus.Upcoming}
        </div>
    ),
    },
     {
    id:MeetingStatus.Completed,
    value:MeetingStatus.Completed,
    children:(
        <div className="flex items-center capitalize gap-x-2">
           <ClockArrowUpIcon/>
           {MeetingStatus.Completed}
        </div>
    ),
    },
     {
    id:MeetingStatus.Cancelled,
    value:MeetingStatus.Cancelled,
    children:(
        <div className="flex items-center capitalize gap-x-2">
           <CircleXIcon/>
           {MeetingStatus.Cancelled}
        </div>
    ),
    },
     {
    id:MeetingStatus.Processing,
    value:MeetingStatus.Processing,
    children:(
        <div className="flex items-center capitalize gap-x-2">
           <LoaderIcon/>
           {MeetingStatus.Processing}
        </div>
    ),
    },
     {
    id:MeetingStatus.Active,
    value:MeetingStatus.Active,
    children:(
        <div className="flex items-center capitalize gap-x-2">
           <VideoIcon/>
           {MeetingStatus.Active}
        </div>
    ),
    }
]

import React from 'react'
import { useMeetingsFiltre } from "../../hooks/use-meetings-filtre";
import { CommandSelect } from "@/components/command-select";

export const StatusFilter = () => {
    const [filters,setFilters]=useMeetingsFiltre();
  return (
    <CommandSelect 
    placeholder="Status"
    className="h-9"
    options={options}
    onSelect={(value)=>setFilters({status:value as MeetingStatus})}
    value={filters.status??""}
    />
);
}
