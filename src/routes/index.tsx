import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Cpu, Factory, ShieldCheck, Zap } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Counter } from "@/components/site/Counter";
import { Reveal } from "@/components/site/Reveal";
import heroFactory from "@/assets/hero-factory.jpg";
import workshopImg from "@/assets/workshop.jpg";
import qualityImg from "@/assets/quality.jpg";
import coilImg from "@/assets/product-coil.jpg";
import motorImg from "@/assets/product-motor.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "东莞市景鸿科技有限公司 — 精密线圈 · 微型直线电机制造" },
      {
        name: "description",
        content:
          "东莞市景鸿科技专注精密线圈与微型直线电机制造，1800㎡车间、80+台精密设备、月产2000万个，服务三星、华为、小米、传音等知名品牌。",
      },
      { property: "og:title", content: "东莞市景鸿科技有限公司" },
      {
        property: "og:description",
        content: "精密线圈与微型直线电机制造服务商，月产能2000万个，服务全球知名手机品牌。",
      },
      { property: "og:image", content: heroFactory },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Stats />
        <Capabilities />
        <Clients />
        <Advantage />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative h-screen min-h-[640px] overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-0">
        <img
          src={heroFactory}
          alt="精密线圈制造车间"
          className="h-full w-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-hero-overlay" />
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-6 lg:px-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6 inline-flex w-fit items-center gap-2 rounded-sm border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.25em] text-silver/90 backdrop-blur"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-mid-blue" />
          Precision Coil Manufacturing
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="max-w-4xl font-display text-5xl font-bold leading-[1.05] text-white text-balance md:text-7xl lg:text-8xl"
        >
          精密<span className="italic text-mid-blue">制造</span>
          <br />
          智造未来
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-8 max-w-2xl text-base leading-relaxed text-silver/80 md:text-lg"
        >
          东莞市景鸿科技有限公司 — 专注精密线圈与微型直线电机制造，
          以日特绕线机为核心的智能化产线，月产能 2000 万个，
          服务三星、华为、小米、传音等全球知名手机品牌。
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-10 flex flex-wrap gap-4"
        >
          <Link
            to="/products"
            className="group inline-flex items-center gap-2 bg-mid-blue px-7 py-4 text-sm font-medium text-white transition-all hover:bg-mid-blue/90 hover:shadow-2xl hover:shadow-mid-blue/30"
          >
            探索产品
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 border border-white/25 bg-white/5 px-7 py-4 text-sm font-medium text-white backdrop-blur transition-all hover:border-white/50 hover:bg-white/10"
          >
            联系我们
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-xs uppercase tracking-[0.3em] text-silver/60"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
        >
          <span>向下滚动</span>
          <span className="h-8 w-px bg-silver/40" />
        </motion.div>
      </motion.div>
    </section>
  );
}

const stats = [
  { value: 1800, suffix: "㎡", label: "现代化车间" },
  { value: 90, suffix: "+", label: "专业团队" },
  { value: 80, suffix: "+", label: "台精密设备" },
  { value: 2000, suffix: "万/月", label: "线圈产能" },
];

