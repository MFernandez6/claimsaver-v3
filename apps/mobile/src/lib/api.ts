import { createApiClient } from "@claimsaver/shared";
import { supabase } from "./supabase";

const base =
  (process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000").replace(/\/$/, "");

export const api = createApiClient({
  baseUrl: base,
  getToken: async () => {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? null;
  },
});
