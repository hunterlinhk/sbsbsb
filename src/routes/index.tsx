import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Cpu, Factory, ShieldCheck, Zap, type LucideIcon } from "lucide-react";
import { Fragment, useMemo, useRef, type ReactNode } from "react";
import { Render } from "@measured/puck";
import { Counter } from "@/components/site/Counter";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { Reveal } from "@/components/site/Reveal";
import heroFactoryAsset from "@/assets/hero-factory-new.jpg.asset.json";
const heroFactory = heroFactoryAsset.url;
import workshopImg from "@/assets/workshop.jpg";
import qualityImg from "@/assets/quality.jpg";
import coilImg from "@/assets/product-coil.jpg";
import motorImg from "@/assets/product-motor.jpg";
import { getHomeContent } from "@/lib/site.functions";
import { puckConfig, isValidPuckData } from "@/lib/puck-config";

const homeContentQueryOptions = queryOptions({
  queryKey: ["home-content"],
  queryFn: () => getHomeContent(),
  staleTime: 60_000,
});

function HomeLoadingShell() {
  return (
    <div className="min-h-screen bg-navy-deep">
      <div className="h-16 w-full border-b border-white/5" />
      <div className="mx-auto max-w-7xl px-6 pt-24 lg:px-10">
        <div className="h-3 w-32 animate-pulse rounded bg-white/10" />
        <div className="mt-6 h-12 w-3/4 animate-pulse rounded bg-white/10" />
        <div className="mt-4 h-12 w-2/3 animate-pulse rounded bg-white/10" />
        <div className="mt-8 h-4 w-1/2 animate-pulse rounded bg-white/5" />
        <div className="mt-2 h-4 w-2/5 animate-pulse rounded bg-white/5" />
      </div>
    </div>
  );
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "景鸿科技有限公司" },
      { name: "description", content: "景鸿科技首页" },
      { property: "og:image", content: heroFactory },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(homeContentQueryOptions),
  pendingComponent: HomeLoadingShell,
  errorComponent: ({ error }) => (
    <div className="flex min-h-screen items-center justify-center bg-navy-deep text-white">
      <div className="text-center">
        <p className="text-sm text-silver/70">页面加载失败</p>
        <p className="mt-2 text-xs text-silver/50">{error.message}</p>
      </div>
    </div>
  ),
  component: IndexPage,
});

type HomeData = Awaited<ReturnType<typeof getHomeContent>>["home"] | undefined;
type SectionId = "hero" | "stats" | "capabilities" | "clients" | "advantage" | "cta";

const ICONS: Record<string, LucideIcon> = { Cpu, Zap, Factory, ShieldCheck };
const DEFAULT_SECTION_ORDER: SectionId[] = ["hero", "stats", "capabilities", "clients", "advantage", "cta"];
const DEFAULT_BRANDS = ["SAMSUNG", "HUAWEI", "XIAOMI", "TRANSSION", "OPPO", "VIVO"];

type FieldStyle = {
  fontFamily?: string;
  fontSize?: number;
  weight?: "normal" | "bold" | "black";
  italic?: "normal" | "italic";
  color?: string;
  // legacy
  bold?: boolean;
};
type FieldStyles = Record<string, FieldStyle>;

function styleOf(styles: FieldStyles | undefined, key: string): React.CSSProperties | undefined {
  const s = styles?.[key];
  if (!s) return undefined;
  const css: React.CSSProperties = {};
  if (s.fontFamily) css.fontFamily = s.fontFamily;
  if (s.fontSize) css.fontSize = `${s.fontSize}px`;
  if (s.weight === "normal") css.fontWeight = 400;
  else if (s.weight === "bold") css.fontWeight = 700;
  else if (s.weight === "black") css.fontWeight = 900;
  else if (s.bold) css.fontWeight = 700;
  if (s.italic === "italic") css.fontStyle = "italic";
  else if (s.italic === "normal") css.fontStyle = "normal";
  if (s.color) css.color = s.color;
  return Object.keys(css).length ? css : undefined;
}

function parseSectionOrder(v: unknown): SectionId[] {
  if (!Array.isArray(v)) return DEFAULT_SECTION_ORDER;
  const picked = v.filter(
    (x): x is SectionId => typeof x === "string" && DEFAULT_SECTION_ORDER.includes(x as SectionId),
  );
  const set = new Set(picked);
  for (const id of DEFAULT_SECTION_ORDER) {
    if (!set.has(id)) picked.push(id);
  }
  return picked;
}

