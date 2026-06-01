import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Cpu, Factory, ShieldCheck, Zap, type LucideIcon } from "lucide-react";
import { Fragment, useMemo, useRef } from "react";
import { Counter } from "@/components/site/Counter";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { Reveal } from "@/components/site/Reveal";
import heroFactory from "@/assets/hero-factory.jpg";
import workshopImg from "@/assets/workshop.jpg";
import qualityImg from "@/assets/quality.jpg";
import coilImg from "@/assets/product-coil.jpg";
import motorImg from "@/assets/product-motor.jpg";
import { getHomeContent } from "@/lib/site.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "景鸿科技有限公司" },
      { name: "description", content: "景鸿科技首页" },
      { property: "og:image", content: heroFactory },
    ],
  }),
  component: IndexPage,
});

type HomeData = Awaited<ReturnType<typeof getHomeContent>>["home"] | undefined;
type SectionId = "hero" | "stats" | "capabilities" | "clients" | "advantage" | "cta";

const ICONS: Record<string, LucideIcon> = { Cpu, Zap, Factory, ShieldCheck };
const DEFAULT_SECTION_ORDER: SectionId[] = ["hero", "stats", "capabilities", "clients", "advantage", "cta"];
const DEFAULT_BRANDS = ["SAMSUNG", "HUAWEI", "XIAOMI", "TRANSSION", "OPPO", "VIVO"];

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

