import { ResponsiveDialog } from "@/components/responsive_dialogue";
import { useRouter } from "next/navigation";
import { MeetingForm } from "./meeting_form";


interface NewMeetingDialogProps{ 
    open:boolean;
    onOpenChange:(open:boolean)=>void;
};


export const NewMeetingDialog = ({open,onOpenChange}:NewMeetingDialogProps) => {
  const router =useRouter();

    return (
    <ResponsiveDialog title={"New Meeting"} description={"Create A New Meeting"} open={open} onOpenChange={onOpenChange}>
     <MeetingForm onSucces={(id)=>{onOpenChange(false);
            router.push(`/meetings/${id}`);
     }} onCancel={()=>onOpenChange(false)}/>
    </ResponsiveDialog>
    
  )
};
