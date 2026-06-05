import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { LiveEditorPanel } from "@/components/admin/LiveEditorPanel";
import { adminCheckSession } from "@/lib/admin-auth";

export const Route = createFileRoute("/admin/live-editor/home")({
  head: () => ({ meta: [{ title: "首页可视化编辑" }] }),
  component: HomeLiveEditorPage,
});

function HomeLiveEditorPage() {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    adminCheckSession().then((ok) => {
      if (cancelled) return;
      if (!ok) navigate({ to: "/login" });
      else setAuthed(true);
    });
    return () => { cancelled = true; };
  }, [navigate]);

  if (!authed) return null;

  return (
    <AdminShell
      title="可视化编辑"
      liveEditorActive
      onSelectTab={(tab) => navigate({ to: "/admin", search: { tab } })}
    >
      <LiveEditorPanel token="" />
    </AdminShell>
  );
}
