import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { meetingProcessing } from "@/inngest/function";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    meetingProcessing, // <-- This is where you'll always add all your functions
  ],
});