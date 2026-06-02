import { type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Home,
  Inbox,
  Info,
  LogOut,
  Newspaper,
  Package,
  PanelsTopLeft,
  Phone,
  Settings,
  Workflow,
} from "lucide-react";
import { clearAdminToken } from "@/lib/admin-auth";

export type AdminTabId =
  | "settings"
  | "home"
  | "products"
  | "process"
  | "news"
  | "about"
  | "contact"
  | "inquiries";

export const ADMIN_TABS: { id: AdminTabId; label: string; icon: typeof Settings }[] = [
  { id: "settings", label: "基础设置", icon: Settings },
  { id: "home", label: "首页内容", icon: Home },
  { id: "products", label: "产品管理", icon: Package },
  { id: "process", label: "制造流程", icon: Workflow },
  { id: "news", label: "新闻资讯", icon: Newspaper },
  { id: "about", label: "关于我们", icon: Info },
  { id: "contact", label: "联系我们", icon: Phone },
  { id: "inquiries", label: "询盘管理", icon: Inbox },
];

export function AdminShell({
  title,
  activeTab,
  liveEditorActive = false,
  puckActive = false,
  wide = false,
  onSelectTab,
  children,
}: {
  title: string;
  activeTab?: AdminTabId;
  liveEditorActive?: boolean;
  puckActive?: boolean;
  wide?: boolean;
  onSelectTab?: (tab: AdminTabId) => void;
  children: ReactNode;
}) {

  const navigate = useNavigate();

  const logout = () => {
    clearAdminToken();
    navigate({ to: "/login" });
  };

  return (
    <div className="min-h-screen bg-silver/20">
      <header className="sticky top-0 z-30 border-b border-border bg-white">
        <div className={`mx-auto flex ${wide ? "max-w-none" : "max-w-[1600px]"} items-center justify-between px-6 py-4`}>
          <div>
            <div className="text-[10px] font-medium uppercase tracking-[0.3em] text-mid-blue">Admin Console</div>
            <div className="font-display text-lg font-bold text-navy-deep">景鸿科技 内容管理后台</div>
          </div>
          <button
            onClick={logout}
            className="inline-flex items-center gap-2 border border-border bg-white px-4 py-2 text-sm text-navy-deep transition-colors hover:bg-silver/30"
          >
            <LogOut size={14} /> 退出登录
          </button>
        </div>
      </header>

      <div className={`mx-auto flex ${wide ? "max-w-none" : "max-w-[1600px]"} gap-6 px-6 py-8`}>
        <aside className="w-56 shrink-0">
          <nav className="sticky top-24 space-y-1">

            {ADMIN_TABS.map((t) => {
              const Icon = t.icon;
              const active = !liveEditorActive && !puckActive && activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => onSelectTab?.(t.id)}
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

            <Link
              to="/admin/live-editor/home"
              className={`flex w-full items-center gap-3 border-l-2 px-4 py-3 text-sm transition-colors ${
                liveEditorActive
                  ? "border-navy-deep bg-white font-medium text-navy-deep"
                  : "border-transparent text-muted-foreground hover:bg-white hover:text-navy-deep"
              }`}
            >
              <PanelsTopLeft size={16} /> 可视化编辑
            </Link>

            <Link
              to="/admin/puck/home"
              className={`flex w-full items-center gap-3 border-l-2 px-4 py-3 text-sm transition-colors ${
                puckActive
                  ? "border-navy-deep bg-white font-medium text-navy-deep"
                  : "border-transparent text-muted-foreground hover:bg-white hover:text-navy-deep"
              }`}
            >
              <PanelsTopLeft size={16} /> 拖拽编辑器
            </Link>
          </nav>
        </aside>

        <main className="min-w-0 flex-1">
          <h1 className="font-display text-2xl font-bold text-navy-deep">{title}</h1>
          <div className="mt-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
