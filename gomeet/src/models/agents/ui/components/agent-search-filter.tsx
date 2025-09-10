import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAgentsFiltre } from "../../hooks/use-agents-filtre";


export const AgentSearchFilter=()=>{
    const [filters,setFilters] =useAgentsFiltre();
 return(
    <div className="relative">
         <Input 
         placeholder="Filtre by name"
         onChange={(e)=>setFilters({search:e.target.value})}
         value={filters.search}
         className="h-9 bg-white w-[200px] pl-7"/>
         <SearchIcon className="size-4 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground"/>
    </div>
 )
}