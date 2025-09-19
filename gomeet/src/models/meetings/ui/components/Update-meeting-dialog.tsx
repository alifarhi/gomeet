import { ResponsiveDialog } from "@/components/responsive_dialogue";
import { MeetingForm } from "./meeting_form";
import { MeetingGetOne } from "../../types";


interface updatemeetingDialogProps{ 
    open:boolean;
    onOpenChange:(open:boolean)=>void;
    initialValues:MeetingGetOne;
};


export const UpdateMeetingDialog = ({open,onOpenChange,initialValues}:updatemeetingDialogProps) => {

    return (
    <ResponsiveDialog title={"Edit Meeting"} description={"Edit a Meeting"} open={open} onOpenChange={onOpenChange}>
     <MeetingForm 
     onSucces={()=>{onOpenChange(false)}}
     onCancel={()=>onOpenChange(false)}
     initialValues={initialValues}
     />
    </ResponsiveDialog>
    
  )
};
