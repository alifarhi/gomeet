import {
  CallEndedEvent,
  CallTranscriptionReadyEvent,
  CallSessionParticipantLeftEvent,
  CallRecordingReadyEvent,
  CallSessionStartedEvent,
} from "@stream-io/node-sdk";
import { and, eq, not } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { agents, meetings } from "@/db/schema";
import { streamVideo } from "@/lib/stream-video";
import { inngest } from "@/inngest/client";

function verifySignatureWithSDK(body: string, signature: string): boolean {
  return streamVideo.verifyWebhook(body, signature);
}

export async function POST(req: NextRequest) {
  const signature = req.headers.get("x-signature");

  const apikey = req.headers.get("x-api-key");

  if (!signature || !apikey) {
    return NextResponse.json(
      { error: "Missing signature or apikey" },
      { status: 400 }
    );
  }

  const body = await req.text();

  if (!verifySignatureWithSDK(body, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(body) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventType = (payload as Record<string, unknown>)?.type;

  if (eventType === "call.session_started") {
    const event = payload as CallSessionStartedEvent;
    const meetingId = event.call.custom?.meetingId;
    if (!meetingId) {
      return NextResponse.json(
        { error: "Invalid Meeting ID" },
        { status: 400 }
      );
    }
    const [existingMeeting] = await db
      .select()
      .from(meetings)
      .where(
        and(
          eq(meetings.id, meetingId),
          not(eq(meetings.status, "completed")),
          not(eq(meetings.status, "active")),
          not(eq(meetings.status, "cancelled")),
          not(eq(meetings.status, "processing"))
        )
      );
    if (!existingMeeting) {
      return NextResponse.json({ error: "Invalid Meeting" }, { status: 404 });
    }
    await db
      .update(meetings)
      .set({ status: "active", StartedAt: new Date() })
      .where(eq(meetings.id, existingMeeting.id));
    const [existingAgent] = await db
      .select()
      .from(agents)
      .where(eq(agents.id, existingMeeting.agentId));
    if (!existingAgent) {
      return NextResponse.json({ error: "Invalid Agent" }, { status: 404 });
    }
    const call = streamVideo.video.call("default", meetingId);
    const realtimeClient = await streamVideo.video.connectOpenAi({
      call,
      openAiApiKey: process.env.OPEN_AI_KEY!,
      agentUserId: existingAgent.id,
    });
    realtimeClient.updateSession({ instructions: existingAgent.instractions });
  } else if (eventType === "call.session_participant_left") {
    const event = payload as CallSessionParticipantLeftEvent;
    const meetingId = event.call_cid.split(":")[1];
    if (!meetingId) {
      return NextResponse.json({ error: "Invalid Meeting" }, { status: 404 });
    }
    const call = streamVideo.video.call("default", meetingId);
    await call.end();
  } else if (eventType === "call.session_ended") {
    const event = payload as CallEndedEvent;
    const meetingId = event.call.custom?.meetingId;
    if (!meetingId) {
      return NextResponse.json({ error: "Invalid Meeting" }, { status: 404 });
    }
    await db
      .update(meetingId)
      .set({ status: "processing", endedAt: new Date() })
      .where(and(eq(meetings.id, meetingId), eq(meetings.status, "active")));
  } else if (eventType === "call.transcription_ready") {
    const event = payload as CallTranscriptionReadyEvent;
    const meetingId = event.call_cid.split(":")[1];

    const [upgradeMeeting] = await db
      .update(meetings)
      .set({ transcripturl: event.call_transcription.url })
      .where(eq(meetings.id, meetingId))
      .returning();

    if (!upgradeMeeting) {
      return NextResponse.json({ error: "Meeting Not Found" }, { status: 404 });
    }

    await inngest.send({
      name:"meetings/processing",
      data:{
        meetingId:upgradeMeeting.id,
        transcriptUrl:upgradeMeeting.transcripturl
      }
    })

  }else if (eventType === "call.recording_ready") {
    const event = payload as CallRecordingReadyEvent;
    const meetingId = event.call_cid.split(":")[1];

     await db
      .update(meetings)
      .set({ recordingurl: event.call_recording.url })
      .where(eq(meetings.id, meetingId))
  }
  return NextResponse.json({ status: "ok" });
}

//https://slpsr8p5-3000.euw.devtunnels.ms
