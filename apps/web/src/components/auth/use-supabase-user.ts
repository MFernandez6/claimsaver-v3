"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { getBrowserSupabase } from "@/lib/supabase/browser";
import { isSupabaseBrowserConfigured } from "@/lib/supabase/env-public";

export function useSupabaseUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!isSupabaseBrowserConfigured()) {
      setIsLoaded(true);
      return;
    }
    const supabase = getBrowserSupabase();
    supabase.auth.getUser().then((res: { data: { user: User | null } }) => {
      setUser(res.data.user ?? null);
      setIsLoaded(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event: string, session: { user: User } | null) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return { user, isLoaded, isSignedIn: Boolean(user) };
}
