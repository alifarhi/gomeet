import { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/trpc/routers/app";


export type MeetingGetOne=inferRouterOutputs<AppRouter>["meetings"]["getOne"];