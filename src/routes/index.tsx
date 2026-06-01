import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Cpu, Factory, ShieldCheck, Zap, type LucideIcon } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Counter } from "@/components/site/Counter";
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
      { title: "东莞市景鸿科技有限公司 — 精密线圈 · 微型直线电机制造" },
      { name: "description", content: "东莞市景鸿科技专注精密线圈与微型直线电机制造。" },
      { property: "og:title", content: "东莞市景鸿科技有限公司" },
      { property: "og:description", content: "精密线圈与微型直线电机制造服务商。" },
      { property: "og:image", content: heroFactory },
    ],
  }),
  component: Index,
});

const ICONS: Record<string, LucideIcon> = { Cpu, Zap, Factory, ShieldCheck };

function Index() {
  const { data } = useQuery({
    queryKey: ["home-content"],
    queryFn: () => getHomeContent(),
    staleTime: 60_000,
  });
  const h = data?.home;
  const capabilities = data?.capabilities ?? [];
  const brands = (h?.brands as string[] | undefined) ?? [
    "SAMSUNG", "HUAWEI", "XIAOMI", "TRANSSION", "OPPO", "VIVO",
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero h={h} />
        <Stats h={h} />
        <Capabilities h={h} capabilities={capabilities} />
        <Clients h={h} brands={brands} />
        <Advantage h={h} />
        <CTA h={h} />
      </main>
      <Footer />
    </div>
  );
}

type H = Awaited<ReturnType<typeof getHomeContent>>["home"] | undefined;

function splitItalic(text: string, italic: string) {
  if (!italic || !text.includes(italic)) return [text, "", ""] as const;
  const i = text.indexOf(italic);
  return [text.slice(0, i), italic, text.slice(i + italic.length)] as const;
}

function Hero({ h }: { h: H }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const heroImg = h?.hero_image || heroFactory;
  const line1 = h?.hero_title_line1 || "精密制造";
  const line2 = h?.hero_title_line2 || "智造未来";
  const italic = h?.hero_title_italic || "制造";
  const [pre, mid, post] = splitItalic(line1, italic);

  return (
    <section ref={ref} className="relative h-screen min-h-[640px] overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-0">
        <img src={heroImg} alt="" className="h-full w-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-hero-overlay" />
      </motion.div>

      <motion.div style={{ opacity }} className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-6 lg:px-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6 inline-flex w-fit items-center gap-2 rounded-sm border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.25em] text-silver/90 backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-mid-blue" />
          {h?.hero_eyebrow || "Precision Coil Manufacturing"}
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.4 }}
          className="max-w-4xl font-display text-5xl font-bold leading-[1.05] text-white text-balance md:text-7xl lg:text-8xl">
          {mid ? (<>{pre}<span className="italic text-mid-blue">{mid}</span>{post}</>) : line1}
          <br />
          {line2}
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-8 max-w-2xl text-base leading-relaxed text-silver/80 md:text-lg">
          {h?.hero_intro}
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-10 flex flex-wrap gap-4">
          <Link to="/products" className="group inline-flex items-center gap-2 bg-mid-blue px-7 py-4 text-sm font-medium text-white transition-all hover:bg-mid-blue/90 hover:shadow-2xl hover:shadow-mid-blue/30">
            {h?.btn_explore || "探索产品"}
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <Link to="/contact" className="inline-flex items-center gap-2 border border-white/25 bg-white/5 px-7 py-4 text-sm font-medium text-white backdrop-blur transition-all hover:border-white/50 hover:bg-white/10">
            {h?.btn_contact || "联系我们"}
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}

