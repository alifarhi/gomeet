"use client";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { data: session } = authClient.useSession();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  // --- Sign Up handler ---
  const onSubmit = () => {
    authClient.signUp.email(
      { email, name, password },
      {
        onError: () => window.alert("Something went wrong ❌"),
        onSuccess: () => window.alert("Signup success ✅"),
      }
    );
  };

  // --- Sign In handler ---
  const onSignin = () => {
    authClient.signIn.email(
      { email, password },
      {
        onError: () => window.alert("Login failed ❌"),
        onSuccess: () => window.alert("Login success ✅"),
      }
    );
  };

  // --- If user is already logged in ---
  if (session) {
    return (
      <div className="flex flex-col p-4 gap-y-4">
        <p>Logged in as {session.user.name}</p>
        <Button onClick={() => authClient.signOut()}>Sign-out</Button>
      </div>
    );
  }

  // --- Otherwise show login/signup forms ---
  return (
    <div className="p-4 flex flex-col gap-y-10">
      {/* Sign Up */}
      <div className="p-4 flex flex-col gap-y-4 border rounded-lg shadow">
        <h2 className="text-lg font-semibold">Create Account</h2>
        <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button onClick={onSubmit}>Sign Up</Button>
      </div>

      {/* Sign In */}
      <div className="p-4 flex flex-col gap-y-4 border rounded-lg shadow">
        <h2 className="text-lg font-semibold">Sign In</h2>
        <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button onClick={onSignin}>Sign In</Button>
      </div>
    </div>
  );
}
