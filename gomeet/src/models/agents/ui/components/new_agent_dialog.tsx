import { ResponsiveDialog } from "@/components/responsive_dialogue";
import { AgentForm } from "./agent_form";


interface NewAgentDialogProps{ 
    open:boolean;
    onOpenChange:(open:boolean)=>void;
};


export const NewAgentDialog = ({open,onOpenChange}:NewAgentDialogProps) => {
    return (
    <ResponsiveDialog title={"New Agent"} description={"Create A New Agent"} open={open} onOpenChange={onOpenChange}>
       <AgentForm 
       onSucces={()=>onOpenChange(false)} onCancel={()=>onOpenChange(false)}/>
    </ResponsiveDialog>
  )
};