function IndexPage() {
  const { data } = useQuery({
    queryKey: ["home-content"],
    queryFn: () => getHomeContent(),
    staleTime: 60_000,
  });

  const home = data?.home;
  const capabilities = data?.capabilities ?? [];
  const brands = (home?.brands as string[] | undefined) ?? DEFAULT_BRANDS;

  const sectionOrder = useMemo(
    () => parseSectionOrder((home as Record<string, unknown> | undefined)?.section_order),
    [home],
  );
  const sectionVisibility = useMemo(
    () => parseSectionVisibility((home as Record<string, unknown> | undefined)?.section_visibility),
    [home],
  );

  const sections: Record<SectionId, JSX.Element> = {
    hero: <Hero h={home} />,
    stats: <Stats h={home} />,
    capabilities: <Capabilities h={home} capabilities={capabilities} />,
    clients: <Clients h={home} brands={brands} />,
    advantage: <Advantage h={home} />,
    cta: <CTA h={home} />,
  };

  return (
    <div className="min-h-screen bg-background">
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

function Hero({ h }: { h: HomeData }) {
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
        <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-sm border border-white/15 bg-white/5 px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-silver/90">
          <span className="h-1.5 w-1.5 rounded-full bg-mid-blue" />
          {h?.hero_eyebrow || "Precision Coil Manufacturing"}
        </div>

        <h1 className="max-w-4xl font-display text-5xl font-bold leading-[1.05] text-white md:text-7xl lg:text-8xl">
          {h?.hero_title_line1 || "Precision Manufacturing"}
          <br />
          {h?.hero_title_line2 || "Built for Scale"}
        </h1>

        <p className="mt-8 max-w-2xl text-base leading-relaxed text-silver/80 md:text-lg">{h?.hero_intro || ""}</p>

        <div className="mt-10 flex flex-wrap gap-4">
          <a href={exploreLink} className="group inline-flex items-center gap-2 bg-mid-blue px-7 py-4 text-sm font-medium text-white hover:bg-mid-blue/90">
            {h?.btn_explore || "Explore"}
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </a>
          <a href={contactLink} className="inline-flex items-center gap-2 border border-white/25 bg-white/5 px-7 py-4 text-sm font-medium text-white">
            {h?.btn_contact || "Contact"}
          </a>
        </div>
      </motion.div>
    </section>
  );
}

function Stats({ h }: { h: HomeData }) {
  const stats = [
    { value: h?.stat1_value ?? 1800, suffix: h?.stat1_suffix ?? "㎡", label: h?.stat1_label ?? "Workshop" },
    { value: h?.stat2_value ?? 90, suffix: h?.stat2_suffix ?? "+", label: h?.stat2_label ?? "Team" },
    { value: h?.stat3_value ?? 80, suffix: h?.stat3_suffix ?? "+", label: h?.stat3_label ?? "Machines" },
    { value: h?.stat4_value ?? 2000, suffix: h?.stat4_suffix ?? "万/月", label: h?.stat4_label ?? "Capacity" },
  ];

  const titleLines = (h?.stats_title || "Manufacturing strength\nat scale").split("\n");

  return (
    <section className="bg-navy-deep py-24 text-white lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="mb-16 max-w-2xl">
          <div className="text-xs uppercase tracking-[0.3em] text-mid-blue">{h?.stats_eyebrow || "By the numbers"}</div>
          <h2 className="mt-4 font-display text-4xl font-bold leading-tight md:text-5xl">
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
}: {
  h: HomeData;
  capabilities: { id: string; title: string; description: string; icon: string }[];
}) {
  return (
    <section className="bg-background py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="mb-16">
          <div className="text-xs uppercase tracking-[0.3em] text-mid-blue">{h?.capabilities_eyebrow || "Core Capabilities"}</div>
          <h2 className="mt-4 font-display text-4xl font-bold leading-tight text-navy-deep md:text-5xl">
            {h?.capabilities_title || "Capabilities"}
          </h2>
          <p className="mt-3 max-w-md text-base text-muted-foreground">{h?.capabilities_desc || ""}</p>
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

function Clients({ h, brands }: { h: HomeData; brands: string[] }) {
  return (
    <section className="bg-silver/40 py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <div className="text-center">
            <div className="text-xs uppercase tracking-[0.3em] text-mid-blue">{h?.clients_eyebrow || "Trusted Partners"}</div>
            <h2 className="mt-3 font-display text-2xl font-bold text-navy-deep md:text-3xl">{h?.clients_title || "Clients"}</h2>
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

function Advantage({ h }: { h: HomeData }) {
  const items = [
    {
      img: h?.adv1_image || workshopImg,
      tag: h?.adv1_tag || "Line",
      title: h?.adv1_title || "Automated line",
      desc: h?.adv1_desc || "",
    },
    {
      img: h?.adv2_image || qualityImg,
      tag: h?.adv2_tag || "Quality",
      title: h?.adv2_title || "Quality control",
      desc: h?.adv2_desc || "",
    },
  ];

  return (
    <section className="bg-background py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="mb-20 max-w-3xl">
          <div className="text-xs uppercase tracking-[0.3em] text-mid-blue">{h?.advantage_eyebrow || "Our Advantage"}</div>
          <h2 className="mt-4 font-display text-4xl font-bold leading-tight text-navy-deep md:text-5xl">{h?.advantage_title || "Advantage"}</h2>
        </Reveal>

        <div className="space-y-24 lg:space-y-32">
          {items.map((item, idx) => (
            <div key={idx} className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${idx % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}>
              <div className="relative overflow-hidden">
                <img src={item.img} alt={item.title} loading="lazy" className="aspect-[4/3] w-full object-cover" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.25em] text-mid-blue">{item.tag}</div>
                <h3 className="mt-4 font-display text-3xl font-bold text-navy-deep md:text-4xl">{item.title}</h3>
                <p className="mt-6 text-base text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <Reveal className="mt-24 grid grid-cols-2 gap-6 md:grid-cols-3">
          <ProductMini img={coilImg} title="Precision Coil" />
          <ProductMini img={motorImg} title="Linear Motor" />
          <div className="flex flex-col items-start justify-end bg-navy-deep p-8 text-white">
            <div className="text-xs uppercase tracking-[0.3em] text-mid-blue">Products</div>
            <h4 className="mt-2 font-display text-2xl font-bold">View all products</h4>
            <Link to="/products" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-silver hover:text-white">
              Go to products <ArrowRight size={14} />
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

function CTA({ h }: { h: HomeData }) {
  const ctaLink = h?.cta_button_link || "/contact";
  const titleLines = (h?.cta_title || "Let us support your next project").split("\n");

  return (
    <section className="relative overflow-hidden bg-navy-gradient py-24 text-white lg:py-32">
      <div className="relative mx-auto max-w-5xl px-6 text-center lg:px-10">
        <Reveal>
          <div className="text-xs uppercase tracking-[0.3em] text-mid-blue">{h?.cta_eyebrow || "Let's Build Together"}</div>
          <h2 className="mt-6 font-display text-4xl font-bold leading-tight md:text-6xl">
            {titleLines.map((line, idx) => (
              <span key={idx}>
                {line}
                {idx < titleLines.length - 1 && <br />}
              </span>
            ))}
          </h2>
          <p className="mx-auto mt-8 max-w-2xl text-base text-silver/80">{h?.cta_desc || ""}</p>
          <a href={ctaLink} className="mt-10 inline-flex items-center gap-2 bg-white px-8 py-4 text-sm font-medium text-navy-deep hover:bg-silver">
            {h?.cta_button || "Contact us"} <ArrowRight size={16} />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
