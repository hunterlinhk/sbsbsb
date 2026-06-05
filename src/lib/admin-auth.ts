// Client-side helpers for admin auth. The real authentication state lives
// in an HttpOnly cookie set by the server; the browser cannot read it.
//
// IMPORTANT: This file must NEVER contain admin passwords, tokens, or any
// reusable credential string. All checks go through the server APIs:
//   GET  /api/admin/me      -> 200 if logged in, 401 if not
//   POST /api/admin/login   -> sets session cookie
//   POST /api/admin/logout  -> clears session cookie

export type AdminMeResponse = { ok: boolean; loginAt?: number | null };

export async function adminCheckSession(): Promise<boolean> {
  try {
    const res = await fetch("/api/admin/me", {
      method: "GET",
      credentials: "same-origin",
      headers: { "cache-control": "no-store" },
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function adminLoginRequest(input: {
  username: string;
  password: string;
  remember: boolean;
}): Promise<void> {
  const res = await fetch("/api/admin/login", {
    method: "POST",
    credentials: "same-origin",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    let msg = "登录失败";
    try {
      const j = (await res.json()) as { error?: string };
      if (j?.error) msg = j.error;
    } catch {/* ignore */}
    throw new Error(msg);
  }
}

export async function adminLogoutRequest(): Promise<void> {
  try {
    await fetch("/api/admin/logout", {
      method: "POST",
      credentials: "same-origin",
    });
  } catch {/* ignore */}
}

// ---- Backwards-compatible no-op shims ----
// Existing admin panels import getAdminToken / setAdminToken / clearAdminToken / isAdmin.
// Auth no longer relies on a client-readable token. These return a harmless
// placeholder so callers that pass it as `password` to server fns continue to
// type-check; the server ignores the value and enforces auth via the session
// cookie middleware.
export function getAdminToken(): string { return ""; }
export function setAdminToken(_token: string): void { /* no-op */ }
export function clearAdminToken(): void { /* no-op */ }
export function isAdmin(): boolean { return false; }
