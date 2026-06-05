import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, LogIn } from "lucide-react";
import { toast } from "sonner";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { adminLoginRequest } from "@/lib/admin-auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [{ title: "管理员登录 — 景鸿科技" }],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminLoginRequest({ username, password, remember });
      toast.success("登录成功");
      navigate({ to: "/admin" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "登录失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="flex min-h-screen items-center justify-center px-6 py-32">
        <form
          onSubmit={onSubmit}
          className="w-full max-w-md border border-border bg-white p-10 shadow-xl"
        >
          <div className="flex h-12 w-12 items-center justify-center bg-navy-deep text-white">
            <Lock size={20} strokeWidth={1.5} />
          </div>
          <h1 className="mt-6 font-display text-3xl font-bold text-navy-deep">
            管理员登录
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            登录状态由服务端通过 HttpOnly Cookie 管理，前端 JS 无法读取凭证。
          </p>

          <label className="mt-8 block">
            <span className="text-xs font-medium uppercase tracking-wider text-navy-deep">
              用户名
            </span>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              className="mt-2 w-full border border-border bg-white px-4 py-3 text-sm text-navy-deep outline-none focus:border-mid-blue"
            />
          </label>

          <label className="mt-6 block">
            <span className="text-xs font-medium uppercase tracking-wider text-navy-deep">
              密码
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="mt-2 w-full border border-border bg-white px-4 py-3 text-sm text-navy-deep outline-none focus:border-mid-blue"
            />
          </label>

          <label className="mt-6 flex items-center gap-2 text-sm text-navy-deep">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 border-border"
            />
            <span>记住我（14 天免登录）</span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="mt-8 inline-flex w-full items-center justify-center gap-2 bg-navy-deep px-6 py-4 text-sm font-medium text-white transition-all hover:bg-navy disabled:opacity-60"
          >
            {loading ? "登录中..." : "登录"} <LogIn size={14} />
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
}
