import { z } from "zod";

export const agentsInsertSchema=z.object({ 
name: z.string().min(1,{message:"Name is required" }),
instractions: z.string().min(1,{message:"instractions is required" }),
});