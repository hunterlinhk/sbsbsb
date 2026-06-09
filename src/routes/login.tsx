import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, User, Eye, EyeOff, ShieldCheck, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { adminLoginRequest } from "@/lib/admin-auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [{ title: "景鸿科技控制台 — 管理员登录" }],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminLoginRequest({ username, password, remember });
      toast.success("登录成功");
      navigate({ to: "/admin" });
    } catch {
      toast.error("用户名或密码不正确");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#eef3fb] via-[#e6ecf6] to-[#dde6f2]">
      {/* Decorative tech background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(30,58,95,0.18) 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full opacity-30"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="coilGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3b6fa0" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#3b6fa0" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="12%" cy="22%" r="320" fill="url(#coilGlow)" />
        <circle cx="88%" cy="78%" r="380" fill="url(#coilGlow)" />
        {/* Magnetic field / coil rings */}
        <g fill="none" stroke="#1e3a5f" strokeOpacity="0.08" strokeWidth="1">
          <ellipse cx="15%" cy="80%" rx="220" ry="60" />
          <ellipse cx="15%" cy="80%" rx="280" ry="80" />
          <ellipse cx="15%" cy="80%" rx="340" ry="100" />
          <ellipse cx="85%" cy="18%" rx="220" ry="60" />
          <ellipse cx="85%" cy="18%" rx="280" ry="80" />
          <ellipse cx="85%" cy="18%" rx="340" ry="100" />
        </g>
      </svg>

      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5 lg:px-10">
        <Link
          to="/"
          className="font-display text-base font-bold tracking-tight text-navy-deep lg:text-lg"
        >
          景鸿科技 <span className="mx-1 text-mid-blue">·</span>
          <span className="font-sans font-medium">管理系统</span>
        </Link>
        <Link
          to="/"
          className="group inline-flex items-center gap-1.5 text-sm text-navy hover:text-mid-blue transition-colors"
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
          返回官网
        </Link>
      </header>

      {/* Main */}
      <main className="relative z-10 flex min-h-[calc(100vh-160px)] items-center justify-center px-4 py-10">
        <form
          onSubmit={onSubmit}
          className="w-[90%] max-w-[420px] rounded-[18px] border border-[#cfd8e6]/70 bg-white/70 p-8 shadow-[0_20px_60px_-20px_rgba(15,27,61,0.25)] backdrop-blur-xl sm:p-10"
        >
          {/* Coil/Lock icon */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center">
            <div className="group relative flex h-16 w-16 items-center justify-center rounded-full border border-mid-blue/30 bg-gradient-to-br from-white to-[#eaf1fb] shadow-inner transition-all hover:shadow-[0_0_28px_rgba(59,111,160,0.45)]">
              {/* Magnetic ripple rings on hover */}
              <span className="absolute inset-0 rounded-full border border-mid-blue/40 opacity-0 transition-all duration-700 group-hover:scale-125 group-hover:opacity-100" />
              <span className="absolute inset-0 rounded-full border border-mid-blue/30 opacity-0 transition-all duration-1000 group-hover:scale-150 group-hover:opacity-100" />
              <ShieldCheck
                size={26}
                strokeWidth={1.6}
                className="text-navy-deep transition-colors group-hover:text-mid-blue"
              />
            </div>
          </div>

          <h1 className="mt-6 text-center font-display text-2xl font-bold text-navy-deep sm:text-[26px]">
            景鸿科技控制台
          </h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            精密制造，从这里开始
          </p>

          {/* Username */}
          <label className="mt-8 block">
            <span className="text-xs font-medium uppercase tracking-wider text-navy">
              用户名
            </span>
            <div className="group relative mt-2">
              <User
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-navy-deep"
              />
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                className="w-full rounded-lg border border-[#d3dce8] bg-white/80 py-3 pl-10 pr-3 text-sm text-navy-deep outline-none transition-all focus:border-navy-deep focus:bg-white focus:ring-4 focus:ring-mid-blue/15"
              />
            </div>
          </label>

          {/* Password */}
          <label className="mt-5 block">
            <span className="text-xs font-medium uppercase tracking-wider text-navy">
              密码
            </span>
            <div className="group relative mt-2">
              <Lock
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-navy-deep"
              />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full rounded-lg border border-[#d3dce8] bg-white/80 py-3 pl-10 pr-11 text-sm text-navy-deep outline-none transition-all focus:border-navy-deep focus:bg-white focus:ring-4 focus:ring-mid-blue/15"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-muted-foreground transition-colors hover:bg-mid-blue/10 hover:text-navy-deep"
                aria-label={showPassword ? "隐藏密码" : "显示密码"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </label>

          {/* Remember */}
          <label className="mt-5 flex cursor-pointer items-center gap-2.5 text-sm text-navy select-none">
            <span className="relative inline-flex h-4 w-4 items-center justify-center">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-[#c4d0e0] bg-white transition-colors checked:border-navy-deep checked:bg-navy-deep focus:outline-none focus:ring-2 focus:ring-mid-blue/30"
              />
              <svg
                className="pointer-events-none absolute h-3 w-3 text-white opacity-0 peer-checked:opacity-100"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
            <span>记住我 <span className="text-muted-foreground">（14 天免登录）</span></span>
          </label>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-[#1e3a5f] via-[#162e4d] to-[#0f1b3d] px-6 py-3.5 text-sm font-medium tracking-wide text-white shadow-[0_8px_24px_-8px_rgba(15,27,61,0.6)] transition-all hover:shadow-[0_10px_32px_-6px_rgba(59,111,160,0.6)] hover:brightness-110 active:translate-y-[1px] active:shadow-[0_4px_12px_-4px_rgba(15,27,61,0.5)] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                正在校验权限...
              </>
            ) : (
              <>
                <ShieldCheck size={15} strokeWidth={2} />
                安全登录
              </>
            )}
          </button>

          <p className="mt-6 text-center text-[11px] leading-relaxed text-muted-foreground">
            登录状态由服务端通过 HttpOnly Cookie 管理，前端 JS 无法读取凭证。
          </p>
        </form>
      </main>

      <footer className="relative z-10 px-6 pb-6 text-center text-[11px] tracking-wide text-muted-foreground">
        © Dongguan Jinghong Technology Co., Ltd. Admin Console
      </footer>
    </div>
  );
}
