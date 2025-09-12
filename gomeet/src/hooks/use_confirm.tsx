import { ResponsiveDialog } from "@/components/responsive_dialogue";
import { Button } from "@/components/ui/button";
import { JSX, useState } from "react";


export const useConfirm = (title:string,description:string):[()=>JSX.Element,()=>Promise<unknown>] => {
   const [promise,setpromise]=useState<{
    resolve:(value:boolean)=>void
   }|null>(null);
  
   const Confirm=()=>{
    return new Promise((resolve) => {
        setpromise({resolve})
    });
   }

   const handleclose=()=>{
    setpromise(null);
   }
   const handleConfirm=()=>{
    promise?.resolve(true);
    handleclose();
   }
   const handleCancel=()=>{
    promise?.resolve(false);
    handleclose();
   }

   const Confirmationdialog=()=>(
    <ResponsiveDialog open={promise!==null} onOpenChange={handleclose} title={title} description={description} >
              <div className="pt-4 w-full flex flex-col-reverse gap-y-2 lg:flex-row gap-x-2 items-center">
                <Button onClick={handleCancel}
                         variant="outline"
                         className="w-full lg:w-auto"
                >
                  Cancel
                </Button>
                <Button onClick={handleConfirm}
                         className="w-full lg:w-auto">
                  Confirm
                </Button>
              </div>
    </ResponsiveDialog>
   );
   return [Confirmationdialog,Confirm];
};
