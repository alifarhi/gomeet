"use client";

import { OctagonAlertIcon } from "lucide-react"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useState } from "react";

import { Card,CardContent } from "@/components/ui/card";
import { Alert,AlertTitle } from "@/components/ui/alert";
import { authClient } from "@/lib/auth-clients";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form,FormControl,FormField,FormItem,FormLabel,FormMessage } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { FaGithub , FaGoogle} from "react-icons/fa"; 


const formschema = z.object({
email: z.string().email(),
password:z.string().min(1,{message:"password is required"}),
});
export const SignInView = () => { 
   const router = useRouter();
   const [pending ,setpending]=useState(false);
   const [error, seterror]=useState<string | null>(null);
   

   const form = useForm<z.infer<typeof formschema>>({ 
    resolver: zodResolver(formschema),
    defaultValues:{ 
      email:"",
      password:"",
    },
   });
   const onSubmit = (data:z.infer<typeof formschema>)=> {
    seterror(null);
    setpending(true);
   authClient.signIn.email(
    {
      email: data.email,
      password:data.password,
    },
    {
      onSuccess: ()=>{
        setpending(false);
        router.push("/");
      },
     onError: ({ error }) => {
           seterror(error.message);
           setpending(false);  // ensure button gets re-enabled
         },

     },
    );
  };
    const onSocial = (provider:"github" | "google")=> {
    seterror(null);
    setpending(true);

   authClient.signIn.social(
    {
      provider:provider,
    },
    {
      onSuccess: ()=>{
        setpending(false);
        router.push("/");
      },
      onError: ({ error }) => {
        seterror(error.message);
        setpending(false);  
       },
     },
    );
    
   };

    return(
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-center text-center">
                    <h1 className="text-2xl font-bold text-red-700">
                       Welcome back
                    </h1>
                    <p className="text-muted-foreground text-balance">
                       Login to your Account
                    </p>
                  </div>
                  <div className="grid gap-3">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field })=> (
                        <FormItem>
                          <FormLabel>
                            Email
                          </FormLabel>
                          <FormControl>
                            <Input type="email" 
                            placeholder="email@gmail.com"
                            {...field} />
                          </FormControl>
                          <FormMessage/>
                        </FormItem>
                      )}
                    /> 
                  </div>
                  <div className="grid gap-3">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field })=> (
                        <FormItem>
                          <FormLabel>
                            Password
                          </FormLabel>
                          <FormControl>
                            <Input type="password" 
                            placeholder="********"
                            {...field} />
                          </FormControl>
                          <FormMessage/>
                        </FormItem>
                      )}
                    /> 
                  </div>
                  {!!error && (
                   <Alert className="bg-destructive/10 border-none">
                    <OctagonAlertIcon className="h-4 w-4 !text-destructive"/>
                    <AlertTitle>{error}</AlertTitle>
                   </Alert>
                  )
                   }
                   <Button 
                   disabled={pending}
                   type="submit"
                   className="w-full bg-blue-700 border-none ">
                    Sign-in
                   </Button>
                   <div className="after:border-border relative text-center text-sm after:absolute after:inset-0
                   after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                       <span className="bg-card text-muted-foreground relative z-10 px-2">
                        or continue with
                       </span>
                   </div>
                   <div className="grid grid-cols-2 gap-5">
                    <Button
                     disabled={pending}
                     onClick={()=>onSocial("google")} 
                     variant="outline" 
                     type="button" 
                     className="w-full" > 
                       <FaGoogle/>                 
                    </Button>
                     <Button 
                       disabled={pending}
                       onClick={()=>onSocial("github")} 
                       type="button"
                       className="w-full" > 
                       <FaGithub/>               
                    </Button>
                   </div>
                   <div className="text-center text-sm text-muted-foreground">
                       Don’t have an account?{" "}
                      <Link href="/sign-up" className="text-primary underline underline-offset-4">
                            Sign Up
                       </Link>
                   </div>
                </div>
            </form>
          </Form>
            

            <div className="bg-radial from-sidebar-accent to-sidebar relative hidden md:flex flex-col
            gap-y-4 items-center justify-center ">
              <img src="/logo.svg" alt="Image" className="h-[150px] w-[150px]"/>
              <p className="text-3xl font-semibold text-white">
                GoMeet
              </p>
            </div>


        </CardContent>
           </Card>
           <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
            By clicking here you agree to our <a href=""> terms of service</a> and <a href="">Privacy Policy </a>  
            </div> 
    </div>
);
}