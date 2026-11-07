import { analytics } from "@heycatch/sdk";
import type { User } from "@supabase/supabase-js";

const PENDING_SIGNUP_KEY = "heycatch_pending_signup";

function personFromUser(user: User) {
  const meta = user.user_metadata ?? {};
  const fullName = typeof meta.full_name === "string" ? meta.full_name.trim() : "";
  const first = typeof meta.first_name === "string" ? meta.first_name.trim() : "";
  const last = typeof meta.last_name === "string" ? meta.last_name.trim() : "";
  const name = fullName || [first, last].filter(Boolean).join(" ");
  return {
    ...(user.email ? { email: user.email } : {}),
    ...(name ? { name } : {}),
  };
}

export function identifyUser(user: User) {
  analytics.setIdentity(user.id, personFromUser(user), { signup_date: user.created_at });
}

export function trackSignupCompleted(user: User) {
  identifyUser(user);
  analytics.trackEvent("signup_completed");
}

export function markPendingSignup() {
  try {
    sessionStorage.setItem(PENDING_SIGNUP_KEY, "1");
  } catch {
    /* Private mode can block sessionStorage. */
  }
}

export function consumePendingSignup() {
  try {
    const pending = sessionStorage.getItem(PENDING_SIGNUP_KEY) === "1";
    sessionStorage.removeItem(PENDING_SIGNUP_KEY);
    return pending;
  } catch {
    return false;
  }
}

export function resetAnalyticsIdentity() {
  analytics.resetIdentity();
}
