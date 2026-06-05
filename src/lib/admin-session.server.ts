// Server-only admin session helpers.
// Sessions are stored in encrypted HttpOnly cookies via TanStack useSession.
import { useSession } from "@tanstack/react-start/server";

export type AdminSessionData = {
  admin?: boolean;
  loginAt?: number;
};

const COOKIE_NAME = "jh_admin_session";
const SHORT_TTL = 60 * 60 * 8; // 8 hours
const LONG_TTL = 60 * 60 * 24 * 14; // 14 days

function getSecret(): string {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s || s.length < 32) {
    throw new Error(
      "ADMIN_SESSION_SECRET 未配置或长度不足 32 位，请在环境变量中设置。",
    );
  }
  return s;
}

/**
 * Open the session for reading or clearing. Uses long TTL so existing
 * "remember me" sessions remain readable.
 */
export async function getAdminSession() {
  return useSession<AdminSessionData>({
    password: getSecret(),
    name: COOKIE_NAME,
    maxAge: LONG_TTL,
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
    },
  });
}

/**
 * Open the session for writing on login. TTL depends on the remember flag.
 */
export async function getAdminSessionForLogin(remember: boolean) {
  return useSession<AdminSessionData>({
    password: getSecret(),
    name: COOKIE_NAME,
    maxAge: remember ? LONG_TTL : SHORT_TTL,
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: remember ? LONG_TTL : undefined, // omit -> session cookie
    },
  });
}

/** Throws "Unauthorized" if the caller is not an authenticated admin. */
export async function requireAdminSession(): Promise<void> {
  const session = await getAdminSession();
  if (!session.data?.admin) {
    throw new Error("Unauthorized");
  }
}

export function timingSafeEqualString(a: string, b: string): boolean {
  if (typeof a !== "string" || typeof b !== "string") return false;
  if (a.length !== b.length) {
    // Still consume time proportional to longer string.
    let acc = 1;
    const len = Math.max(a.length, b.length);
    for (let i = 0; i < len; i++) acc |= (a.charCodeAt(i % a.length) ^ b.charCodeAt(i % b.length));
    return false;
  }
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

// ---- Simple in-memory rate limiter (per worker isolate) ----
type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_ATTEMPTS = 8;

export function checkLoginRateLimit(key: string): { ok: boolean; retryAfterSec: number } {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || b.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true, retryAfterSec: 0 };
  }
  if (b.count >= MAX_ATTEMPTS) {
    return { ok: false, retryAfterSec: Math.ceil((b.resetAt - now) / 1000) };
  }
  b.count += 1;
  return { ok: true, retryAfterSec: 0 };
}

export function resetLoginRateLimit(key: string) {
  buckets.delete(key);
}
