import { ResponsiveDialog } from "@/components/responsive_dialogue";
import { AgentForm } from "./agent_form";
import { AgentGetOne } from "../../types";


interface UpdateAgentDialogProps{ 
    open:boolean;
    onOpenChange:(open:boolean)=>void;
    initialValues:AgentGetOne;
};


export const UpdateAgentDialog = ({open,onOpenChange,initialValues}:UpdateAgentDialogProps) => {
    return (
    <ResponsiveDialog title={"Update Agent"} description={"update an  Agent"} open={open} onOpenChange={onOpenChange}>
       <AgentForm 
       onSucces={()=>onOpenChange(false)} onCancel={()=>onOpenChange(false)} initialValues={initialValues} />
    </ResponsiveDialog>
  )
};
