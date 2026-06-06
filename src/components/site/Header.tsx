import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, Menu, X } from "lucide-react";
import defaultLogoAsset from "@/assets/jinghong-logo-v2.png.asset.json";
import { getSiteSettings, getProductsPageData } from "@/lib/site.functions";
const defaultLogo = defaultLogoAsset.url;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const { data } = useQuery({
    queryKey: ["site-settings"],
    queryFn: () => getSiteSettings(),
    staleTime: 60_000,
  });
  const { data: productsData } = useQuery({
    queryKey: ["products-page"],
    queryFn: () => getProductsPageData(),
    staleTime: 60_000,
  });

  const s = data?.item;
  const logoUrl = s?.logo_url || defaultLogo;
  const products = productsData?.products ?? [];
  const productsLabel = s?.nav_products || "产品中心";

  const links = [
    { to: "/", label: s?.nav_home || "首页" },
    { to: "/products", label: productsLabel, hasDropdown: true },
    { to: "/news", label: s?.nav_news || "新闻资讯" },
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
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
        <Link to="/" className="flex items-center">
          <img
            src={logoUrl}
            alt={s?.company_name || "Logo"}
            className="h-28 w-auto max-w-[24rem] object-contain lg:h-36 lg:max-w-[32rem]"
          />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((link) => {
            const isProducts = "hasDropdown" in link && link.hasDropdown;
            return (
              <div key={link.to} className="group relative">
                <Link
                  to={link.to}
                  className="relative inline-flex items-center gap-1 px-4 py-2 text-sm font-medium text-silver/80 transition-colors hover:text-white"
                  activeProps={{ className: "text-white" }}
                  activeOptions={{ exact: link.to === "/" }}
                >
                  {link.label}
                  {isProducts && (
                    <ChevronDown size={14} className="transition-transform duration-300 group-hover:rotate-180" />
                  )}
                  <span className="pointer-events-none absolute inset-x-4 -bottom-0.5 h-px origin-left scale-x-0 bg-mid-blue transition-transform duration-300 group-hover:scale-x-100" />
                </Link>

                {isProducts && products.length > 0 && (
                  <div className="invisible absolute left-1/2 top-full z-50 w-40 -translate-x-1/2 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
                    <div className="overflow-hidden border border-white/10 bg-navy-deep/95 shadow-2xl backdrop-blur-md">
                      <Link
                        to="/products"
                        className="block border-b border-white/10 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-mid-blue/20"
                      >
                        {productsLabel}（全部）
                      </Link>
                      <div className="max-h-[60vh] overflow-y-auto">
                        {products.map((p) => (
                          <Link
                            key={p.id}
                            to="/products"
                            hash={`product-${p.id}`}
                            className="block px-5 py-2.5 text-sm text-silver/80 transition-colors hover:bg-mid-blue/20 hover:text-white"
                          >
                            {p.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
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
            {links.map((link) => {
              const isProducts = "hasDropdown" in link && link.hasDropdown;
              if (isProducts && products.length > 0) {
                return (
                  <div key={link.to} className="border-b border-white/5">
                    <button
                      onClick={() => setMobileProductsOpen((v) => !v)}
                      className="flex w-full items-center justify-between py-3 text-base font-medium text-silver/80"
                    >
                      {link.label}
                      <ChevronDown
                        size={16}
                        className={`transition-transform ${mobileProductsOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {mobileProductsOpen && (
                      <div className="pb-3 pl-3">
                        <Link
                          to="/products"
                          onClick={() => setOpen(false)}
                          className="block py-2 text-sm text-white"
                        >
                          {productsLabel}（全部）
                        </Link>
                        {products.map((p) => (
                          <Link
                            key={p.id}
                            to="/products"
                            hash={`product-${p.id}`}
                            onClick={() => setOpen(false)}
                            className="block py-2 text-sm text-silver/70"
                          >
                            {p.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className="border-b border-white/5 py-3 text-base font-medium text-silver/80"
                  activeProps={{ className: "text-white" }}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
