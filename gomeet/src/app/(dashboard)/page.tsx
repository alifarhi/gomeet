import { auth } from "@/lib/auth";
import { HomeView } from "@/models/home/ui/views/home_view";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(), // no need for await
  });
  return <HomeView />;
};

export default Page;
