"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-clients";
import { useRouter } from "next/navigation";

export const HomeView = () => {
  const { data: session } = authClient.useSession();
  const router = useRouter();

  if (!session){
    return <p>not Logged</p>
       };
  return (
    <div className="flex flex-col p-4 gap-y-4">
      <p>Logged in as {session.user.name}</p>
      <Button
        onClick={async () => {
          await authClient.signOut();
          router.push("/sign-in"); // ← This is the right way to redirect
        }}
      >
        Sign-out
      </Button>
    </div>
  );
};
