import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { adminCheckSession } from "@/lib/admin-auth";
import { SiteSettingsPanel, AboutPanel, ContactPanel } from "@/components/admin/SettingsPanel";
import { HomePanel } from "@/components/admin/HomePanel";
import { ProductsPanel, ProcessPanel } from "@/components/admin/ProductsPanel";
import { NewsPanel } from "@/components/admin/NewsPanel";
import { InquiriesPanel } from "@/components/admin/InquiriesPanel";
import { ADMIN_TABS, AdminShell, type AdminTabId } from "@/components/admin/AdminShell";

export const Route = createFileRoute("/admin/")({
  validateSearch: (search: Record<string, unknown>) => ({
    tab: typeof search.tab === "string" ? search.tab : undefined,
  }),
  head: () => ({ meta: [{ title: "后台管理" }] }),
  component: AdminPage,
});

function AdminPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [tab, setTab] = useState<AdminTabId>("settings");

  useEffect(() => {
    let cancelled = false;
    adminCheckSession().then((ok) => {
      if (cancelled) return;
      if (!ok) {
        navigate({ to: "/login" });
        return;
      }
      setAuthed(true);
      setChecking(false);
    });
    return () => { cancelled = true; };
  }, [navigate]);

  useEffect(() => {
    if (!search.tab) return;
    const matched = ADMIN_TABS.find((item) => item.id === search.tab);
    if (matched) setTab(matched.id);
  }, [search.tab]);

  if (checking || !authed) return null;

  const current = ADMIN_TABS.find((t) => t.id === tab)!;
  const onSelectTab = (next: AdminTabId) => {
    setTab(next);
    navigate({ to: "/admin", search: { tab: next } });
  };

  // Server fns no longer require a real token; the empty string is a
  // placeholder so legacy panel props keep their type signature.
  const token = "";

  return (
    <AdminShell title={current.label} activeTab={tab} onSelectTab={onSelectTab}>
      {tab === "settings" && <SiteSettingsPanel token={token} />}
      {tab === "home" && <HomePanel token={token} />}
      {tab === "products" && <ProductsPanel token={token} />}
      {tab === "process" && <ProcessPanel token={token} />}
      {tab === "news" && <NewsPanel token={token} />}
      {tab === "about" && <AboutPanel token={token} />}
      {tab === "contact" && <ContactPanel token={token} />}
      {tab === "inquiries" && <InquiriesPanel token={token} />}
    </AdminShell>
  );
}
