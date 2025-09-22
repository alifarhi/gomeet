import { db } from "@/db";
import { meetingsInsertSchema, meetingUpdateSchema } from "../schema";
import { agents, meetings } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import z from "zod";
import { eq, getTableColumns, and, ilike, desc, count, sql } from "drizzle-orm";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
} from "@/constant";
import { TRPCError } from "@trpc/server";
import { MeetingStatus } from "../types";
import { streamVideo } from "@/lib/stream-video";
import { generateAvatarUi } from "@/lib/avatar";
import { error } from "console";

export const MeetingsRouter = createTRPCRouter({
  generateToken: protectedProcedure.mutation(async ({ ctx, input }) => {
    await streamVideo.upsertUsers([
      {
        id: ctx.auth.user.id,
        name: ctx.auth.user.name,
        role: "admin",
        image:
          ctx.auth.user.image ??
          generateAvatarUi({ seed: ctx.auth.user.name, variant: "initials" }),
      },
    ]);
    const expirationtime = Math.floor(Date.now() / 1000) + 3600;
    const issuedAt = Math.floor(Date.now() / 1000) - 60;

    const token = streamVideo.generateUserToken({
      user_id: ctx.auth.user.id,
      exp: expirationtime,
      validity_in_seconds: issuedAt,
    });
    return token;
  }),

  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const [removeMeetings] = await db
        .delete(meetings)
        .where(
          and(eq(meetings.id, input.id), eq(meetings.user, ctx.auth.user.id))
        )
        .returning();
      if (!removeMeetings) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Meeting not Found...",
        });
      }
      return removeMeetings;
    }),

  Update: protectedProcedure
    .input(meetingUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const [updateMeetings] = await db
        .update(meetings)
        .set(input)
        .where(
          and(eq(meetings.id, input.id), eq(meetings.user, ctx.auth.user.id))
        )
        .returning();
      if (!updateMeetings) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Meeting not Found...",
        });
      }
      return updateMeetings;
    }),

  create: protectedProcedure
    .input(meetingsInsertSchema)
    .mutation(async ({ input, ctx }) => {
      const [createdMeeting] = await db
        .insert(meetings)
        .values({ ...input, user: ctx.auth.user.id })
        .returning();

      const call = streamVideo.video.call("default", createdMeeting.id);
      await call.create({
        data: {
          created_by_id: ctx.auth.user.id,
          custom: {
            meetingId: createdMeeting.id,
            meetingName: createdMeeting.name,
          },
          settings_override: {
            transcription: {
              language: "en",
              mode: "auto-on",
              closed_caption_mode: "auto-on",
            },
            recording: {
              mode: "auto-on",
              quality: "1080p",
            },
          },
        },
      });
      const [existingAgents] = await db
        .select()
        .from(agents)
        .where(eq(agents.id, createdMeeting.agentId));

      if (!existingAgents) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Agent not found",
        });
      }
      await streamVideo.upsertUsers([
        {
          id: existingAgents.id,
          name: existingAgents.name,
          role: "user",
          image: generateAvatarUi({
            seed: existingAgents.name,
            variant: "botttsNeutral",
          }),
        },
      ]);
      return createdMeeting;
    }),

  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const [existingMeetings] = await db
        .select({
          ...getTableColumns(meetings),
          agent: agents,
          duration: sql<number>`EXTRACT(EPOCH FROM(ended_at - started_at))`.as(
            "duration"
          ),
        })
        .from(meetings)
        .innerJoin(agents, eq(meetings.agentId, agents.id))
        .where(
          and(eq(meetings.id, input.id), eq(meetings.user, ctx.auth.user.id))
        );
      if (!existingMeetings) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Meeting not Found",
        });
      }
      await new Promise<void>((resolve) => setTimeout(resolve, 2000));
      return existingMeetings;
    }),

  getMany: protectedProcedure
    .input(
      z.object(
        //agent filter
        {
          page: z.number().default(DEFAULT_PAGE),
          pagesize: z
            .number()
            .min(MIN_PAGE_SIZE)
            .max(MAX_PAGE_SIZE)
            .default(DEFAULT_PAGE_SIZE),
          search: z.string().nullish(),
          agentId: z.string().nullish(),
          status: z
            .enum([
              MeetingStatus.Active,
              MeetingStatus.Processing,
              MeetingStatus.Cancelled,
              MeetingStatus.Completed,
              MeetingStatus.Upcoming,
            ])
            .nullish(),
        }
      )
    )
    .query(async ({ ctx, input }) => {
      const { search, page, pagesize, status, agentId } = input;
      const data = await db
        .select({
          ...getTableColumns(meetings),
          agents: agents,
          duration: sql<number>`EXTRACT(EPOCH FROM(ended_at - started_at))`.as(
            "duration"
          ),
        })
        .from(meetings)
        .innerJoin(agents, eq(meetings.agentId, agents.id))
        .where(
          and(
            eq(meetings.user, ctx.auth.user.id),
            search ? ilike(meetings.name, `%${search}%`) : undefined,
            status ? eq(meetings.status, status) : undefined,
            agentId ? eq(meetings.agentId, agentId) : undefined
          )
        )
        .orderBy(desc(meetings.createdAt), desc(meetings.id))
        .limit(pagesize)
        .offset((page - 1) * pagesize);
      const [total] = await db
        .select({ count: count() })
        .from(meetings)
        .innerJoin(agents, eq(meetings.agentId, agents.id))
        .where(
          and(
            eq(meetings.user, ctx.auth.user.id),
            search ? ilike(meetings.name, `%${search}%`) : undefined,
            status ? eq(meetings.status, status) : undefined,
            agentId ? eq(meetings.agentId, agentId) : undefined
          )
        );
      const totalPages = Math.ceil(total.count / pagesize);
      await new Promise<void>((resolve) => setTimeout(resolve, 2000));
      return {
        items: data,
        total: total.count,
        totalPages,
      };
    }),
});
