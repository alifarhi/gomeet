// app/api/auth/[...all]/route.ts
import { auth } from "@/lib/auth"; // your Better Auth config
import { toNextJsHandler } from "better-auth/next-js";

// Pass the handler, not the whole auth object
export const { GET, POST } = toNextJsHandler(auth.handler);
