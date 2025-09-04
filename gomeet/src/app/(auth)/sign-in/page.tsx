
import { auth } from "@/lib/auth";
import { SignInView } from "@/models/auth/ui/views/sign-in";
import { headers } from "next/headers";


const page = async() => { 
const session= await auth.api.getSession({
          headers: await headers(),  
       });
return<SignInView/>

}
export default page;