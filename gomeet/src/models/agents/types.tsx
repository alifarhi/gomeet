import { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/trpc/routers/app";


export type AgentGetMany=inferRouterOutputs<AppRouter>["agents"]["getMany"]["items"];
export type AgentGetOne=inferRouterOutputs<AppRouter>["agents"]["getOne"];