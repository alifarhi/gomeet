import { db } from "@/db";
import { agents} from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { agentsInsertSchema } from "../schema";
import z from "zod";
import { eq, getTableColumns, sql } from "drizzle-orm";


export const agentsRouter = createTRPCRouter({

 getOne:protectedProcedure.input(z.object({id:z.string()})).query(async({input})=>{
   const [existingAgents]= await db.select({...getTableColumns(agents),meetingCount:sql<number>`5`}).from(agents).where(eq(agents.id,input.id));
     await new Promise<void>((resolve) => setTimeout(resolve,3000));
     return existingAgents;
  }),

  getMany:protectedProcedure.query(async()=>{
   const data= await db.select().from(agents);
     await new Promise<void>((resolve) => setTimeout(resolve,3000));
     return data;
  }),

    create: protectedProcedure.input(agentsInsertSchema).mutation(async({input,ctx})=>{
     const [createdAgent]=await db.insert(agents).values({ ...input,user:ctx.auth.user.id})
     .returning();
    }),

});