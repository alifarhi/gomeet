"use client";

import { Button } from "@/components/ui/button"
import { PlusIcon, XCircleIcon } from "lucide-react";
import { NewAgentDialog } from "./new_agent_dialog";
import { useState } from "react";
import { useAgentsFiltre } from "../../hooks/use-agents-filtre";
import { AgentSearchFilter } from "./agent-search-filter";
import { DEFAULT_PAGE } from "@/constant";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";


export const AgentListHeader = () => {
const [filters,setFilters] =useAgentsFiltre();
const [isDialogOpen, setIsDialogOpen]=useState(false);
const isAnyAgentModified=!!filters.search;
const OnClearFiltres=()=>{
  setFilters({
    search:"",
    page:DEFAULT_PAGE,
  })
}

  return (
    <>
    <NewAgentDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}/>
    <div className="py-4 px-4 md:px-8 flex flex-col gap-y-4">
        <div className="flex items-center justify-between">
         <h5 className="font-medium text-xl">My Agents</h5>
         <Button onClick={()=>setIsDialogOpen(true)}>
            <PlusIcon/>
            New Agent
         </Button>
        </div>
        <ScrollArea>
        <div className="flex items-center gap-x-2 p-1">
          <AgentSearchFilter/>
          {isAnyAgentModified && (
             <Button variant="outline" size="sm" onClick={OnClearFiltres}>
              <XCircleIcon/>
             </Button>
          )}
        </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
    </div>
    </>
  )
}
