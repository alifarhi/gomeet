import { db } from "@/db";
import { agents, session } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { agentsInsertSchema } from "../schema";
import z from "zod";
import { eq } from "drizzle-orm";


export const agentsRouter = createTRPCRouter({

 getOne:protectedProcedure.input(z.object({id:z.string()})).query(async({input})=>{
   const [existingAgents]= await db.select().from(agents).where(eq(agents.id,input.id));
     await new Promise<void>((resolve) => setTimeout(resolve,5000));
     return existingAgents;
  }),

  getMany:protectedProcedure.query(async()=>{
   const data= await db.select().from(agents);
     await new Promise<void>((resolve) => setTimeout(resolve,5000));
     return data;
  }),

    create: protectedProcedure.input(agentsInsertSchema).mutation(async({input,ctx})=>{
     const [createdAgent]=await db.insert(agents).values({ ...input,user:ctx.auth.user.id})
     .returning();
    }),
});