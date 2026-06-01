import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  LogOut,
  Settings,
  Home,
  Package,
  Workflow,
  Newspaper,
  Info,
  Phone,
  Inbox,
} from "lucide-react";
import { clearAdminToken, getAdminToken } from "@/lib/admin-auth";
import { SiteSettingsPanel, AboutPanel, ContactPanel } from "@/components/admin/SettingsPanel";
import { HomePanel } from "@/components/admin/HomePanel";
import { ProductsPanel, ProcessPanel } from "@/components/admin/ProductsPanel";
import { NewsPanel } from "@/components/admin/NewsPanel";
import { InquiriesPanel } from "@/components/admin/InquiriesPanel";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "管理后台 — 景鸿科技" }] }),
  component: AdminPage,
});

type TabId =
  | "settings"
  | "home"
  | "products"
  | "process"
  | "news"
  | "about"
  | "contact"
  | "inquiries";

const TABS: { id: TabId; label: string; icon: typeof Settings }[] = [
  { id: "settings", label: "基础设置", icon: Settings },
  { id: "home", label: "首页内容", icon: Home },
  { id: "products", label: "产品管理", icon: Package },
  { id: "process", label: "制造流程", icon: Workflow },
  { id: "news", label: "新闻资讯", icon: Newspaper },
  { id: "about", label: "关于我们", icon: Info },
  { id: "contact", label: "联系我们", icon: Phone },
  { id: "inquiries", label: "询盘管理", icon: Inbox },
];

function AdminPage() {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  const [tab, setTab] = useState<TabId>("settings");

  useEffect(() => {
    const t = getAdminToken();
    if (!t) {
      navigate({ to: "/login" });
      return;
    }
    setToken(t);
  }, [navigate]);

  const logout = () => {
    clearAdminToken();
    navigate({ to: "/login" });
  };

  if (!token) return null;

  const current = TABS.find((t) => t.id === tab)!;

  return (
    <div className="min-h-screen bg-silver/20">
      <header className="sticky top-0 z-30 border-b border-border bg-white">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-4">
          <div>
            <div className="text-[10px] font-medium uppercase tracking-[0.3em] text-mid-blue">
              Admin Console
            </div>
            <div className="font-display text-lg font-bold text-navy-deep">
              景鸿科技 内容管理后台
            </div>
          </div>
          <button
            onClick={logout}
            className="inline-flex items-center gap-2 border border-border bg-white px-4 py-2 text-sm text-navy-deep transition-colors hover:bg-silver/30"
          >
            <LogOut size={14} /> 退出登录
          </button>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1600px] gap-6 px-6 py-8">
        <aside className="w-56 shrink-0">
          <nav className="sticky top-24 space-y-1">
            {TABS.map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex w-full items-center gap-3 border-l-2 px-4 py-3 text-sm transition-colors ${
                    active
                      ? "border-navy-deep bg-white font-medium text-navy-deep"
                      : "border-transparent text-muted-foreground hover:bg-white hover:text-navy-deep"
                  }`}
                >
                  <Icon size={16} /> {t.label}
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0 flex-1">
          <h1 className="font-display text-2xl font-bold text-navy-deep">
            {current.label}
          </h1>
          <div className="mt-6">
            {tab === "settings" && <SiteSettingsPanel token={token} />}
            {tab === "home" && <HomePanel token={token} />}
            {tab === "products" && <ProductsPanel token={token} />}
            {tab === "process" && <ProcessPanel token={token} />}
            {tab === "news" && <NewsPanel token={token} />}
            {tab === "about" && <AboutPanel token={token} />}
            {tab === "contact" && <ContactPanel token={token} />}
            {tab === "inquiries" && <InquiriesPanel token={token} />}
          </div>
        </main>
      </div>
    </div>
  );
}
