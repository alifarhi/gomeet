import { CommandDialog, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Dispatch, SetStateAction } from "react";

interface Props{
open:boolean;
setOpen: Dispatch<SetStateAction<boolean>>;
};

export const DashboardCommande=({open,setOpen}:Props)=>{
  return (
  <CommandDialog open={open} onOpenChange={setOpen}>
       <CommandInput placeholder=" Find a agent or a meeting"/>
       <CommandList>
        <CommandItem> 
            Test
        </CommandItem>
       </CommandList>
  </CommandDialog>
  );
};