import { createFileRoute } from "@tanstack/react-router";
import { getAdminSession } from "@/lib/admin-session.server";

export const Route = createFileRoute("/api/admin/me")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const session = await getAdminSession();
          if (!session.data?.admin) {
            return new Response(JSON.stringify({ ok: false }), {
              status: 401,
              headers: { "content-type": "application/json" },
            });
          }
          return new Response(
            JSON.stringify({ ok: true, loginAt: session.data.loginAt ?? null }),
            { status: 200, headers: { "content-type": "application/json" } },
          );
        } catch {
          return new Response(JSON.stringify({ ok: false }), {
            status: 401,
            headers: { "content-type": "application/json" },
          });
        }
      },
    },
  },
});
