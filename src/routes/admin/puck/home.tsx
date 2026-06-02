import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { PuckHomeEditor } from "@/components/admin/PuckHomeEditor";
import { getAdminToken } from "@/lib/admin-auth";

export const Route = createFileRoute("/admin/puck/home")({
  head: () => ({ meta: [{ title: "首页拖拽编辑器原型" }] }),
  component: PuckHomePage,
});

function PuckHomePage() {
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
      title="拖拽编辑器"
      puckActive
      wide
      onSelectTab={(tab) => navigate({ to: "/admin", search: { tab } })}
    >
      <PuckHomeEditor />
    </AdminShell>
  );
}

