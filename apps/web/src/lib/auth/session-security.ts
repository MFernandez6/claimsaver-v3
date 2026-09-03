import { getBrowserSupabase } from "@/lib/supabase/browser";
import { isSupabaseBrowserConfigured } from "@/lib/supabase/env-public";

/** Keep in sync with supabase/config.toml jwt_expiry and auth.sessions.inactivity_timeout. */
export const IDLE_LIMIT_MS = 5 * 60 * 1000;
export const IDLE_WARN_MS = 60 * 1000;
export const SESSION_CHANNEL = "csplus-session";

const TAB_KEY = "csplus.session.tab";
const WINDOWS_KEY = "csplus.session.windows";
const ACTIVITY_KEY = "csplus.session.activity";
const STALE_WINDOW_MS = 30_000;

type WindowRec = { id: string; lastSeen: number };

let ending = false;

function readWindows(): WindowRec[] {
  try {
    const raw = localStorage.getItem(WINDOWS_KEY);
    return raw ? (JSON.parse(raw) as WindowRec[]) : [];
  } catch {
    return [];
  }
}

function writeWindows(list: WindowRec[]) {
  localStorage.setItem(WINDOWS_KEY, JSON.stringify(list));
}

function liveWindows(now = Date.now()) {
  return readWindows().filter((row) => now - row.lastSeen < STALE_WINDOW_MS);
}

export function getTabId() {
  return sessionStorage.getItem(TAB_KEY);
}

export function registerSessionTab() {
  let id = sessionStorage.getItem(TAB_KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(TAB_KEY, id);
  }
  const now = Date.now();
  const others = liveWindows(now).filter((row) => row.id !== id);
  writeWindows([...others, { id, lastSeen: now }]);
  return id;
}

export function unregisterSessionTab() {
  const id = sessionStorage.getItem(TAB_KEY);
  if (!id) return;
  writeWindows(readWindows().filter((row) => row.id !== id));
}

export function hasLiveSiblingTab() {
  const id = sessionStorage.getItem(TAB_KEY);
  return liveWindows().some((row) => row.id !== id);
}

export function markActivity() {
  localStorage.setItem(ACTIVITY_KEY, String(Date.now()));
}

export function lastActivityAt() {
  const raw = localStorage.getItem(ACTIVITY_KEY);
  const parsed = raw ? Number(raw) : 0;
  return Number.isFinite(parsed) ? parsed : 0;
}

export function idleMs(now = Date.now()) {
  const last = lastActivityAt();
  return last ? now - last : 0;
}

export function broadcastLogout(reason: string) {
  try {
    const channel = new BroadcastChannel(SESSION_CHANNEL);
    channel.postMessage({ type: "logout", reason });
    channel.close();
  } catch {
    /* BroadcastChannel unavailable */
  }
}

export async function endSession(reason: "idle" | "new_window" | "manual" | "broadcast") {
  if (ending) return;
  ending = true;
  try {
    sessionStorage.removeItem(TAB_KEY);
    writeWindows([]);
    localStorage.removeItem(ACTIVITY_KEY);
    if (reason !== "broadcast") broadcastLogout(reason);
    if (isSupabaseBrowserConfigured()) {
      await getBrowserSupabase().auth.signOut();
    }
  } finally {
    ending = false;
  }
}

export function loginPath(nextPath?: string) {
  const next = nextPath && nextPath.startsWith("/") ? nextPath : "/dashboard";
  return `/login?next=${encodeURIComponent(next)}`;
}
