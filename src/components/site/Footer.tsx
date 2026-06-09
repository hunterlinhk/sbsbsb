import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Mail, MapPin, Phone } from "lucide-react";
import defaultLogoAsset from "@/assets/jinghong-logo-v2.png.asset.json";
import { getSiteSettings } from "@/lib/site.functions";

const defaultLogo = defaultLogoAsset.url;

export function Footer() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { data } = useQuery({
    queryKey: ["site-settings"],
    queryFn: () => getSiteSettings(),
    staleTime: 60_000,
    enabled: mounted,
  });

  const s = mounted ? data?.item : undefined;
  const logoUrl = s?.logo_url || defaultLogo;
  const copyright = (s?.footer_copyright || "Copyright {year} Company. All rights reserved.").replace(
    "{year}",
    String(new Date().getFullYear()),
  );

  return (
    <footer className="border-t border-white/5 bg-navy-deep text-silver/70">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="inline-flex items-center">
              <img
                src={logoUrl}
                alt={s?.company_name || "Logo"}
                className="h-14 w-auto max-w-[12rem] object-contain"
              />
            </div>
            <p className="mt-6 max-w-md text-sm leading-relaxed">
              {s?.footer_intro ||
                "Focused on precision manufacturing, reliable delivery, and scalable production support."}
            </p>
          </div>

          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white">Navigation</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link to="/" className="transition-colors hover:text-white">{s?.nav_home || "Home"}</Link></li>
              <li><Link to="/products" className="transition-colors hover:text-white">{s?.nav_products || "Products"}</Link></li>
              <li><Link to="/news" className="transition-colors hover:text-white">{s?.nav_news || "News"}</Link></li>
              <li><Link to="/about" className="transition-colors hover:text-white">{s?.nav_about || "About"}</Link></li>
              <li><Link to="/contact" className="transition-colors hover:text-white">{s?.nav_contact || "Contact"}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white">Contact</h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 shrink-0 text-mid-blue" />
                <span>{s?.address || "Dongguan, Guangdong"}</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone size={16} className="mt-0.5 shrink-0 text-mid-blue" />
                <span>{s?.phone || "Please contact us for phone support"}</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail size={16} className="mt-0.5 shrink-0 text-mid-blue" />
                <span>{s?.email || "Please contact us for email support"}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/5 pt-6 text-xs text-silver/50 sm:flex-row sm:items-center sm:justify-between">
          <span>{copyright}</span>
          <div className="flex items-center gap-4">
            <span>{s?.footer_slogan || "Precision manufacturing for modern products"}</span>
            <Link to="/login" className="text-silver/60 transition-colors hover:text-white">
              Staff Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
