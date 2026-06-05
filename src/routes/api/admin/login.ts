import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import {
  checkLoginRateLimit,
  getAdminSessionForLogin,
  resetLoginRateLimit,
  timingSafeEqualString,
} from "@/lib/admin-session.server";

const BodySchema = z.object({
  username: z.string().min(1).max(200),
  password: z.string().min(1).max(500),
  remember: z.boolean().optional(),
});

function json(body: unknown, status = 200, extraHeaders: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", ...extraHeaders },
  });
}

export const Route = createFileRoute("/api/admin/login")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const ip =
          request.headers.get("cf-connecting-ip") ||
          request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
          "unknown";

        const rl = checkLoginRateLimit(ip);
        if (!rl.ok) {
          return json(
            { error: `尝试次数过多，请 ${rl.retryAfterSec} 秒后重试` },
            429,
            { "retry-after": String(rl.retryAfterSec) },
          );
        }

        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return json({ error: "请求格式错误" }, 400);
        }
        const parsed = BodySchema.safeParse(body);
        if (!parsed.success) return json({ error: "参数错误" }, 400);

        const envUser = process.env.ADMIN_USERNAME;
        const envPass = process.env.ADMIN_PASSWORD;
        if (!envUser || !envPass) {
          return json(
            { error: "服务器未配置 ADMIN_USERNAME / ADMIN_PASSWORD" },
            500,
          );
        }

        const okUser = timingSafeEqualString(parsed.data.username, envUser);
        const okPass = timingSafeEqualString(parsed.data.password, envPass);
        if (!okUser || !okPass) {
          // brief delay to slow automated guessing
          await new Promise((r) => setTimeout(r, 300));
          return json({ error: "用户名或密码错误" }, 401);
        }

        const remember = !!parsed.data.remember;
        const session = await getAdminSessionForLogin(remember);
        await session.update({ admin: true, loginAt: Date.now() });

        resetLoginRateLimit(ip);
        return json({ ok: true, remember });
      },
    },
  },
});
