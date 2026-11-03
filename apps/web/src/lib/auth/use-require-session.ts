"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSupabaseUser } from "@/components/auth/use-supabase-user";
import { loginPath } from "@/lib/auth/session-security";

/** Send logged-out visitors to /login?next=… instead of a blank protected page. */
export function useRequireSession(nextPath: string) {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useSupabaseUser();

  useEffect(() => {
    if (!isLoaded || isSignedIn) return;
    router.replace(loginPath(nextPath));
  }, [isLoaded, isSignedIn, nextPath, router]);

  return { isLoaded, isSignedIn };
}