function parseSectionVisibility(v: unknown): Record<SectionId, boolean> {
  const visibility = Object.fromEntries(
    DEFAULT_SECTION_ORDER.map((id) => [id, true]),
  ) as Record<SectionId, boolean>;
  if (v && typeof v === "object") {
    for (const id of DEFAULT_SECTION_ORDER) {
      const item = (v as Record<string, unknown>)[id];
      if (typeof item === "boolean") visibility[id] = item;
    }
  }
  return visibility;
}

type CustomFont = { name: string; url: string };

function parseCustomFonts(raw: unknown): CustomFont[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (f): f is CustomFont =>
      !!f && typeof (f as CustomFont).name === "string" && typeof (f as CustomFont).url === "string",
  );
}

function fontMimeFromUrl(url: string): string {
  const u = url.toLowerCase().split("?")[0];
  if (u.endsWith(".woff2")) return "font/woff2";
  if (u.endsWith(".woff")) return "font/woff";
  if (u.endsWith(".ttf")) return "font/ttf";
  if (u.endsWith(".otf")) return "font/otf";
  return "font/woff2";
}

// Title fonts get `block` (avoid swap flash on hero), body fonts get `swap`.
const TITLE_FONT_HINTS = ["title", "heading", "biaoti", "标题", "display", "黑体"];
function fontDisplayFor(name: string): "block" | "swap" {
  const n = name.toLowerCase();
  return TITLE_FONT_HINTS.some((h) => n.includes(h)) ? "block" : "swap";
}

function FontPreloader({ fonts }: { fonts: CustomFont[] }) {
  if (fonts.length === 0) return null;
  // Deduplicate by name
  const seen = new Set<string>();
  const unique = fonts.filter((f) => (seen.has(f.name) ? false : (seen.add(f.name), true)));
  const css = unique
    .map(
      (f) =>
        `@font-face{font-family:"${f.name.replace(/"/g, "")}";src:url("${f.url}");font-display:${fontDisplayFor(f.name)};}`,
    )
    .join("");
  return (
    <>
      {unique.map((f) => (
        <link
          key={f.name}
          rel="preload"
          as="font"
          href={f.url}
          type={fontMimeFromUrl(f.url)}
          crossOrigin="anonymous"
        />
      ))}
      {/* React 19 hoists <style> with a `precedence` prop into <head> during SSR */}
      <style
        {...({ precedence: "custom-fonts" } as Record<string, string>)}
        dangerouslySetInnerHTML={{ __html: css }}
      />
    </>
  );
}

function IndexPage() {
  const { data } = useSuspenseQuery(homeContentQueryOptions);

  const home = data?.home;
  const capabilities = data?.capabilities ?? [];
  const brands = (home?.brands as string[] | undefined) ?? DEFAULT_BRANDS;
  const puckData = (home as Record<string, unknown> | undefined)?.puck_data;

  const customFonts = useMemo(
    () => parseCustomFonts((home as Record<string, unknown> | undefined)?.custom_fonts),
    [home],
  );

  const sectionOrder = useMemo(
    () => parseSectionOrder((home as Record<string, unknown> | undefined)?.section_order),
    [home],
  );
  const sectionVisibility = useMemo(
    () => parseSectionVisibility((home as Record<string, unknown> | undefined)?.section_visibility),
    [home],
  );


  // If a valid Puck data blob exists, render it instead of the legacy sections.
  if (isValidPuckData(puckData)) {
    try {
      return (
        <div className="min-h-screen bg-background">
          <FontPreloader fonts={customFonts} />
          <Header />
          <main>
            <Render config={puckConfig} data={puckData} />
          </main>
          <Footer />
        </div>
      );
    } catch (e) {
      console.warn("[Home] Puck render failed, falling back to legacy sections", e);
      // fall through to legacy render below
    }
  }

  

  

  const fs = ((home as Record<string, unknown> | undefined)?.field_styles ?? {}) as FieldStyles;

  const sections: Record<SectionId, ReactNode> = {
    hero: <Hero h={home} fs={fs} />,
    stats: <Stats h={home} fs={fs} />,
    capabilities: <Capabilities h={home} capabilities={capabilities} fs={fs} />,
    clients: <Clients h={home} brands={brands} fs={fs} />,
    advantage: <Advantage h={home} fs={fs} />,
    cta: <CTA h={home} fs={fs} />,
  };

  return (
    <div className="min-h-screen bg-background">
      <FontPreloader fonts={customFonts} />
      <Header />
      <main>
        {sectionOrder.map((id) =>
          sectionVisibility[id] ? <Fragment key={id}>{sections[id]}</Fragment> : null,
        )}
      </main>
      <Footer />
    </div>
  );
}


