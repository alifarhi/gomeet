import { db } from "@/db";
import { meetingsInsertSchema, meetingUpdateSchema} from "../schema";
import { agents, meetings} from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import z from "zod";
import { eq, getTableColumns,and, ilike, desc, count, sql } from "drizzle-orm";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constant";
import { TRPCError } from "@trpc/server";
import { MeetingStatus } from "../types";


export const MeetingsRouter = createTRPCRouter({

  Update: protectedProcedure.input(meetingUpdateSchema).mutation(async({ctx,input})=>{
    const [updateMeetings]=await db.update(meetings).set(input).where(and(eq(meetings.id,input.id),eq(meetings.user,ctx.auth.user.id))).returning()
  if (!updateMeetings) {
      throw new  TRPCError({
        code:"NOT_FOUND",
        message:"Meeting not Found...",
      });
    }
       return updateMeetings;
   }),
  

  create: protectedProcedure.input(meetingsInsertSchema).mutation(async({input,ctx})=>{
       const [createdMeeting]=await db.insert(meetings).values({ ...input,user:ctx.auth.user.id})
       .returning();
       return createdMeeting;
      }),

 getOne:protectedProcedure.input(z.object({id:z.string()})).query(async({input,ctx})=>{
   const [existingMeetings]= await db.select({...getTableColumns(meetings)}).from(meetings).where(and(eq(meetings.id,input.id),eq(meetings.user,ctx.auth.user.id)));
   if(!existingMeetings){
    throw new TRPCError({code:"NOT_FOUND",message:"Meeting not Found"})
   }
     await new Promise<void>((resolve) => setTimeout(resolve,2000));
     return existingMeetings;
  }),

  getMany:protectedProcedure.input(z.object(
    //agent filter 
  {
    page: z.number().default(DEFAULT_PAGE),
    pagesize:z.number().min(MIN_PAGE_SIZE).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
    search:z.string().nullish(),
    agentId:z.string().nullish(),
    status:z.enum([
      MeetingStatus.Active,
      MeetingStatus.Processing,
      MeetingStatus.Cancelled,
      MeetingStatus.Completed,
      MeetingStatus.Upcoming,
    ]).nullish(),
  }
  )).
   query(async({ctx,input})=>{
   const {search,page,pagesize,status,agentId}=input;
   const data= await db.select({...getTableColumns(meetings),agents:agents,duration:sql<number>`EXTRACT(EPOCH FROM(ended_at - started_at))`.as("duration")}).from(meetings).innerJoin(agents,eq(meetings.agentId,agents.id)).where(and(eq(meetings.user,ctx.auth.user.id ),search?ilike(meetings.name,`%${search}%`):undefined,status? eq(meetings.status,status):undefined,agentId? eq(meetings.agentId,agentId):undefined)).orderBy(desc(meetings.createdAt),desc(meetings.id)).limit(pagesize).offset((page - 1)*pagesize)
   const [total]=await db.select({count:count()}).from(meetings).innerJoin(agents,eq(meetings.agentId,agents.id)).where(and(eq(meetings.user,ctx.auth.user.id ),search?ilike(meetings.name,`%${search}%`):undefined,status? eq(meetings.status,status):undefined,agentId? eq(meetings.agentId,agentId):undefined));
   const totalPages=Math.ceil(total.count/pagesize);
   await new Promise<void>((resolve) => setTimeout(resolve,2000));
     return{
      items:data,
      total:total.count,
      totalPages,
     };  
  }),

});