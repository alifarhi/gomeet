import { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/trpc/routers/app";


export type AgentGetOne=inferRouterOutputs<AppRouter>["agents"]["getOne"];