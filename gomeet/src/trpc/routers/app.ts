
import { meetings } from '@/db/schema';
import { createTRPCRouter } from '../init';
import { agentsRouter } from '@/models/agents/server/procedure';
import { MeetingsRouter } from '@/models/meetings/server/procedure';

export const appRouter = createTRPCRouter({
 agents:agentsRouter,
 meetings:MeetingsRouter,
 
});
// export type definition of API
export type AppRouter = typeof appRouter;