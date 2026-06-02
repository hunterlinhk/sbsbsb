import { useEffect, useState } from "react";
import { Puck, Render, type Config, type Data } from "@measured/puck";
import "@measured/puck/puck.css";

const STORAGE_KEY = "puck-home-editor-prototype";

// ============ Section render components (styled to mimic real homepage) ============

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
};

function HeroRender(p: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-navy-deep text-white" style={{ minHeight: 560 }}>
      {p.image && (
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `url(${p.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-navy-deep via-navy-deep/80 to-navy-deep/30" />
      <div className="relative mx-auto flex max-w-7xl flex-col px-6 py-24 lg:py-32">
        <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-sm border border-white/15 bg-white/5 px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-silver/90">
          <span className="h-1.5 w-1.5 rounded-full bg-mid-blue" />
          {p.eyebrow}
        </div>
        <h1 className="font-display text-5xl font-bold leading-tight md:text-6xl">
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
};

function StatsRender(p: StatsProps) {
  const stats = [
    { v: p.stat1Value, l: p.stat1Label },
    { v: p.stat2Value, l: p.stat2Label },
    { v: p.stat3Value, l: p.stat3Label },
    { v: p.stat4Value, l: p.stat4Label },
  ];
  return (
    <section className="bg-navy-deep py-24 text-white lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 text-center">
          <div className="text-xs uppercase tracking-[0.3em] text-mid-blue">By the numbers</div>
          <h2 className="mt-4 font-display text-3xl font-bold md:text-4xl">{p.title}</h2>
        </div>
        <div className="grid grid-cols-2 gap-px bg-white/10 lg:grid-cols-4">
          {stats.map((s, i) => (
            <div key={i} className="flex flex-col gap-4 bg-navy-deep p-8 lg:p-10">
              <div className="font-display text-4xl font-bold text-white md:text-5xl">{s.v}</div>
              <div className="h-px w-12 bg-mid-blue" />
              <div className="text-sm text-silver/70">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

type CapProps = { eyebrow: string; title: string; description: string };
function CapabilitiesRender(p: CapProps) {
  const cards = ["精密加工", "表面处理", "智能装配", "质量检测"];
  return (
    <section className="bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-xs uppercase tracking-[0.3em] text-mid-blue">{p.eyebrow}</div>
        <h2 className="mt-4 font-display text-4xl font-bold leading-tight text-navy-deep md:text-5xl">{p.title}</h2>
        <p className="mt-4 max-w-3xl text-muted-foreground">{p.description}</p>
        <div className="mt-12 grid grid-cols-1 gap-px bg-silver/40 md:grid-cols-2 lg:grid-cols-4">
          {cards.map((c, i) => (
            <div key={i} className="bg-white p-8">
              <div className="h-8 w-8 bg-mid-blue" />
              <h3 className="mt-6 font-display text-xl font-bold text-navy-deep">{c}</h3>
              <p className="mt-3 text-sm text-muted-foreground">面向消费电子的高精度制造方案。</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

type ClientsProps = { eyebrow: string; title: string; brands: string };
function ClientsRender(p: ClientsProps) {
  const list = (p.brands || "").split(",").map((s) => s.trim()).filter(Boolean);
  return (
    <section className="bg-silver/40 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10">
          <div className="text-xs uppercase tracking-[0.3em] text-mid-blue">{p.eyebrow}</div>
          <h2 className="mt-3 font-display text-2xl font-bold text-navy-deep md:text-3xl">{p.title}</h2>
        </div>
        <div className="grid grid-cols-2 gap-px bg-silver/60 md:grid-cols-3 lg:grid-cols-6">
          {list.map((b, i) => (
            <div key={i} className="flex h-24 items-center justify-center bg-silver/40 font-display text-lg font-bold tracking-widest text-navy/60">
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
};
function AdvantageRender(p: AdvProps) {
  const cards = [
    { t: p.card1Title, d: p.card1Desc, i: p.card1Image },
    { t: p.card2Title, d: p.card2Desc, i: p.card2Image },
  ];
  return (
    <section className="bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-xs uppercase tracking-[0.3em] text-mid-blue">{p.eyebrow}</div>
        <h2 className="mt-4 font-display text-4xl font-bold leading-tight text-navy-deep md:text-5xl">{p.title}</h2>
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {cards.map((c, i) => (
            <div key={i} className="overflow-hidden bg-silver/30">
              {c.i && <div className="h-64 bg-cover bg-center" style={{ backgroundImage: `url(${c.i})` }} />}
              <div className="p-8">
                <h3 className="font-display text-2xl font-bold text-navy-deep">{c.t}</h3>
                <p className="mt-3 text-muted-foreground">{c.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

type CtaProps = { eyebrow: string; title: string; description: string; buttonText: string; buttonLink: string };
function CtaRender(p: CtaProps) {
  return (
    <section className="relative overflow-hidden bg-navy-deep py-24 text-white lg:py-32">
      <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/90 via-navy-deep/20 to-transparent" />
      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <div className="text-xs uppercase tracking-[0.3em] text-mid-blue">{p.eyebrow}</div>
        <h2 className="mt-4 font-display text-4xl font-bold leading-tight md:text-5xl">{p.title}</h2>
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

// ============ Puck config ============

export const puckConfig: Config = {
  components: {
    HeroSection: {
      label: "首页 Hero 大图区块",
      fields: {
        eyebrow: { type: "text", label: "小标 (eyebrow)" },
        titleLine1: { type: "text", label: "主标第一行" },
        titleLine2: { type: "text", label: "主标第二行" },
        intro: { type: "textarea", label: "简介" },
        image: { type: "text", label: "背景图片 URL" },
        primaryButtonText: { type: "text", label: "主按钮文字" },
        primaryButtonLink: { type: "text", label: "主按钮连结" },
        secondaryButtonText: { type: "text", label: "次按钮文字" },
        secondaryButtonLink: { type: "text", label: "次按钮连结" },
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
      },
      render: HeroRender,
    },
    StatsSection: {
      label: "数据统计区块",
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
      },
      defaultProps: {
        title: "用数据说话",
        stat1Value: "120,000m²", stat1Label: "厂房面积",
        stat2Value: "1,500+", stat2Label: "员工团队",
        stat3Value: "800+", stat3Label: "精密设备",
        stat4Value: "50M+", stat4Label: "年产能",
      },
      render: StatsRender,
    },
    CapabilitiesSection: {
      label: "核心制造能力",
      fields: {
        eyebrow: { type: "text", label: "小标" },
        title: { type: "text", label: "标题" },
        description: { type: "textarea", label: "描述" },
      },
      defaultProps: {
        eyebrow: "Core Capabilities",
        title: "四大核心制造能力",
        description: "覆盖从原型到量产的全制造链路，精密加工、表面处理、智能装配、质量检测一体化。",
      },
      render: CapabilitiesRender,
    },
    ClientsSection: {
      label: "客户品牌区块",
      fields: {
        eyebrow: { type: "text", label: "小标" },
        title: { type: "text", label: "标题" },
        brands: { type: "textarea", label: "品牌列表 (逗号分隔)" },
      },
      defaultProps: {
        eyebrow: "Trusted Partners",
        title: "合作品牌",
        brands: "SAMSUNG,HUAWEI,XIAOMI,TRANSSION,OPPO,VIVO",
      },
      render: ClientsRender,
    },
    AdvantageSection: {
      label: "优势对比区块",
      fields: {
        eyebrow: { type: "text", label: "小标" },
        title: { type: "text", label: "标题" },
        card1Title: { type: "text", label: "卡片 1 标题" },
        card1Desc: { type: "textarea", label: "卡片 1 描述" },
        card1Image: { type: "text", label: "卡片 1 图片 URL" },
        card2Title: { type: "text", label: "卡片 2 标题" },
        card2Desc: { type: "textarea", label: "卡片 2 描述" },
        card2Image: { type: "text", label: "卡片 2 图片 URL" },
      },
      defaultProps: {
        eyebrow: "Our Advantage",
        title: "为什么选择景鸿",
        card1Title: "智能化车间",
        card1Desc: "全自动产线 + 数字化品控，保障稳定交付。",
        card1Image: "",
        card2Title: "全球客户验证",
        card2Desc: "服务全球头部消费电子品牌十余年。",
        card2Image: "",
      },
      render: AdvantageRender,
    },
    CtaSection: {
      label: "底部 CTA 区块",
      fields: {
        eyebrow: { type: "text", label: "小标" },
        title: { type: "text", label: "标题" },
        description: { type: "textarea", label: "描述" },
        buttonText: { type: "text", label: "按钮文字" },
        buttonLink: { type: "text", label: "按钮连结" },
      },
      defaultProps: {
        eyebrow: "Let's Build Together",
        title: "携手共创智能制造未来",
        description: "无论您正在研发新产品，还是寻找稳定的量产伙伴，我们都欢迎与您深入交流。",
        buttonText: "联系我们",
        buttonLink: "/contact",
      },
      render: CtaRender,
    },
  },
};

// ============ Default data ============

const defaultData: Data = {
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

// ============ Main editor component ============

export function PuckHomeEditor() {
  const [initialData, setInitialData] = useState<Data | null>(null);
  const [previewData, setPreviewData] = useState<Data | null>(null);
  const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Data;
        setInitialData(parsed);
        setPreviewData(parsed);
        return;
      }
    } catch {
      // ignore
    }
    setInitialData(defaultData);
    setPreviewData(defaultData);
  }, []);

  const handlePublish = (data: Data) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setPreviewData(data);
      setToast({ type: "ok", msg: "原型已保存" });
    } catch {
      setToast({ type: "err", msg: "保存失败，请稍后重试" });
    }
    setTimeout(() => setToast(null), 2500);
  };

  if (!initialData) {
    return <div className="p-8 text-sm text-muted-foreground">加载中…</div>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-sm border border-border bg-white p-6">
        <h2 className="font-display text-xl font-bold text-navy-deep">首页拖拽编辑器原型</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          这是 Puck 拖拽编辑器原型，暂时不会影响线上首页。确认稳定后，下一阶段再接入正式首页。
        </p>
        <p className="mt-2 text-xs text-mid-blue">
          当前保存到浏览器本地，不影响线上首页。
        </p>
      </div>

      {toast && (
        <div
          className={`rounded-sm border px-4 py-3 text-sm ${
            toast.type === "ok"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {toast.msg}
        </div>
      )}

      <div className="overflow-hidden rounded-sm border border-border bg-white" style={{ height: "80vh" }}>
        <Puck
          config={puckConfig}
          data={initialData}
          onPublish={handlePublish}
          overrides={{
            puck: ({ children }) => <div className="h-full">{children}</div>,
          }}
          headerTitle="首页拖拽编辑器原型"
          headerPath="保存后将写入浏览器本地"
        />
      </div>

      <div className="rounded-sm border border-border bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-navy-deep">渲染预览</h3>
          <span className="text-xs text-muted-foreground">使用 Puck Render 渲染最近一次保存的数据</span>
        </div>
        <div className="overflow-hidden rounded-sm border border-border">
          {previewData && <Render config={puckConfig} data={previewData} />}
        </div>
      </div>
    </div>
  );
}
