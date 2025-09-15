import { useTRPC } from "@/trpc/client";
import { MeetingGetOne } from "../../types";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import z from "zod";
import { meetingsInsertSchema } from "../../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form,FormControl,FormDescription,FormField,FormItem,FormLabel,FormMessage }  from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { CommandSelect } from "@/components/command-select";
import { Value } from "@radix-ui/react-select";
import { GeneratedAvatar } from "@/components/generator-avatar";
import { NewAgentDialog } from "@/models/agents/ui/components/new_agent_dialog";


interface MeetingFormProps{
onSucces?:(id?:string)=>void;
onCancel?:()=>void;
initialValues?:MeetingGetOne;
}


export const MeetingForm = ({onSucces,onCancel,initialValues}:MeetingFormProps) => {
const [agentsearch,setagentsearch]=useState("");
const [openNewDialog,setopenNewDialog]=useState(false);

const trpc= useTRPC();
const router=useRouter();
const queryclient=useQueryClient();

const agents=useQuery(
    trpc.agents.getMany.queryOptions({
        pagesize:100,
        search:agentsearch,
    }),
);
const createMeeting= useMutation(
    trpc.meetings.create.mutationOptions({ 
        onSuccess:async (data)=>{
            queryclient.invalidateQueries(
                trpc.meetings.getMany.queryOptions({})
            );
            onSucces?.(data.id);
        },
        onError:(error)=>{
         toast.error(error.message)
        },
     }),
);

const updateMeetings= useMutation(
    trpc.meetings.Update.mutationOptions({ 
        onSuccess:()=>{
            queryclient.invalidateQueries(
                trpc.meetings.getMany.queryOptions({})
            );
            if(initialValues?.id){ 
                queryclient.invalidateQueries(
                    trpc.meetings.getOne.queryOptions({id:initialValues.id}),
                )
            }
            onSucces?.();
        },
        onError:(error)=>{
         toast.error(error.message)
        },
     }),
);

const form = useForm<z.infer<typeof meetingsInsertSchema>>({
resolver:zodResolver(meetingsInsertSchema),
defaultValues:{
    name:initialValues?.name??"",
    agentId:initialValues?.agentId??"",
},
});

const isEdit=!!initialValues?.id;
const isPending=createMeeting.isPending||updateMeetings.isPending;

const onSubmit=(values:z.infer<typeof meetingsInsertSchema>)=>{
if (isEdit){
   updateMeetings.mutate({...values, id:initialValues.id})
}else{
    createMeeting.mutate(values);
}
};
  
return(
    <>
    <NewAgentDialog open={openNewDialog} onOpenChange={setopenNewDialog} />
    <Form {...form}>
       <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField name="name" control={form.control} render={({field})=>(
            <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                    <Input {...field} placeholder="e.g: DataStructure meeting"/>
                </FormControl>
                <FormMessage/>
            </FormItem>
          )}/>
          <FormField name="agentId" control={form.control} render={({field})=>(
            <FormItem>
                <FormLabel>Agent Id</FormLabel>
                <FormControl>
                    <CommandSelect
                    options={(agents.data?.items??[]).map((agent)=>({
                        id:agent.id,
                        value:agent.id,
                        children:(
                     <div className="flex items-center gap-x-2" >
                                 <GeneratedAvatar seed={agent.name} variant="botttsNeutral" className="border size-6" />
                                 <span>{agent.name}</span>
                    </div>
                     )
                    }))}
                    onSelect={field.onChange}
                    onSearch={setagentsearch}
                    value={field.value}
                    placeholder="Select an Agent"
                    />
                </FormControl>
                <FormDescription>
                    Not Found what you&apos;re looking for ?("")
                <Button type="button" className="text-primary bg-white border-none shadow-none hover:underline hover:bg-white " onClick={()=>setopenNewDialog(true)} >
                    Create New Agent
                </Button>
                </FormDescription>
                <FormMessage/>
            </FormItem>
        )}/>
          <div className="flex justify-between gap-2">
            {onCancel &&(
               <Button className="hover:bg-destructive/15 text-destructive bg-accent hover:text-destructive " variant="ghost" disabled={isPending} type="button" onClick={()=>onCancel()}>
                Cancel
               </Button>
            )}
            <Button disabled={isPending} type="submit">
                  {isEdit? "Update" : "Create"}
            </Button>
          </div>
       </form>
    </Form>
    </>
);
};
