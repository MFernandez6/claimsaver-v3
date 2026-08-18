import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseAnonKey, getSupabaseUrl } from "./env-public";

let client: ReturnType<typeof createBrowserClient> | null = null;

export function getBrowserSupabase() {
  if (!client) {
    client = createBrowserClient(getSupabaseUrl(), getSupabaseAnonKey(), {
      cookieOptions: {
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      },
    });
  }
  return client;
}
