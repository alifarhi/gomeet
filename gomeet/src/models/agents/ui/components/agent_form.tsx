import { useTRPC } from "@/trpc/client";
import { AgentGetOne } from "../../types";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import z from "zod";
import { agentsInsertSchema } from "../../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form,FormControl,FormField,FormItem,FormLabel,FormMessage }  from "@/components/ui/form";
import { GeneratedAvatar } from "@/components/generator-avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { id } from "date-fns/locale";


interface AgentFormProps{
onSucces?:()=>void;
onCancel?:()=>void;
initialValues?:AgentGetOne;
}


export const AgentForm = ({onSucces,onCancel,initialValues}:AgentFormProps) => {

const trpc= useTRPC();
const router=useRouter();
const queryclient=useQueryClient();

const createAgent= useMutation(
    trpc.agents.create.mutationOptions({ 
        onSuccess:()=>{
            queryclient.invalidateQueries(
                trpc.agents.getMany.queryOptions({})
            );
            onSucces?.();
        },
        onError:(error)=>{
         toast.error(error.message)
        },
     }),
);

const updateAgent= useMutation(
    trpc.agents.Update.mutationOptions({ 
        onSuccess:()=>{
            queryclient.invalidateQueries(
                trpc.agents.getMany.queryOptions({})
            );
            if(initialValues?.id){ 
                queryclient.invalidateQueries(
                    trpc.agents.getOne.queryOptions({id:initialValues.id}),
                )
            }
            onSucces?.();
        },
        onError:(error)=>{
         toast.error(error.message)
        },
     }),
);

const form = useForm<z.infer<typeof agentsInsertSchema>>({
resolver:zodResolver(agentsInsertSchema),
defaultValues:{
    name:initialValues?.name??"",
    instractions:initialValues?.instractions??"",
},
});

const isEdit=!!initialValues?.id;
const isPending=createAgent.isPending||updateAgent.isPending;

const onSubmit=(values:z.infer<typeof agentsInsertSchema>)=>{
if (isEdit){
   updateAgent.mutate({...values, id:initialValues.id})
}else{
    createAgent.mutate(values);
}
};
  
return(
    <Form {...form}>
       <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <GeneratedAvatar seed={form.watch("name")} variant="botttsNeutral" className="border size-16"/>
          <FormField name="name" control={form.control} render={({field})=>(
            <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                    <Input {...field} placeholder="e.g: DataStructure TuTor"/>
                </FormControl>
                <FormMessage/>
            </FormItem>
          )}/>
          <FormField name="instractions" control={form.control} render={({field})=>(
            <FormItem>
                <FormLabel>Instractions</FormLabel>
                <FormControl>
                    <Input {...field} placeholder="e.g: you are a data structor tutor who loves to teache"/>
                </FormControl>
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
);
};
