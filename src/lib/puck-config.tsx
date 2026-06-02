import type { Config, Data } from "@measured/puck";

// ============ Section render components ============

type HeroProps = {
  eyebrow: string;
  titleLine1: string;
  titleLine2: string;
  intro: string;
  image: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  headingFont: string;
  bodyFont: string;
};

function HeroRender(p: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-navy-deep text-white" style={{ minHeight: 560, fontFamily: p.bodyFont || undefined }}>
      {p.image && (
        <div
          className="absolute inset-0 opacity-40"
          style={{ backgroundImage: `url(${p.image})`, backgroundSize: "cover", backgroundPosition: "center" }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-navy-deep via-navy-deep/80 to-navy-deep/30" />
      <div className="relative mx-auto flex max-w-7xl flex-col px-6 py-24 lg:py-32">
        <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-sm border border-white/15 bg-white/5 px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-silver/90">
          <span className="h-1.5 w-1.5 rounded-full bg-mid-blue" />
          {p.eyebrow}
        </div>
        <h1 className="text-5xl font-bold leading-tight md:text-6xl" style={{ fontFamily: p.headingFont || undefined }}>
          {p.titleLine1}
          <br />
          <span className="text-mid-blue">{p.titleLine2}</span>
        </h1>
        <p className="mt-8 max-w-2xl text-base leading-relaxed text-silver/80 md:text-lg">{p.intro}</p>
        <div className="mt-10 flex flex-wrap gap-4">
          {p.primaryButtonText && (
            <a href={p.primaryButtonLink || "#"} className="inline-flex items-center gap-2 bg-mid-blue px-7 py-4 text-sm font-medium text-white hover:bg-mid-blue/90">
              {p.primaryButtonText}
            </a>
          )}
          {p.secondaryButtonText && (
            <a href={p.secondaryButtonLink || "#"} className="inline-flex items-center gap-2 border border-white/30 px-7 py-4 text-sm font-medium text-white hover:bg-white/10">
              {p.secondaryButtonText}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

type StatsProps = {
  title: string;
  stat1Value: string; stat1Label: string;
  stat2Value: string; stat2Label: string;
  stat3Value: string; stat3Label: string;
  stat4Value: string; stat4Label: string;
  headingFont: string; bodyFont: string;
};

function StatsRender(p: StatsProps) {
  const stats = [
    { v: p.stat1Value, l: p.stat1Label },
    { v: p.stat2Value, l: p.stat2Label },
    { v: p.stat3Value, l: p.stat3Label },
    { v: p.stat4Value, l: p.stat4Label },
  ];
  return (
    <section className="bg-navy-deep py-24 text-white lg:py-32" style={{ fontFamily: p.bodyFont || undefined }}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 text-center">
          <div className="text-xs uppercase tracking-[0.3em] text-mid-blue">数据统计</div>
          <h2 className="mt-4 text-3xl font-bold md:text-4xl" style={{ fontFamily: p.headingFont || undefined }}>{p.title}</h2>
        </div>
        <div className="grid grid-cols-2 gap-px bg-white/10 lg:grid-cols-4">
          {stats.map((s, i) => (
            <div key={i} className="flex flex-col gap-4 bg-navy-deep p-8 lg:p-10">
              <div className="text-4xl font-bold text-white md:text-5xl" style={{ fontFamily: p.headingFont || undefined }}>{s.v}</div>
              <div className="h-px w-12 bg-mid-blue" />
              <div className="text-sm text-silver/70">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

type CapProps = { eyebrow: string; title: string; description: string; headingFont: string; bodyFont: string };
function CapabilitiesRender(p: CapProps) {
  const cards = ["精密加工", "表面处理", "智能装配", "质量检测"];
  return (
    <section className="bg-white py-24 lg:py-32" style={{ fontFamily: p.bodyFont || undefined }}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-xs uppercase tracking-[0.3em] text-mid-blue">{p.eyebrow}</div>
        <h2 className="mt-4 text-4xl font-bold leading-tight text-navy-deep md:text-5xl" style={{ fontFamily: p.headingFont || undefined }}>{p.title}</h2>
        <p className="mt-4 max-w-3xl text-muted-foreground">{p.description}</p>
        <div className="mt-12 grid grid-cols-1 gap-px bg-silver/40 md:grid-cols-2 lg:grid-cols-4">
          {cards.map((c, i) => (
            <div key={i} className="bg-white p-8">
              <div className="h-8 w-8 bg-mid-blue" />
              <h3 className="mt-6 text-xl font-bold text-navy-deep" style={{ fontFamily: p.headingFont || undefined }}>{c}</h3>
              <p className="mt-3 text-sm text-muted-foreground">面向消费电子的高精度制造方案。</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

type ClientsProps = { eyebrow: string; title: string; brands: string; headingFont: string; bodyFont: string };
function ClientsRender(p: ClientsProps) {
  const list = (p.brands || "").split(",").map((s) => s.trim()).filter(Boolean);
  return (
    <section className="bg-silver/40 py-20" style={{ fontFamily: p.bodyFont || undefined }}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10">
          <div className="text-xs uppercase tracking-[0.3em] text-mid-blue">{p.eyebrow}</div>
          <h2 className="mt-3 text-2xl font-bold text-navy-deep md:text-3xl" style={{ fontFamily: p.headingFont || undefined }}>{p.title}</h2>
        </div>
        <div className="grid grid-cols-2 gap-px bg-silver/60 md:grid-cols-3 lg:grid-cols-6">
          {list.map((b, i) => (
            <div key={i} className="flex h-24 items-center justify-center bg-silver/40 text-lg font-bold tracking-widest text-navy/60" style={{ fontFamily: p.headingFont || undefined }}>
              {b}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

type AdvProps = {
  eyebrow: string; title: string;
  card1Title: string; card1Desc: string; card1Image: string;
  card2Title: string; card2Desc: string; card2Image: string;
  headingFont: string; bodyFont: string;
};
function AdvantageRender(p: AdvProps) {
  const cards = [
    { t: p.card1Title, d: p.card1Desc, i: p.card1Image },
    { t: p.card2Title, d: p.card2Desc, i: p.card2Image },
  ];
  return (
    <section className="bg-white py-24 lg:py-32" style={{ fontFamily: p.bodyFont || undefined }}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-xs uppercase tracking-[0.3em] text-mid-blue">{p.eyebrow}</div>
        <h2 className="mt-4 text-4xl font-bold leading-tight text-navy-deep md:text-5xl" style={{ fontFamily: p.headingFont || undefined }}>{p.title}</h2>
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {cards.map((c, i) => (
            <div key={i} className="overflow-hidden bg-silver/30">
              {c.i && <div className="h-64 bg-cover bg-center" style={{ backgroundImage: `url(${c.i})` }} />}
              <div className="p-8">
                <h3 className="text-2xl font-bold text-navy-deep" style={{ fontFamily: p.headingFont || undefined }}>{c.t}</h3>
                <p className="mt-3 text-muted-foreground">{c.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

type CtaProps = { eyebrow: string; title: string; description: string; buttonText: string; buttonLink: string; headingFont: string; bodyFont: string };
function CtaRender(p: CtaProps) {
  return (
    <section className="relative overflow-hidden bg-navy-deep py-24 text-white lg:py-32" style={{ fontFamily: p.bodyFont || undefined }}>
      <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/90 via-navy-deep/20 to-transparent" />
      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <div className="text-xs uppercase tracking-[0.3em] text-mid-blue">{p.eyebrow}</div>
        <h2 className="mt-4 text-4xl font-bold leading-tight md:text-5xl" style={{ fontFamily: p.headingFont || undefined }}>{p.title}</h2>
        <p className="mx-auto mt-8 max-w-2xl text-base text-silver/80">{p.description}</p>
        {p.buttonText && (
          <a href={p.buttonLink || "#"} className="mt-10 inline-flex items-center gap-2 bg-white px-8 py-4 text-sm font-medium text-navy-deep hover:bg-silver">
            {p.buttonText}
          </a>
        )}
      </div>
    </section>
  );
}

// ============ Puck config (Chinese labels) ============

const fontFields = {
  headingFont: { type: "text" as const, label: "标题字体 (font-family)" },
  bodyFont: { type: "text" as const, label: "正文字体 (font-family)" },
};

export const puckConfig: Config = {
  components: {
    HeroSection: {
      label: "首屏区块",
      fields: {
        eyebrow: { type: "text", label: "小标" },
        titleLine1: { type: "text", label: "主标题第一行" },
        titleLine2: { type: "text", label: "主标题第二行" },
        intro: { type: "textarea", label: "简介" },
        image: { type: "text", label: "背景图片 URL" },
        primaryButtonText: { type: "text", label: "主按钮文字" },
        primaryButtonLink: { type: "text", label: "主按钮链接" },
        secondaryButtonText: { type: "text", label: "次按钮文字" },
        secondaryButtonLink: { type: "text", label: "次按钮链接" },
        ...fontFields,
      },
      defaultProps: {
        eyebrow: "JINGHONG TECHNOLOGY",
        titleLine1: "高精度制造",
        titleLine2: "驱动智能未来",
        intro: "景鸿科技专注于消费电子精密制造，为全球品牌客户提供从研发到量产的一体化解决方案。",
        image: "",
        primaryButtonText: "了解产品",
        primaryButtonLink: "/products",
        secondaryButtonText: "联系我们",
        secondaryButtonLink: "/contact",
        headingFont: "",
        bodyFont: "",
      },
      render: HeroRender as any,
    },
    StatsSection: {
      label: "数据区块",
      fields: {
        title: { type: "text", label: "标题" },
        stat1Value: { type: "text", label: "数据 1 数值" },
        stat1Label: { type: "text", label: "数据 1 标签" },
        stat2Value: { type: "text", label: "数据 2 数值" },
        stat2Label: { type: "text", label: "数据 2 标签" },
        stat3Value: { type: "text", label: "数据 3 数值" },
        stat3Label: { type: "text", label: "数据 3 标签" },
        stat4Value: { type: "text", label: "数据 4 数值" },
        stat4Label: { type: "text", label: "数据 4 标签" },
        ...fontFields,
      },
      defaultProps: {
        title: "用数据说话",
        stat1Value: "120,000m²", stat1Label: "厂房面积",
        stat2Value: "1,500+", stat2Label: "员工团队",
        stat3Value: "800+", stat3Label: "精密设备",
        stat4Value: "50M+", stat4Label: "年产能",
        headingFont: "", bodyFont: "",
      },
      render: StatsRender as any,
    },
    CapabilitiesSection: {
      label: "能力区块",
      fields: {
        eyebrow: { type: "text", label: "小标" },
        title: { type: "text", label: "标题" },
        description: { type: "textarea", label: "描述" },
        ...fontFields,
      },
      defaultProps: {
        eyebrow: "Core Capabilities",
        title: "四大核心制造能力",
        description: "覆盖从原型到量产的全制造链路。",
        headingFont: "", bodyFont: "",
      },
      render: CapabilitiesRender as any,
    },
    ClientsSection: {
      label: "客户区块",
      fields: {
        eyebrow: { type: "text", label: "小标" },
        title: { type: "text", label: "标题" },
        brands: { type: "textarea", label: "品牌列表（逗号分隔）" },
        ...fontFields,
      },
      defaultProps: {
        eyebrow: "Trusted Partners",
        title: "合作品牌",
        brands: "SAMSUNG,HUAWEI,XIAOMI,TRANSSION,OPPO,VIVO",
        headingFont: "", bodyFont: "",
      },
      render: ClientsRender as any,
    },
    AdvantageSection: {
      label: "优势区块",
      fields: {
        eyebrow: { type: "text", label: "小标" },
        title: { type: "text", label: "标题" },
        card1Title: { type: "text", label: "卡片 1 标题" },
        card1Desc: { type: "textarea", label: "卡片 1 描述" },
        card1Image: { type: "text", label: "卡片 1 图片 URL" },
        card2Title: { type: "text", label: "卡片 2 标题" },
        card2Desc: { type: "textarea", label: "卡片 2 描述" },
        card2Image: { type: "text", label: "卡片 2 图片 URL" },
        ...fontFields,
      },
      defaultProps: {
        eyebrow: "Our Advantage",
        title: "为什么选择景鸿",
        card1Title: "智能化车间",
        card1Desc: "全自动产线 + 数字化品控。",
        card1Image: "",
        card2Title: "全球客户验证",
        card2Desc: "服务全球头部消费电子品牌十余年。",
        card2Image: "",
        headingFont: "", bodyFont: "",
      },
      render: AdvantageRender as any,
    },
    CtaSection: {
      label: "行动召唤区块",
      fields: {
        eyebrow: { type: "text", label: "小标" },
        title: { type: "text", label: "标题" },
        description: { type: "textarea", label: "描述" },
        buttonText: { type: "text", label: "按钮文字" },
        buttonLink: { type: "text", label: "按钮链接" },
        ...fontFields,
      },
      defaultProps: {
        eyebrow: "Let's Build Together",
        title: "携手共创智能制造未来",
        description: "无论您正在研发新产品，还是寻找稳定的量产伙伴，我们都欢迎与您深入交流。",
        buttonText: "联系我们",
        buttonLink: "/contact",
        headingFont: "", bodyFont: "",
      },
      render: CtaRender as any,
    },
  },
};

export const defaultPuckData: Data = {
  content: [
    { type: "HeroSection", props: { id: "hero-1", ...(puckConfig.components.HeroSection.defaultProps as object) } },
    { type: "StatsSection", props: { id: "stats-1", ...(puckConfig.components.StatsSection.defaultProps as object) } },
    { type: "CapabilitiesSection", props: { id: "caps-1", ...(puckConfig.components.CapabilitiesSection.defaultProps as object) } },
    { type: "ClientsSection", props: { id: "clients-1", ...(puckConfig.components.ClientsSection.defaultProps as object) } },
    { type: "AdvantageSection", props: { id: "adv-1", ...(puckConfig.components.AdvantageSection.defaultProps as object) } },
    { type: "CtaSection", props: { id: "cta-1", ...(puckConfig.components.CtaSection.defaultProps as object) } },
  ],
  root: { props: {} },
} as Data;

export function isValidPuckData(d: unknown): d is Data {
  if (!d || typeof d !== "object") return false;
  const obj = d as Record<string, unknown>;
  return Array.isArray(obj.content) && obj.content.length > 0;
}
