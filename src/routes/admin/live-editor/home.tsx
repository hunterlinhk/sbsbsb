import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { LiveEditorPanel } from "@/components/admin/LiveEditorPanel";
import { getAdminToken } from "@/lib/admin-auth";

export const Route = createFileRoute("/admin/live-editor/home")({
  head: () => ({ meta: [{ title: "首页可视化编辑" }] }),
  component: HomeLiveEditorPage,
});

function HomeLiveEditorPage() {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = getAdminToken();
    if (!t) {
      navigate({ to: "/login" });
      return;
    }
    setToken(t);
  }, [navigate]);

  if (!token) return null;

  return (
    <AdminShell
      title="可视化编辑"
      liveEditorActive
      onSelectTab={(tab) => navigate({ to: "/admin", search: { tab } })}
    >
      <LiveEditorPanel token={token} />
    </AdminShell>
  );
}