function Stats({ h }: { h: H }) {
  const stats = [
    { value: h?.stat1_value ?? 1800, suffix: h?.stat1_suffix ?? "㎡", label: h?.stat1_label ?? "现代化车间" },
    { value: h?.stat2_value ?? 90, suffix: h?.stat2_suffix ?? "+", label: h?.stat2_label ?? "专业团队" },
    { value: h?.stat3_value ?? 80, suffix: h?.stat3_suffix ?? "+", label: h?.stat3_label ?? "台精密设备" },
    { value: h?.stat4_value ?? 2000, suffix: h?.stat4_suffix ?? "万/月", label: h?.stat4_label ?? "线圈产能" },
  ];
  const titleLines = (h?.stats_title || "十余年精耕细作\n积淀制造硬实力").split("\n");
  return (
    <section className="relative bg-navy-deep py-24 text-white lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="mb-16 max-w-2xl">
          <div className="text-xs font-medium uppercase tracking-[0.3em] text-mid-blue">{h?.stats_eyebrow || "By the numbers"}</div>
          <h2 className="mt-4 font-display text-4xl font-bold leading-tight md:text-5xl">
            {titleLines.map((l, i) => (<span key={i}>{l}{i < titleLines.length - 1 && <br />}</span>))}
          </h2>
        </Reveal>
        <div className="grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="group flex h-full flex-col gap-4 bg-navy-deep p-8 transition-colors hover:bg-navy lg:p-10">
                <div className="font-display text-5xl font-bold text-white md:text-6xl">
                  <Counter to={s.value} suffix={s.suffix} />
                </div>
                <div className="h-px w-12 bg-mid-blue transition-all group-hover:w-20" />
                <div className="text-sm text-silver/70">{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Capabilities({ h, capabilities }: { h: H; capabilities: { id: string; title: string; description: string; icon: string }[] }) {
  return (
    <section className="relative bg-background py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="mb-16 flex flex-col items-start gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="text-xs font-medium uppercase tracking-[0.3em] text-mid-blue">{h?.capabilities_eyebrow || "Core Capabilities"}</div>
            <h2 className="mt-4 font-display text-4xl font-bold leading-tight text-navy-deep md:text-5xl">{h?.capabilities_title || "四大核心制造能力"}</h2>
          </div>
          <p className="max-w-md text-base leading-relaxed text-muted-foreground">{h?.capabilities_desc}</p>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {capabilities.map((c, i) => {
            const Icon = ICONS[c.icon] || Cpu;
            return (
              <Reveal key={c.id} delay={i * 0.08}>
                <div className="group relative h-full overflow-hidden border border-border bg-white p-8 transition-all duration-500 hover:-translate-y-1 hover:border-mid-blue hover:shadow-2xl hover:shadow-mid-blue/10">
                  <div className="absolute right-0 top-0 h-24 w-24 bg-gradient-to-bl from-mid-blue/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <Icon size={32} className="text-mid-blue" strokeWidth={1.5} />
                  <h3 className="mt-6 font-display text-xl font-bold text-navy-deep">{c.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.description}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Clients({ h, brands }: { h: H; brands: string[] }) {
  return (
    <section className="relative overflow-hidden bg-silver/40 py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <div className="text-center">
            <div className="text-xs font-medium uppercase tracking-[0.3em] text-mid-blue">{h?.clients_eyebrow || "Trusted Partners"}</div>
            <h2 className="mt-3 font-display text-2xl font-bold text-navy-deep md:text-3xl">{h?.clients_title || "服务全球知名手机品牌"}</h2>
          </div>
        </Reveal>
        <div className="mt-12 grid grid-cols-2 gap-px bg-border md:grid-cols-3 lg:grid-cols-6">
          {brands.map((c, i) => (
            <Reveal key={c + i} delay={i * 0.05}>
              <div className="flex h-24 items-center justify-center bg-silver/40 font-display text-lg font-bold tracking-widest text-navy/60 transition-all hover:bg-white hover:text-navy-deep">
                {c}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Advantage({ h }: { h: H }) {
  const items = [
    { img: h?.adv1_image || workshopImg, tag: h?.adv1_tag || "智能产线", title: h?.adv1_title || "日特绕线机集群", desc: h?.adv1_desc || "" },
    { img: h?.adv2_image || qualityImg, tag: h?.adv2_tag || "品质把关", title: h?.adv2_title || "全流程品质检测", desc: h?.adv2_desc || "" },
  ];
  const titleLines = (h?.advantage_title || "精益生产 × 自动化技术\n深度融合").split("\n");

  return (
    <section className="relative bg-background py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="mb-20 max-w-3xl">
          <div className="text-xs font-medium uppercase tracking-[0.3em] text-mid-blue">{h?.advantage_eyebrow || "Our Advantage"}</div>
          <h2 className="mt-4 font-display text-4xl font-bold leading-tight text-navy-deep md:text-5xl">
            {titleLines[0]}
            {titleLines[1] && (<><br /><span className="italic text-mid-blue">{titleLines[1]}</span></>)}
          </h2>
        </Reveal>

        <div className="space-y-24 lg:space-y-32">
          {items.map((item, idx) => (
            <Reveal key={idx}>
              <div className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${idx % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}>
                <div className="relative overflow-hidden">
                  <img src={item.img} alt={item.title} loading="lazy" className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-105" />
                  <div className="absolute inset-0 ring-1 ring-inset ring-navy-deep/10" />
                </div>
                <div>
                  <div className="text-xs font-medium uppercase tracking-[0.25em] text-mid-blue">{item.tag}</div>
                  <h3 className="mt-4 font-display text-3xl font-bold leading-tight text-navy-deep md:text-4xl">{item.title}</h3>
                  <div className="mt-6 h-px w-16 bg-navy-deep" />
                  <p className="mt-6 text-base leading-relaxed text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-24 grid grid-cols-2 gap-6 md:grid-cols-3">
          <ProductMini img={coilImg} title="精密线圈" />
          <ProductMini img={motorImg} title="微型直线电机" />
          <div className="flex flex-col items-start justify-end bg-navy-deep p-8 text-white">
            <div className="text-xs uppercase tracking-[0.3em] text-mid-blue">Products</div>
            <h4 className="mt-2 font-display text-2xl font-bold">查看完整产品矩阵</h4>
            <Link to="/products" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-silver hover:text-white">
              进入产品中心 <ArrowRight size={14} />
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

function CTA({ h }: { h: H }) {
  const titleLines = (h?.cta_title || "为您的下一个项目\n提供精密制造方案").split("\n");
  return (
    <section className="relative overflow-hidden bg-navy-gradient py-24 text-white lg:py-32">
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: "radial-gradient(circle at 20% 30%, var(--mid-blue) 0%, transparent 50%), radial-gradient(circle at 80% 70%, var(--indigo-steel) 0%, transparent 50%)"
      }} />
      <div className="relative mx-auto max-w-5xl px-6 text-center lg:px-10">
        <Reveal>
          <div className="text-xs font-medium uppercase tracking-[0.3em] text-mid-blue">{h?.cta_eyebrow || "Let's Build Together"}</div>
          <h2 className="mt-6 font-display text-4xl font-bold leading-tight text-balance md:text-6xl">
            {titleLines.map((l, i) => (<span key={i}>{l}{i < titleLines.length - 1 && <br />}</span>))}
          </h2>
          <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-silver/80">{h?.cta_desc}</p>
          <Link to="/contact" className="mt-10 inline-flex items-center gap-2 bg-white px-8 py-4 text-sm font-medium text-navy-deep transition-all hover:bg-silver hover:shadow-2xl hover:shadow-white/20">
            {h?.cta_button || "联系商务团队"} <ArrowRight size={16} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