function Hero({ h, fs }: { h: HomeData; fs: FieldStyles }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const exploreLink = h?.btn_explore_link || "/products";
  const contactLink = h?.btn_contact_link || "/contact";

  return (
    <section ref={ref} className="relative h-screen min-h-[640px] overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-0">
        <img src={h?.hero_image || heroFactory} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-hero-overlay" />
      </motion.div>

      <motion.div style={{ opacity }} className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-6 lg:px-10">
        <div
          className="mb-6 inline-flex w-fit items-center gap-2 rounded-sm border border-white/15 bg-white/5 px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-silver/90"
          style={styleOf(fs, "hero_eyebrow")}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-mid-blue" />
          {h?.hero_eyebrow || "精密线圈制造"}
        </div>

        <h1 className="max-w-4xl font-display text-5xl font-bold leading-[1.05] text-white md:text-7xl lg:text-8xl">
          <span style={styleOf(fs, "hero_title_line1")}>{h?.hero_title_line1 || "精密制造"}</span>
          <br />
          <span style={styleOf(fs, "hero_title_line2")}>{h?.hero_title_line2 || "为规模而生"}</span>
        </h1>

        <p
          className="mt-8 max-w-2xl text-base leading-relaxed text-silver/80 md:text-lg"
          style={styleOf(fs, "hero_intro")}
        >
          {h?.hero_intro || ""}
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href={exploreLink}
            className="group inline-flex items-center gap-2 bg-mid-blue px-7 py-4 text-sm font-medium text-white hover:bg-mid-blue/90"
            style={styleOf(fs, "btn_explore")}
          >
            {h?.btn_explore || "了解产品"}
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href={contactLink}
            className="inline-flex items-center gap-2 border border-white/25 bg-white/5 px-7 py-4 text-sm font-medium text-white"
            style={styleOf(fs, "btn_contact")}
          >
            {h?.btn_contact || "联系我们"}
          </a>
        </div>
      </motion.div>
    </section>
  );
}

