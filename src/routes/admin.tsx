import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  LogOut,
  Trash2,
  CheckCircle2,
  Circle,
  PlusCircle,
  Newspaper,
  Inbox,
} from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import {
  adminCreateNews,
  adminDeleteInquiry,
  adminDeleteNews,
  adminListAllNews,
  adminListInquiries,
  adminToggleInquiry,
} from "@/lib/site.functions";
import {
  clearAdminToken,
  getAdminToken,
} from "@/lib/admin-auth";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "管理后台 — 景鸿科技" }] }),
  component: AdminPage,
});

function AdminPage() {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  const [tab, setTab] = useState<"inquiries" | "news">("inquiries");

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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-24 lg:pt-40">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-xs font-medium uppercase tracking-[0.3em] text-mid-blue">
                Admin Console
              </div>
              <h1 className="mt-3 font-display text-4xl font-bold text-navy-deep md:text-5xl">
                管理后台
              </h1>
            </div>
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 border border-border bg-white px-5 py-2.5 text-sm text-navy-deep transition-colors hover:bg-silver/30"
            >
              <LogOut size={14} /> 退出登录
            </button>
          </div>

          <div className="mt-10 flex gap-1 border-b border-border">
            {[
              { id: "inquiries" as const, label: "询盘管理", icon: Inbox },
              { id: "news" as const, label: "新闻发布", icon: Newspaper },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`inline-flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-medium transition-colors ${
                  tab === t.id
                    ? "border-navy-deep text-navy-deep"
                    : "border-transparent text-muted-foreground hover:text-navy-deep"
                }`}
              >
                <t.icon size={16} /> {t.label}
              </button>
            ))}
          </div>

          <div className="mt-8">
            {tab === "inquiries" ? (
              <InquiriesPanel token={token} />
            ) : (
              <NewsPanel token={token} />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function fmt(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(
    d.getMinutes(),
  ).padStart(2, "0")}`;
}

function InquiriesPanel({ token }: { token: string }) {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-inquiries"],
    queryFn: () => adminListInquiries({ data: { password: token } }),
  });
  const items = data?.items ?? [];

  const toggle = async (id: string, handled: boolean) => {
    try {
      await adminToggleInquiry({ data: { password: token, id, handled } });
      qc.invalidateQueries({ queryKey: ["admin-inquiries"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "操作失败");
    }
  };

  const remove = async (id: string) => {
    if (!confirm("确定删除这条询盘吗？")) return;
    try {
      await adminDeleteInquiry({ data: { password: token, id } });
      toast.success("已删除");
      qc.invalidateQueries({ queryKey: ["admin-inquiries"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "删除失败");
    }
  };

  if (isLoading) return <div className="py-12 text-muted-foreground">加载中...</div>;
  if (items.length === 0)
    return (
      <div className="border border-dashed border-border bg-white p-16 text-center text-muted-foreground">
        暂无询盘
      </div>
    );

  return (
    <div className="space-y-3">
      {items.map((q) => (
        <div
          key={q.id}
          className={`border bg-white p-6 transition-colors ${
            q.handled ? "border-border opacity-70" : "border-mid-blue/40"
          }`}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-display text-lg font-bold text-navy-deep">
                  {q.name}
                </span>
                {q.company ? (
                  <span className="text-sm text-muted-foreground">
                    @ {q.company}
                  </span>
                ) : null}
                {q.handled ? (
                  <span className="rounded-sm bg-silver/40 px-2 py-0.5 text-xs text-muted-foreground">
                    已处理
                  </span>
                ) : (
                  <span className="rounded-sm bg-mid-blue/20 px-2 py-0.5 text-xs text-mid-blue">
                    待处理
                  </span>
                )}
              </div>
              <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
                {q.phone ? <span>电话：{q.phone}</span> : null}
                {q.email ? <span>邮箱：{q.email}</span> : null}
                <span>时间：{fmt(q.created_at)}</span>
              </div>
              <p className="mt-4 whitespace-pre-wrap text-sm text-navy-deep">
                {q.message}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => toggle(q.id, !q.handled)}
                className="inline-flex items-center gap-1 border border-border bg-white px-3 py-2 text-xs text-navy-deep transition-colors hover:bg-silver/30"
              >
                {q.handled ? <Circle size={14} /> : <CheckCircle2 size={14} />}
                {q.handled ? "标记待处理" : "标记已处理"}
              </button>
              <button
                onClick={() => remove(q.id)}
                className="inline-flex items-center gap-1 border border-border bg-white px-3 py-2 text-xs text-red-600 transition-colors hover:bg-red-50"
              >
                <Trash2 size={14} /> 删除
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function NewsPanel({ token }: { token: string }) {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-news"],
    queryFn: () => adminListAllNews({ data: { password: token } }),
  });
  const items = data?.items ?? [];

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [cover, setCover] = useState("");
  const [content, setContent] = useState("");
  const [posting, setPosting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPosting(true);
    try {
      await adminCreateNews({
        data: {
          password: token,
          title,
          summary: summary || null,
          cover_url: cover || null,
          content,
          published: true,
        },
      });
      toast.success("新闻已发布");
      setTitle("");
      setSummary("");
      setCover("");
      setContent("");
      qc.invalidateQueries({ queryKey: ["admin-news"] });
      qc.invalidateQueries({ queryKey: ["public-news"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "发布失败");
    } finally {
      setPosting(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("确定删除这条新闻吗？")) return;
    try {
      await adminDeleteNews({ data: { password: token, id } });
      toast.success("已删除");
      qc.invalidateQueries({ queryKey: ["admin-news"] });
      qc.invalidateQueries({ queryKey: ["public-news"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "删除失败");
    }
  };

  const cls =
    "mt-2 w-full border border-border bg-white px-4 py-3 text-sm text-navy-deep outline-none focus:border-mid-blue";

  return (
    <div className="grid gap-10 lg:grid-cols-5">
      <form
        onSubmit={submit}
        className="border border-border bg-white p-8 lg:col-span-2"
      >
        <h3 className="font-display text-xl font-bold text-navy-deep">
          发布新闻
        </h3>
        <label className="mt-6 block">
          <span className="text-xs font-medium uppercase tracking-wider text-navy-deep">
            标题 *
          </span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className={cls}
          />
        </label>
        <label className="mt-5 block">
          <span className="text-xs font-medium uppercase tracking-wider text-navy-deep">
            摘要
          </span>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={2}
            className={cls}
          />
        </label>
        <label className="mt-5 block">
          <span className="text-xs font-medium uppercase tracking-wider text-navy-deep">
            封面图片 URL（可选）
          </span>
          <input
            value={cover}
            onChange={(e) => setCover(e.target.value)}
            placeholder="https://..."
            className={cls}
          />
        </label>
        <label className="mt-5 block">
          <span className="text-xs font-medium uppercase tracking-wider text-navy-deep">
            正文 *
          </span>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={10}
            className={cls}
          />
        </label>
        <button
          type="submit"
          disabled={posting}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 bg-navy-deep px-6 py-3 text-sm font-medium text-white transition-all hover:bg-navy disabled:opacity-60"
        >
          <PlusCircle size={14} /> {posting ? "发布中..." : "发布新闻"}
        </button>
      </form>

      <div className="lg:col-span-3">
        <h3 className="font-display text-xl font-bold text-navy-deep">
          已发布新闻
        </h3>
        {isLoading ? (
          <div className="mt-6 py-12 text-muted-foreground">加载中...</div>
        ) : items.length === 0 ? (
          <div className="mt-6 border border-dashed border-border bg-white p-12 text-center text-muted-foreground">
            暂无新闻
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {items.map((n) => (
              <div
                key={n.id}
                className="flex items-start justify-between gap-4 border border-border bg-white p-5"
              >
                <div className="flex-1">
                  <div className="font-display text-base font-bold text-navy-deep">
                    {n.title}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {fmt(n.created_at)}
                  </div>
                  {n.summary ? (
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                      {n.summary}
                    </p>
                  ) : null}
                </div>
                <button
                  onClick={() => remove(n.id)}
                  className="inline-flex items-center gap-1 border border-border px-3 py-2 text-xs text-red-600 transition-colors hover:bg-red-50"
                >
                  <Trash2 size={14} /> 删除
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}