"use client";

import { useEffect, useState } from "react";
import type { Me } from "@claimsaver/shared";
import { webApi } from "@/lib/api/client";
import { useSupabaseUser } from "@/components/auth/use-supabase-user";
import { signedInHome, type SignedInHome } from "@/lib/auth/signed-in-home";

const CLIENT_HOME: SignedInHome = {
  href: "/dashboard",
  labelKey: "navigation.dashboard",
};

export function useSignedInHome() {
  const auth = useSupabaseUser();
  const [home, setHome] = useState<SignedInHome>(CLIENT_HOME);
  const [staffReady, setStaffReady] = useState(false);

  useEffect(() => {
    if (!auth.isLoaded) return;
    if (!auth.isSignedIn) {
      setHome(CLIENT_HOME);
      setStaffReady(true);
      return;
    }
    let cancelled = false;
    webApi
      .get<Me>("/api/v1/me")
      .then((me) => {
        if (cancelled) return;
        setHome(signedInHome(me.staffRole));
        setStaffReady(true);
      })
      .catch(() => {
        if (cancelled) return;
        setHome(CLIENT_HOME);
        setStaffReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, [auth.isLoaded, auth.isSignedIn, auth.user?.id]);

  return {
    ...auth,
    home,
    staffReady,
    isStaff: home.href === "/admin",
  };
}