function Stats({ h, fs }: { h: HomeData; fs: FieldStyles }) {
  const stats = [
    { value: h?.stat1_value ?? 1800, suffix: h?.stat1_suffix ?? "㎡", label: h?.stat1_label ?? "厂房面积" },
    { value: h?.stat2_value ?? 90, suffix: h?.stat2_suffix ?? "+", label: h?.stat2_label ?? "团队规模" },
    { value: h?.stat3_value ?? 80, suffix: h?.stat3_suffix ?? "+", label: h?.stat3_label ?? "设备数量" },
    { value: h?.stat4_value ?? 2000, suffix: h?.stat4_suffix ?? "万/月", label: h?.stat4_label ?? "月产能" },
  ];

  const titleLines = (h?.stats_title || "规模化的\n制造实力").split("\n");

  return (
    <section className="bg-navy-deep py-24 text-white lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="mb-16 max-w-2xl">
          <div className="text-xs uppercase tracking-[0.3em] text-mid-blue">{h?.stats_eyebrow || "数据见证"}</div>
          <h2 className="mt-4 font-display text-4xl font-bold leading-tight md:text-5xl" style={styleOf(fs, "stats_title")}>
            {titleLines.map((l, i) => (
              <span key={i}>
                {l}
                {i < titleLines.length - 1 && <br />}
              </span>
            ))}
          </h2>
        </Reveal>

        <div className="grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <div key={i} className="flex h-full flex-col gap-4 bg-navy-deep p-8 lg:p-10">
              <div className="font-display text-5xl font-bold text-white md:text-6xl">
                <Counter to={s.value} suffix={s.suffix} />
              </div>
              <div className="h-px w-12 bg-mid-blue" />
              <div className="text-sm text-silver/70">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Capabilities({
  h,
  capabilities,
  fs,
}: {
  h: HomeData;
  capabilities: { id: string; title: string; description: string; icon: string }[];
  fs: FieldStyles;
}) {
  return (
    <section className="bg-background py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="mb-16">
          <div className="text-xs uppercase tracking-[0.3em] text-mid-blue">{h?.capabilities_eyebrow || "核心能力"}</div>
          <h2
            className="mt-4 font-display text-4xl font-bold leading-tight text-navy-deep md:text-5xl"
            style={styleOf(fs, "capabilities_title")}
          >
            {h?.capabilities_title || "我们的能力"}
          </h2>
          <p className="mt-3 max-w-md text-base text-muted-foreground" style={styleOf(fs, "capabilities_desc")}>
            {h?.capabilities_desc || ""}
          </p>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {capabilities.map((c) => {
            const Icon = ICONS[c.icon] || Cpu;
            return (
              <div key={c.id} className="border border-border bg-white p-8">
                <Icon size={32} className="text-mid-blue" strokeWidth={1.5} />
                <h3 className="mt-6 font-display text-xl font-bold text-navy-deep">{c.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{c.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Clients({ h, brands, fs }: { h: HomeData; brands: string[]; fs: FieldStyles }) {
  return (
    <section className="bg-silver/40 py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <div className="text-center">
            <div className="text-xs uppercase tracking-[0.3em] text-mid-blue">{h?.clients_eyebrow || "合作伙伴"}</div>
            <h2
              className="mt-3 font-display text-2xl font-bold text-navy-deep md:text-3xl"
              style={styleOf(fs, "clients_title")}
            >
              {h?.clients_title || "服务客户"}
            </h2>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-px bg-border md:grid-cols-3 lg:grid-cols-6">
          {brands.map((b, i) => (
            <div key={`${b}-${i}`} className="flex h-24 items-center justify-center bg-silver/40 font-display text-lg font-bold tracking-widest text-navy/60">
              {b}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Advantage({ h, fs }: { h: HomeData; fs: FieldStyles }) {
  const items = [
    {
      key: "adv1",
      img: h?.adv1_image || workshopImg,
      tag: h?.adv1_tag || "产线",
      title: h?.adv1_title || "自动化产线",
      desc: h?.adv1_desc || "",
    },
    {
      key: "adv2",
      img: h?.adv2_image || qualityImg,
      tag: h?.adv2_tag || "品质",
      title: h?.adv2_title || "品质管控",
      desc: h?.adv2_desc || "",
    },
  ];

  return (
    <section className="bg-background py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="mb-20 max-w-3xl">
          <div className="text-xs uppercase tracking-[0.3em] text-mid-blue">{h?.advantage_eyebrow || "我们的优势"}</div>
          <h2
            className="mt-4 font-display text-4xl font-bold leading-tight text-navy-deep md:text-5xl"
            style={styleOf(fs, "advantage_title")}
          >
            {h?.advantage_title || "核心优势"}
          </h2>
        </Reveal>

        <div className="space-y-24 lg:space-y-32">
          {items.map((item, idx) => (
            <div key={item.key} className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${idx % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}>
              <div className="relative overflow-hidden">
                <img src={item.img} alt={item.title} loading="lazy" className="aspect-[4/3] w-full object-cover" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.25em] text-mid-blue">{item.tag}</div>
                <h3
                  className="mt-4 font-display text-3xl font-bold text-navy-deep md:text-4xl"
                  style={styleOf(fs, `${item.key}_title`)}
                >
                  {item.title}
                </h3>
                <p className="mt-6 text-base text-muted-foreground" style={styleOf(fs, `${item.key}_desc`)}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <Reveal className="mt-24 grid grid-cols-2 gap-6 md:grid-cols-3">
          <ProductMini img={coilImg} title="精密线圈" />
          <ProductMini img={motorImg} title="直线电机" />
          <div className="flex flex-col items-start justify-end bg-navy-deep p-8 text-white">
            <div className="text-xs uppercase tracking-[0.3em] text-mid-blue">产品</div>
            <h4 className="mt-2 font-display text-2xl font-bold">查看全部产品</h4>
            <Link to="/products" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-silver hover:text-white">
              前往产品页 <ArrowRight size={14} />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ProductMini({ img, title }: { img: string; title: string }) {
  return (
    <Link to="/products" className="group relative block overflow-hidden">
      <img src={img} alt={title} loading="lazy" className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/90 via-navy-deep/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6">
        <h4 className="font-display text-xl font-bold text-white">{title}</h4>
      </div>
    </Link>
  );
}

function CTA({ h, fs }: { h: HomeData; fs: FieldStyles }) {
  const ctaLink = h?.cta_button_link || "/contact";
  const titleLines = (h?.cta_title || "让我们助力您的下一个项目").split("\n");

  return (
    <section className="relative overflow-hidden bg-navy-gradient py-24 text-white lg:py-32">
      <div className="relative mx-auto max-w-5xl px-6 text-center lg:px-10">
        <Reveal>
          <div className="text-xs uppercase tracking-[0.3em] text-mid-blue">{h?.cta_eyebrow || "携手共建"}</div>
          <h2 className="mt-6 font-display text-4xl font-bold leading-tight md:text-6xl" style={styleOf(fs, "cta_title")}>
            {titleLines.map((line, idx) => (
              <span key={idx}>
                {line}
                {idx < titleLines.length - 1 && <br />}
              </span>
            ))}
          </h2>
          <p className="mx-auto mt-8 max-w-2xl text-base text-silver/80" style={styleOf(fs, "cta_desc")}>
            {h?.cta_desc || ""}
          </p>
          <a
            href={ctaLink}
            className="mt-10 inline-flex items-center gap-2 bg-white px-8 py-4 text-sm font-medium text-navy-deep hover:bg-silver"
            style={styleOf(fs, "cta_button")}
          >
            {h?.cta_button || "联系我们"} <ArrowRight size={16} />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
