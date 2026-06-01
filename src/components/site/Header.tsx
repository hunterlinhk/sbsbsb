import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import logoUrl from "@/assets/logo.png";

const links = [
  { to: "/", label: "首页" },
  { to: "/products", label: "产品中心" },
  { to: "/news", label: "新闻资讯" },
  { to: "/about", label: "关于我们" },
  { to: "/contact", label: "联系我们" },
] as const;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-navy-deep/85 backdrop-blur-md border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:h-20 lg:px-10">
        <Link to="/" className="flex items-center group">
          <img
            src={logoUrl}
            alt="景鸿科技 Jinghong Technology"
            className="h-10 w-auto lg:h-12 bg-white/95 rounded-sm px-2 py-1"
          />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="relative px-4 py-2 text-sm font-medium text-silver/80 transition-colors hover:text-white"
              activeProps={{ className: "text-white" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {({ isActive }) => (
                <>
                  {l.label}
                  <span
                    className={`absolute inset-x-4 -bottom-0.5 h-px bg-mid-blue transition-transform duration-300 ${
                      isActive ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </>
              )}
            </Link>
          ))}
        </nav>

        <Link
          to="/contact"
          className="hidden rounded-sm border border-white/20 bg-white/5 px-5 py-2 text-sm font-medium text-white backdrop-blur transition-all hover:border-mid-blue hover:bg-mid-blue/20 lg:inline-flex"
        >
          获取报价 →
        </Link>

        <button
          onClick={() => setOpen(!open)}
          className="text-white lg:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-navy-deep/95 backdrop-blur-xl border-t border-white/10">
          <nav className="flex flex-col px-6 py-4">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="py-3 text-base font-medium text-silver/80 border-b border-white/5"
                activeProps={{ className: "text-white" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}