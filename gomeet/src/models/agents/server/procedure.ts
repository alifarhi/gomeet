import { db } from "@/db";
import { agents} from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { agentsInsertSchema, agentUpdateSchema } from "../schema";
import z from "zod";
import { eq, getTableColumns, sql,and, ilike, desc, count } from "drizzle-orm";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constant";
import { TRPCError } from "@trpc/server";


export const agentsRouter = createTRPCRouter({

Update: protectedProcedure.input(agentUpdateSchema).mutation(async({ctx,input})=>{
  const [updateAgent]=await db.update(agents).set(input).where(and(eq(agents.id,input.id),eq(agents.user,ctx.auth.user.id))).returning()
if (!updateAgent) {
    throw new  TRPCError({
      code:"NOT_FOUND",
      message:"Agent not Found...",
    });
  }
     return updateAgent;
 }),


 remove: protectedProcedure.input(z.object({id:z.string()})).mutation(async({ctx,input})=>{
  const [removedAgent] = await db.delete(agents).where(and(eq(agents.id,input.id),eq(agents.user,ctx.auth.user.id))).returning()
  if (!removedAgent) {
    throw new  TRPCError({
      code:"NOT_FOUND",
      message:"Agent not Found...",
    });
  }
     return removedAgent;
 }),
 getOne:protectedProcedure.input(z.object({id:z.string()})).query(async({input,ctx})=>{
   const [existingAgents]= await db.select({...getTableColumns(agents),meetingCount:sql<number>`5`}).from(agents).where(and(eq(agents.id,input.id),eq(agents.user,ctx.auth.user.id)));
   if(!existingAgents){
    throw new TRPCError({code:"NOT_FOUND",message:"Agent not Found"})
   }
     await new Promise<void>((resolve) => setTimeout(resolve,3000));
     return existingAgents;
  }),

  getMany:protectedProcedure.input(z.object(
    //agent filter 
  {
    page: z.number().default(DEFAULT_PAGE),
    pagesize:z.number().min(MIN_PAGE_SIZE).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
    search:z.string().nullish(),
  }
  )).
   query(async({ctx,input})=>{
   const {search,page,pagesize}=input;
   const data= await db.select({...getTableColumns(agents),meetingCount:sql<number>`5`}).from(agents).where(and(eq(agents.user,ctx.auth.user.id ),search?ilike(agents.name,`%${search}%`):undefined,)).orderBy(desc(agents.createdAt),desc(agents.id)).limit(pagesize).offset((page - 1)*pagesize)
   const [total]=await db.select({count:count()}).from(agents).where(and(eq(agents.user,ctx.auth.user.id ),search?ilike(agents.name,`%${search}%`):undefined,));
   const totalPages=Math.ceil(total.count/pagesize);
   await new Promise<void>((resolve) => setTimeout(resolve,3000));
     return{
      items:data,
      total:total.count,
      totalPages,
     };  
  }),

    create: protectedProcedure.input(agentsInsertSchema).mutation(async({input,ctx})=>{
     const [createdAgent]=await db.insert(agents).values({ ...input,user:ctx.auth.user.id})
     .returning();
    }),

});