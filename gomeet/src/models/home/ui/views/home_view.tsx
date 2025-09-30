"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export const HomeView = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center text-center p-10 w-full h-full">
    
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        Welcome to <span className="text-green-600">GoMeet</span>
      </h1>
      <p className="text-lg text-gray-600 max-w-2xl mb-6">
        Your smart Zoom companion — easily join and manage meetings with
        intelligent agents that keep you connected, organized, and focused on
        what matters most.
      </p>

      {/* CTA Buttons */}
      <div className="flex gap-4 mb-12">
        <Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl shadow-md transition" onClick={()=>router.push("/meetings")}>
          Create a Meeting
        </Button>
        <Button className="bg-white border border-gray-300 hover:border-green-600 text-gray-800 px-6 py-3 rounded-2xl shadow-sm transition " onClick={()=>router.push("/agents")}>
          Add an Agent
        </Button>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
        <div className="bg-white rounded-2xl shadow p-6 text-center hover:shadow-lg transition">
          <h3 className="text-xl font-semibold text-green-600 mb-2">
            Seamless Joining
          </h3>
          <p className="text-gray-600 text-sm">
            Let GoMeet handle entering your Zoom calls so you never miss a
            session.
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 text-center hover:shadow-lg transition">
          <h3 className="text-xl font-semibold text-green-600 mb-2">
            Smart Agents
          </h3>
          <p className="text-gray-600 text-sm">
            Assign agents to classes, meetings, or subject discussions with
            ease.
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 text-center hover:shadow-lg transition">
          <h3 className="text-xl font-semibold text-green-600 mb-2">
            Stay Organized
          </h3>
          <p className="text-gray-600 text-sm">
            Manage multiple meetings without missing a beat and keep everything
            in sync.
          </p>
        </div>
      </div>
    </div>
  );
};
