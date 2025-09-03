
import { auth } from "@/lib/auth";
import { SignUpView } from "@/models/auth/ui/views/sign-up";
import { headers } from "next/headers";


 const page = async() => { 
    const session= await auth.api.getSession({
              headers: await headers(),  
           });
return<SignUpView/>

}
export default page;