function Stats() {
  return (
    <section className="relative bg-navy-deep py-24 text-white lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="mb-16 max-w-2xl">
          <div className="text-xs font-medium uppercase tracking-[0.3em] text-mid-blue">
            By the numbers
          </div>
          <h2 className="mt-4 font-display text-4xl font-bold leading-tight md:text-5xl">
            十余年精耕细作
            <br />
            积淀制造硬实力
          </h2>
        </Reveal>

        <div className="grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.1}>
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

const capabilities = [
  {
    icon: Cpu,
    title: "精密线圈制造",
    desc: "以日特绕线机为主的 50 余台绕线设备，覆盖各类精密线圈生产，满足消费电子高精度要求。",
  },
  {
    icon: Zap,
    title: "微型直线电机",
    desc: "微型直线电机精密制造，应用于摄像头对焦、震动反馈等手机核心模组。",
  },
  {
    icon: Factory,
    title: "自动化组装",
    desc: "焊锡、摆盘、自动组装一体化产线，融合精益生产理念，确保稳定交付。",
  },
  {
    icon: ShieldCheck,
    title: "品质检测",
    desc: "30 余台外观检查与品质检测设备，全流程把关，零缺陷出厂。",
  },
];

function Capabilities() {
  return (
    <section className="relative bg-background py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="mb-16 flex flex-col items-start gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="text-xs font-medium uppercase tracking-[0.3em] text-mid-blue">
              Core Capabilities
            </div>
            <h2 className="mt-4 font-display text-4xl font-bold leading-tight text-navy-deep md:text-5xl">
              四大核心制造能力
            </h2>
          </div>
          <p className="max-w-md text-base leading-relaxed text-muted-foreground">
            从绕线、焊锡到自动组装与品质检测，覆盖精密线圈制造全流程，
            为客户交付始终如一的高品质产品。
          </p>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {capabilities.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.08}>
              <div className="group relative h-full overflow-hidden border border-border bg-white p-8 transition-all duration-500 hover:-translate-y-1 hover:border-mid-blue hover:shadow-2xl hover:shadow-mid-blue/10">
                <div className="absolute right-0 top-0 h-24 w-24 bg-gradient-to-bl from-mid-blue/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <c.icon size={32} className="text-mid-blue" strokeWidth={1.5} />
                <h3 className="mt-6 font-display text-xl font-bold text-navy-deep">{c.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.desc}</p>
                <div className="mt-6 inline-flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-mid-blue opacity-0 transition-opacity group-hover:opacity-100">
                  Learn more <ArrowRight size={12} />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const clients = ["SAMSUNG", "HUAWEI", "XIAOMI", "TRANSSION", "OPPO", "VIVO"];

function Clients() {
  return (
    <section className="relative overflow-hidden bg-silver/40 py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <div className="text-center">
            <div className="text-xs font-medium uppercase tracking-[0.3em] text-mid-blue">
              Trusted Partners
            </div>
            <h2 className="mt-3 font-display text-2xl font-bold text-navy-deep md:text-3xl">
              服务全球知名手机品牌
            </h2>
          </div>
        </Reveal>
        <div className="mt-12 grid grid-cols-2 gap-px bg-border md:grid-cols-3 lg:grid-cols-6">
          {clients.map((c, i) => (
            <Reveal key={c} delay={i * 0.05}>
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

function Advantage() {
  const items = [
    {
      img: workshopImg,
      tag: "智能产线",
      title: "日特绕线机集群",
      desc: "以日本日特 (Nittoku) 高精度绕线机为核心，配套50余台绕线设备，构建国内领先的精密线圈智能产线，从微米级线径到复杂结构线圈全覆盖。",
    },
    {
      img: qualityImg,
      tag: "品质把关",
      title: "全流程品质检测",
      desc: "30余台焊锡、摆盘、外观检查、自动组装与品质检测设备，结合精益生产理念，杜绝瑕疵流出，让每一颗线圈都经得起严苛考验。",
    },
  ];

  return (
    <section className="relative bg-background py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="mb-20 max-w-3xl">
          <div className="text-xs font-medium uppercase tracking-[0.3em] text-mid-blue">
            Our Advantage
          </div>
          <h2 className="mt-4 font-display text-4xl font-bold leading-tight text-navy-deep md:text-5xl">
            精益生产 × 自动化技术
            <br />
            <span className="italic text-mid-blue">深度融合</span>
          </h2>
        </Reveal>

        <div className="space-y-24 lg:space-y-32">
          {items.map((item, idx) => (
            <Reveal key={item.title}>
              <div
                className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${
                  idx % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={item.img}
                    alt={item.title}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 ring-1 ring-inset ring-navy-deep/10" />
                </div>
                <div>
                  <div className="text-xs font-medium uppercase tracking-[0.25em] text-mid-blue">
                    {item.tag}
                  </div>
                  <h3 className="mt-4 font-display text-3xl font-bold leading-tight text-navy-deep md:text-4xl">
                    {item.title}
                  </h3>
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
            <Link
              to="/products"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-silver hover:text-white"
            >
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
      <img
        src={img}
        alt={title}
        loading="lazy"
        className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/90 via-navy-deep/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6">
        <h4 className="font-display text-xl font-bold text-white">{title}</h4>
      </div>
    </Link>
  );
}

function CTA() {
  return (
    <section className="relative overflow-hidden bg-navy-gradient py-24 text-white lg:py-32">
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: "radial-gradient(circle at 20% 30%, var(--mid-blue) 0%, transparent 50%), radial-gradient(circle at 80% 70%, var(--indigo-steel) 0%, transparent 50%)"
      }} />
      <div className="relative mx-auto max-w-5xl px-6 text-center lg:px-10">
        <Reveal>
          <div className="text-xs font-medium uppercase tracking-[0.3em] text-mid-blue">
            Let's Build Together
          </div>
          <h2 className="mt-6 font-display text-4xl font-bold leading-tight text-balance md:text-6xl">
            为您的下一个项目
            <br />
            提供<span className="italic">精密制造</span>方案
          </h2>
          <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-silver/80">
            无论是新品研发打样还是规模化量产，景鸿科技以专业的精密制造能力和稳定的产能保障，
            助力客户产品成功。
          </p>
          <Link
            to="/contact"
            className="mt-10 inline-flex items-center gap-2 bg-white px-8 py-4 text-sm font-medium text-navy-deep transition-all hover:bg-silver hover:shadow-2xl hover:shadow-white/20"
          >
            联系商务团队 <ArrowRight size={16} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
