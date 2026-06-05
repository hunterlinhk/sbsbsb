import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { PuckHomeEditor } from "@/components/admin/PuckHomeEditor";
import { adminCheckSession } from "@/lib/admin-auth";

export const Route = createFileRoute("/admin/puck/home")({
  head: () => ({ meta: [{ title: "首页拖拽编辑器原型" }] }),
  component: PuckHomePage,
});

function PuckHomePage() {
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
      title="拖拽编辑器"
      puckActive
      wide
      onSelectTab={(tab) => navigate({ to: "/admin", search: { tab } })}
    >
      <PuckHomeEditor />
    </AdminShell>
  );
}
