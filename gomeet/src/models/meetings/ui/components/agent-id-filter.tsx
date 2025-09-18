import React, { useState } from 'react'
import { useMeetingsFiltre } from '../../hooks/use-meetings-filtre';
import { useTRPC } from '@/trpc/client';
import { useQuery } from '@tanstack/react-query';
import { CommandSelect } from '@/components/command-select';
import { Value } from '@radix-ui/react-select';
import { GeneratedAvatar } from '@/components/generator-avatar';
import { agents } from '@/db/schema';

export const AgentIdFilter = () => {
    const [filters,setFilters]=useMeetingsFiltre();
    const trpc =useTRPC();
    const [agentSearch,setAgentSearch]=useState("");
    const {data}=useQuery(
        trpc.agents.getMany.queryOptions({
            pagesize:100,
            search:agentSearch,
        }),
    );
    
  return (
     <CommandSelect 
     className="h-9"
     placeholder="Agent"
     options={(data?.items??[]).map((agent)=>({
        id: agent.id,
        value:agent.id,
        children:(
            <div className="flex items-center gap-x-2">
                <GeneratedAvatar seed={agent.name} variant="botttsNeutral" className="size-4" />
                {agent.name}
            </div>
        )
     }))}
     onSelect={(value)=>setFilters({agentId:value})}
     onSearch={setAgentSearch}
     value={filters.agentId ?? ""}
     />   
)
}
