import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Menu, X } from "lucide-react";
import defaultLogoAsset from "@/assets/jinghong-logo-v2.png.asset.json";
import { getSiteSettings } from "@/lib/site.functions";
const defaultLogo = defaultLogoAsset.url;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { data } = useQuery({
    queryKey: ["site-settings"],
    queryFn: () => getSiteSettings(),
    staleTime: 60_000,
  });

  const s = data?.item;
  const logoUrl = s?.logo_url || defaultLogo;
  const links = [
    { to: "/", label: s?.nav_home || "首页" },
    { to: "/products", label: s?.nav_products || "产品" },
    { to: "/news", label: s?.nav_news || "新闻" },
    { to: "/about", label: s?.nav_about || "关于我们" },
    { to: "/contact", label: s?.nav_contact || "联系我们" },
  ] as const;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "border-b border-white/10 bg-navy-deep/85 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:h-20 lg:px-10">
        <Link to="/" className="flex items-center">
          <img
            src={logoUrl}
            alt={s?.company_name || "Logo"}
            className="h-20 w-auto max-w-[20rem] object-contain lg:h-24 lg:max-w-[26rem]"
          />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="relative px-4 py-2 text-sm font-medium text-silver/80 transition-colors hover:text-white"
              activeProps={{ className: "text-white" }}
              activeOptions={{ exact: link.to === "/" }}
            >
              {({ isActive }) => (
                <>
                  {link.label}
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
          {s?.nav_cta || "获取报价"} {"->"}
        </Link>

        <button onClick={() => setOpen(!open)} className="text-white lg:hidden" aria-label="Toggle menu">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-navy-deep/95 backdrop-blur-xl lg:hidden">
          <nav className="flex flex-col px-6 py-4">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className="border-b border-white/5 py-3 text-base font-medium text-silver/80"
                activeProps={{ className: "text-white" }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
