import { auth } from '@/lib/auth'
import { HomeView } from '@/models/home/ui/views/home_view'
import { headers } from 'next/headers'
import React from 'react'
import { redirect } from 'next/navigation'

const page = async() => {
  const session= await auth.api.getSession({
       headers: await headers(),  
    });
  if (!session) {
    redirect("/sign-in");
  }
  return 
    <HomeView/>
};

export default page