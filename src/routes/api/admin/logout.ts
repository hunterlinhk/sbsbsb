import { createFileRoute } from "@tanstack/react-router";
import { getAdminSession } from "@/lib/admin-session.server";

export const Route = createFileRoute("/api/admin/logout")({
  server: {
    handlers: {
      POST: async () => {
        const session = await getAdminSession();
        await session.clear();
        return new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { "content-type": "application/json" },
        });
      },
    },
  },
});
