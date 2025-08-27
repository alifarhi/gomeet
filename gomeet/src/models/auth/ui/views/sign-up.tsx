"use client";

import { Github, OctagonAlertIcon } from "lucide-react"
import { email, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useState } from "react";
import { FaGithub,FaGoogle} from "react-icons/fa"; 

import { Card,CardContent } from "@/components/ui/card";
import { Alert,AlertTitle } from "@/components/ui/alert";
import { authClient } from "@/lib/auth-clients";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form,FormControl,FormField,FormItem,FormLabel,FormMessage } from "@/components/ui/form";
import { Resolver } from "dns";
import { Span } from "next/dist/trace";
import { Schema } from "better-auth";
import { useRouter } from "next/navigation";
 


const formschema = z.object({
name:z.string().min(1,{message:"full name required"}),
email: z.string().email(),
password:z.string().min(1,{message:"password is required"}),
confirmPassword:z.string().min(1,{message:"confirm password"}),
})
.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});


export const SignUpView = () => { 
    const router = useRouter();
   const [pending ,setpending]=useState(false);
   const [error, seterror]=useState<string | null>(null);
   

   const form = useForm<z.infer<typeof formschema>>({ 
    resolver: zodResolver(formschema),
    defaultValues:{ 
      name:"",
      email:"",
      password:"",
      confirmPassword:"",
    },
   });
   const onSubmit = (data:z.infer<typeof formschema>)=> {
    seterror(null);
    setpending(true);
   authClient.signUp.email(
    {
      name:data.name,
      email: data.email,
      password:data.password,
      callbackURL:"/",
    },
    {
      onSuccess: ()=>{
        setpending(false);
        router.push("/");
      },
      onError: ({ error })=>{
        seterror(error.message)
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
      callbackURL:"/",
    },
    {
      onSuccess: ()=>{
        setpending(false);
      },
      onError: ({error})=>{
        seterror(error.message)
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
                       Let's get started
                    </h1>
                    <p className="text-muted-foreground text-balance">
                      Create your account
                    </p>
                  </div>
                  <div className="grid gap-3">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field })=> (
                        <FormItem>
                          <FormLabel>
                            name
                          </FormLabel>
                          <FormControl>
                            <Input type="text" 
                            placeholder="Full Name"
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
                  <div className="grid gap-3">
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field })=> (
                        <FormItem>
                          <FormLabel>
                           Confirm Password
                          </FormLabel>
                          <FormControl>
                            <Input type="password" 
                            placeholder=""
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
                    Sign-up
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
                      variant="outline"
                      type="button" 
                      className="w-full" > 
                       <FaGithub />              
                    </Button>
                   </div>
                   <div className="text-center text-sm text-muted-foreground">
                       Already have an account?{" "}
                      <Link href="/sign-in" className="text-primary underline underline-offset-4">
                            Sign in
                       </Link>
                   </div>
                </div>
            </form>
          </Form>
            

            <div className="bg-radial from-grey-100 to-blue-800 relative hidden md:flex flex-col
            gap-y-4 items-center justify-center ">
              <img src="/logo.svg" alt="Image" className="h-[250px] w-[250px]"/>
            </div>
        </CardContent>
           </Card>
           <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
            By clicking here you agree to our <a href=""> terms of service</a> and <a href="">Privacy Policy </a>  
            </div> 
    </div>
);
}