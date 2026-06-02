import { type ReactNode, useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Cpu,
  Eye,
  EyeOff,
  Factory,
  ShieldCheck,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Field, SaveBar, TextArea, TextInput } from "@/components/admin/fields";
import { ImageUpload } from "@/components/site/ImageUpload";
import { getHomeContent, getSiteSettings, saveHomeLiveEditor } from "@/lib/site.functions";
import defaultLogo from "@/assets/logo.png";
import heroFactory from "@/assets/hero-factory.jpg";
import workshopImg from "@/assets/workshop.jpg";
import qualityImg from "@/assets/quality.jpg";
import coilImg from "@/assets/product-coil.jpg";
import motorImg from "@/assets/product-motor.jpg";

type SectionId = "hero" | "stats" | "capabilities" | "clients" | "advantage" | "cta";

const DEFAULT_SECTION_ORDER: SectionId[] = [
  "hero",
  "stats",
  "capabilities",
  "clients",
  "advantage",
  "cta",
];

const DEFAULT_BRANDS = ["SAMSUNG", "HUAWEI", "XIAOMI", "TRANSSION", "OPPO", "VIVO"];

const ICONS: Record<string, LucideIcon> = {
  cpu: Cpu,
  zap: Zap,
  factory: Factory,
  shieldcheck: ShieldCheck,
  "shield-check": ShieldCheck,
  shield: ShieldCheck,
};

const SECTION_LABELS: Record<SectionId, string> = {
  hero: "Hero",
  stats: "Stats",
  capabilities: "Capabilities",
  clients: "Clients",
  advantage: "Advantage",
  cta: "CTA",
};

const EDITABLE_FIELDS: { key: string; label: string; multiline?: boolean; image?: boolean }[] = [
  { key: "hero_eyebrow", label: "Hero Eyebrow" },
  { key: "hero_title_line1", label: "Hero Title Line 1" },
  { key: "hero_title_line2", label: "Hero Title Line 2" },
  { key: "hero_intro", label: "Hero Intro", multiline: true },
  { key: "hero_image", label: "Hero Image URL", image: true },
  { key: "btn_explore", label: "Hero Primary Button Text" },
  { key: "btn_explore_link", label: "Hero Primary Button Link" },
  { key: "btn_contact", label: "Hero Secondary Button Text" },
  { key: "btn_contact_link", label: "Hero Secondary Button Link" },
  { key: "stats_title", label: "Stats Title", multiline: true },
  { key: "capabilities_title", label: "Capabilities Title" },
  { key: "clients_title", label: "Clients Title" },
  { key: "advantage_title", label: "Advantage Title", multiline: true },
  { key: "adv1_title", label: "Advantage Card 1 Title" },
  { key: "adv1_desc", label: "Advantage Card 1 Description", multiline: true },
  { key: "adv1_image", label: "Advantage Card 1 Image", image: true },
  { key: "adv2_title", label: "Advantage Card 2 Title" },
  { key: "adv2_desc", label: "Advantage Card 2 Description", multiline: true },
  { key: "adv2_image", label: "Advantage Card 2 Image", image: true },
  { key: "cta_title", label: "CTA Title", multiline: true },
  { key: "cta_desc", label: "CTA Description", multiline: true },
  { key: "cta_button", label: "CTA Button Text" },
  { key: "cta_button_link", label: "CTA Button Link" },
];

const checkerboardStyle = {
  backgroundColor: "#0f172a",
  backgroundImage:
    "linear-gradient(45deg, rgba(255,255,255,0.08) 25%, transparent 25%), linear-gradient(-45deg, rgba(255,255,255,0.08) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.08) 75%), linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.08) 75%)",
  backgroundSize: "20px 20px",
  backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0",
} as const;

function parseSectionOrder(value: unknown): SectionId[] {
  if (!Array.isArray(value)) return DEFAULT_SECTION_ORDER;
  const picked = value.filter(
    (v): v is SectionId => typeof v === "string" && DEFAULT_SECTION_ORDER.includes(v as SectionId),
  );
  const set = new Set(picked);
  for (const id of DEFAULT_SECTION_ORDER) {
    if (!set.has(id)) picked.push(id);
  }
  return picked;
}

function parseSectionVisibility(value: unknown): Record<SectionId, boolean> {
  const visibility = Object.fromEntries(
    DEFAULT_SECTION_ORDER.map((id) => [id, true]),
  ) as Record<SectionId, boolean>;
  if (value && typeof value === "object") {
    for (const id of DEFAULT_SECTION_ORDER) {
      const item = (value as Record<string, unknown>)[id];
      if (typeof item === "boolean") visibility[id] = item;
    }
  }
  return visibility;
}

function splitLines(value: unknown, fallback: string) {
  return String(value ?? fallback).split("\n");
}

function getIcon(icon: string | undefined) {
  return ICONS[String(icon || "").toLowerCase()] || Cpu;
}

function EditableBlock({
  title,
  selected,
  onSelect,
  children,
}: {
  title: string;
  selected: boolean;
  onSelect: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      title={title}
      className={`block w-full text-left transition ${
        selected ? "ring-2 ring-mid-blue ring-offset-2 ring-offset-white" : "hover:ring-1 hover:ring-mid-blue/60"
      }`}
    >
      {children}
    </button>
  );
}

function LogoPlate({ logoUrl, alt }: { logoUrl: string; alt: string }) {
  return (
    <div
      className="flex h-12 w-[7.5rem] items-center justify-center overflow-hidden rounded-sm p-2"
      style={checkerboardStyle}
    >
      <img src={logoUrl} alt={alt} className="h-full w-full object-contain" />
    </div>
  );
}

export function LiveEditorPanel({ token }: { token: string }) {
  const qc = useQueryClient();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["admin-live-editor-home"],
    queryFn: () => getHomeContent(),
  });
  const { data: siteSettingsData } = useQuery({
    queryKey: ["site-settings"],
    queryFn: () => getSiteSettings(),
    staleTime: 60_000,
  });

  const [form, setForm] = useState<Record<string, unknown>>({});
  const [saving, setSaving] = useState(false);
  const [selectedField, setSelectedField] = useState("hero_title_line1");

  useEffect(() => {
    if (data?.home) setForm(data.home as Record<string, unknown>);
  }, [data]);

  const order = useMemo(() => parseSectionOrder(form.section_order), [form.section_order]);
  const visibility = useMemo(
    () => parseSectionVisibility(form.section_visibility),
    [form.section_visibility],
  );
  const brands = ((form.brands as string[] | undefined) ?? DEFAULT_BRANDS).slice(0, 6);
  const capabilities = data?.capabilities ?? [];
  const site = siteSettingsData?.item as Record<string, unknown> | undefined;
  const logoUrl = String(site?.logo_url ?? defaultLogo);
  const companyName = String(site?.company_name ?? "Logo");
  const navLinks = [
    String(site?.nav_home ?? "Home"),
    String(site?.nav_products ?? "Products"),
    String(site?.nav_news ?? "News"),
    String(site?.nav_about ?? "About"),
    String(site?.nav_contact ?? "Contact"),
  ];

  const setValue = (key: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleSection = (id: SectionId) => {
    setValue("section_visibility", { ...visibility, [id]: !visibility[id] });
  };

  const moveSection = (idx: number, delta: -1 | 1) => {
    const target = idx + delta;
    if (target < 0 || target >= order.length) return;
    const next = [...order];
    [next[idx], next[target]] = [next[target], next[idx]];
    setValue("section_order", next);
  };

  const save = async () => {
    setSaving(true);
    try {
      await saveHomeLiveEditor({
        data: {
          password: token,
          values: {
            ...form,
            section_order: order,
            section_visibility: visibility,
          },
        },
      });
      toast.success("Saved");
      qc.invalidateQueries({ queryKey: ["home-content"] });
      qc.invalidateQueries({ queryKey: ["admin-home"] });
      qc.invalidateQueries({ queryKey: ["admin-live-editor-home"] });
    } catch (saveError) {
      toast.error(saveError instanceof Error ? saveError.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="border border-mid-blue bg-mid-blue/10 px-4 py-3 text-sm font-semibold text-navy-deep">
          Live Editor loaded
        </div>
        <div className="py-6 text-muted-foreground">Loading home page data</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-4">
        <div className="border border-mid-blue bg-mid-blue/10 px-4 py-3 text-sm font-semibold text-navy-deep">
          Live Editor loaded
        </div>
        <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Failed to load data: {error instanceof Error ? error.message : "Unknown error"}
        </div>
      </div>
    );
  }

  const selected = EDITABLE_FIELDS.find((field) => field.key === selectedField) ?? EDITABLE_FIELDS[0];
  const selectedValue = String((form[selected.key] as string | undefined) ?? "");
  const previewCapabilities = capabilities.length
    ? capabilities
    : [
        { id: "cap-1", title: "Precision Coil", description: "Fine-tuned winding for mobile modules.", icon: "cpu" },
        { id: "cap-2", title: "Rapid Tooling", description: "Flexible setup for sampling and production.", icon: "zap" },
        { id: "cap-3", title: "Smart Workshop", description: "Stable output through automated line control.", icon: "factory" },
        { id: "cap-4", title: "Quality Assurance", description: "Inspection checkpoints from start to shipment.", icon: "shield-check" },
      ];

  const stats = [
    {
      value: String(form.stat1_value ?? 1800),
      suffix: String(form.stat1_suffix ?? "sqm"),
      label: String(form.stat1_label ?? "Workshop"),
    },
    {
      value: String(form.stat2_value ?? 90),
      suffix: String(form.stat2_suffix ?? "+"),
      label: String(form.stat2_label ?? "Team"),
    },
    {
      value: String(form.stat3_value ?? 80),
      suffix: String(form.stat3_suffix ?? "+"),
      label: String(form.stat3_label ?? "Machines"),
    },
    {
      value: String(form.stat4_value ?? 2000),
      suffix: String(form.stat4_suffix ?? " / month"),
      label: String(form.stat4_label ?? "Capacity"),
    },
  ];

  const sectionPreview = (id: SectionId) => {
    if (!visibility[id]) return null;

    if (id === "hero") {
      return (
        <EditableBlock
          key={id}
          title="hero"
          selected={selectedField.startsWith("hero_") || selectedField.startsWith("btn_")}
          onSelect={() => setSelectedField("hero_title_line1")}
        >
          <section className="relative overflow-hidden bg-navy-deep">
            <img
              src={String(form.hero_image ?? heroFactory)}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(9,20,43,0.88),rgba(9,20,43,0.58),rgba(12,74,110,0.42))]" />
            <div className="relative z-10 px-6 py-14 text-white md:px-8 md:py-20">
              <div className="inline-flex items-center gap-2 rounded-sm border border-white/15 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-silver/90">
                <span className="h-1.5 w-1.5 rounded-full bg-mid-blue" />
                {String(form.hero_eyebrow ?? "Precision Coil Manufacturing")}
              </div>
              <h3 className="mt-5 max-w-3xl font-display text-4xl font-bold leading-[1.02] md:text-5xl">
                {String(form.hero_title_line1 ?? "Precision Manufacturing")}
                <br />
                <span className="text-silver">{String(form.hero_title_line2 ?? "Built for Scale")}</span>
              </h3>
              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-silver/80 md:text-base">
                {String(form.hero_intro ?? "")}
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 bg-mid-blue px-5 py-3 text-xs font-medium text-white">
                  {String(form.btn_explore ?? "Explore")}
                  <ArrowRight size={14} />
                </span>
                <span className="inline-flex items-center gap-2 border border-white/20 bg-white/5 px-5 py-3 text-xs font-medium text-white">
                  {String(form.btn_contact ?? "Contact")}
                </span>
              </div>
            </div>
          </section>
        </EditableBlock>
      );
    }

    if (id === "stats") {
      return (
        <EditableBlock
          key={id}
          title="stats"
          selected={selectedField.startsWith("stats_") || selectedField.startsWith("stat")}
          onSelect={() => setSelectedField("stats_title")}
        >
          <section className="bg-navy-deep px-6 py-10 text-white md:px-8 md:py-14">
            <div className="text-[10px] uppercase tracking-[0.3em] text-mid-blue">
              {String(form.stats_eyebrow ?? "By the numbers")}
            </div>
            <h3 className="mt-4 font-display text-3xl font-bold leading-tight md:text-4xl">
              {splitLines(form.stats_title, "Manufacturing strength\nat scale").map((line, index, lines) => (
                <span key={`${line}-${index}`}>
                  {line}
                  {index < lines.length - 1 && <br />}
                </span>
              ))}
            </h3>
            <div className="mt-8 grid gap-px bg-white/10 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((item) => (
                <div key={item.label} className="bg-navy-deep p-5">
                  <div className="font-display text-3xl font-bold">
                    {item.value}
                    {item.suffix}
                  </div>
                  <div className="mt-3 h-px w-10 bg-mid-blue" />
                  <div className="mt-3 text-xs text-silver/70">{item.label}</div>
                </div>
              ))}
            </div>
          </section>
        </EditableBlock>
      );
    }

    if (id === "capabilities") {
      return (
        <EditableBlock
          key={id}
          title="capabilities"
          selected={selectedField.startsWith("capabilities_")}
          onSelect={() => setSelectedField("capabilities_title")}
        >
          <section className="bg-background px-6 py-10 md:px-8 md:py-14">
            <div className="text-[10px] uppercase tracking-[0.3em] text-mid-blue">
              {String(form.capabilities_eyebrow ?? "Core Capabilities")}
            </div>
            <h3 className="mt-4 font-display text-3xl font-bold leading-tight text-navy-deep md:text-4xl">
              {String(form.capabilities_title ?? "Capabilities")}
            </h3>
            <p className="mt-3 max-w-xl text-sm text-muted-foreground">
              {String(form.capabilities_desc ?? "")}
            </p>
            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {previewCapabilities.slice(0, 4).map((item) => {
                const Icon = getIcon(item.icon);
                return (
                  <div key={item.id} className="border border-border bg-white p-5">
                    <Icon size={28} className="text-mid-blue" strokeWidth={1.5} />
                    <div className="mt-5 font-display text-lg font-bold text-navy-deep">{item.title}</div>
                    <div className="mt-2 text-xs leading-relaxed text-muted-foreground">{item.description}</div>
                  </div>
                );
              })}
            </div>
          </section>
        </EditableBlock>
      );
    }

    if (id === "clients") {
      return (
        <EditableBlock
          key={id}
          title="clients"
          selected={selectedField.startsWith("clients_")}
          onSelect={() => setSelectedField("clients_title")}
        >
          <section className="bg-silver/40 px-6 py-10 md:px-8 md:py-14">
            <div className="text-center">
              <div className="text-[10px] uppercase tracking-[0.3em] text-mid-blue">
                {String(form.clients_eyebrow ?? "Trusted Partners")}
              </div>
              <h3 className="mt-3 font-display text-2xl font-bold text-navy-deep md:text-3xl">
                {String(form.clients_title ?? "Clients")}
              </h3>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-px bg-border md:grid-cols-3 xl:grid-cols-6">
              {brands.map((brand, index) => (
                <div
                  key={`${brand}-${index}`}
                  className="flex h-20 items-center justify-center bg-silver/40 px-2 text-center font-display text-sm font-bold tracking-[0.22em] text-navy/60"
                >
                  {brand}
                </div>
              ))}
            </div>
          </section>
        </EditableBlock>
      );
    }

    if (id === "advantage") {
      const items = [
        {
          img: String(form.adv1_image ?? workshopImg),
          tag: String(form.adv1_tag ?? "Line"),
          title: String(form.adv1_title ?? "Automated line"),
          desc: String(form.adv1_desc ?? ""),
        },
        {
          img: String(form.adv2_image ?? qualityImg),
          tag: String(form.adv2_tag ?? "Quality"),
          title: String(form.adv2_title ?? "Quality control"),
          desc: String(form.adv2_desc ?? ""),
        },
      ];

      return (
        <EditableBlock
          key={id}
          title="advantage"
          selected={selectedField.startsWith("adv") || selectedField.startsWith("advantage_")}
          onSelect={() => setSelectedField("advantage_title")}
        >
          <section className="bg-background px-6 py-10 md:px-8 md:py-14">
            <div className="text-[10px] uppercase tracking-[0.3em] text-mid-blue">
              {String(form.advantage_eyebrow ?? "Our Advantage")}
            </div>
            <h3 className="mt-4 font-display text-3xl font-bold leading-tight text-navy-deep md:text-4xl">
              {String(form.advantage_title ?? "Advantage")}
            </h3>
            <div className="mt-8 space-y-10">
              {items.map((item, index) => (
                <div key={item.title} className="grid gap-6 lg:grid-cols-2 lg:items-center">
                  <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                    <img src={item.img} alt={item.title} className="aspect-[4/3] w-full object-cover" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.25em] text-mid-blue">{item.tag}</div>
                    <div className="mt-3 font-display text-2xl font-bold text-navy-deep">{item.title}</div>
                    <div className="mt-4 text-sm leading-relaxed text-muted-foreground">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              <div className="relative overflow-hidden">
                <img src={coilImg} alt="Precision Coil" className="aspect-square w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/90 via-navy-deep/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 font-display text-lg font-bold text-white">Precision Coil</div>
              </div>
              <div className="relative overflow-hidden">
                <img src={motorImg} alt="Linear Motor" className="aspect-square w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/90 via-navy-deep/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 font-display text-lg font-bold text-white">Linear Motor</div>
              </div>
              <div className="flex flex-col items-start justify-end bg-navy-deep p-5 text-white">
                <div className="text-[10px] uppercase tracking-[0.3em] text-mid-blue">Products</div>
                <div className="mt-2 font-display text-2xl font-bold">View all products</div>
                <div className="mt-5 inline-flex items-center gap-2 text-sm text-silver">
                  Go to products <ArrowRight size={14} />
                </div>
              </div>
            </div>
          </section>
        </EditableBlock>
      );
    }

    return (
      <EditableBlock
        key={id}
        title="cta"
        selected={selectedField.startsWith("cta_")}
        onSelect={() => setSelectedField("cta_title")}
      >
        <section className="bg-[linear-gradient(135deg,#0f172a,#12325c,#1d4f91)] px-6 py-12 text-white md:px-8 md:py-16">
          <div className="mx-auto max-w-3xl text-center">
            <div className="text-[10px] uppercase tracking-[0.3em] text-mid-blue">
              {String(form.cta_eyebrow ?? "Let's Build Together")}
            </div>
            <h3 className="mt-5 font-display text-3xl font-bold leading-tight md:text-4xl">
              {splitLines(form.cta_title, "Let us support your next project").map((line, index, lines) => (
                <span key={`${line}-${index}`}>
                  {line}
                  {index < lines.length - 1 && <br />}
                </span>
              ))}
            </h3>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-silver/80">
              {String(form.cta_desc ?? "")}
            </p>
            <span className="mt-7 inline-flex items-center gap-2 bg-white px-6 py-3 text-sm font-medium text-navy-deep">
              {String(form.cta_button ?? "Contact us")}
              <ArrowRight size={14} />
            </span>
          </div>
        </section>
      </EditableBlock>
    );
  };

  return (
    <div className="space-y-6">
      <div className="border border-mid-blue bg-mid-blue/10 px-4 py-3 text-sm font-semibold text-navy-deep">
        Live Editor loaded
      </div>
      {!data?.home && (
        <div className="border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Home content was not returned. The preview is showing fallback content.
        </div>
      )}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-4 rounded-md border border-border bg-silver/10 p-4">
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Home Preview</div>
          <div className="overflow-hidden rounded-[28px] border border-border bg-white shadow-[0_20px_70px_rgba(15,23,42,0.14)]">
            <div className="border-b border-white/10 bg-navy-deep/95 px-6 py-4 text-white">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <LogoPlate logoUrl={logoUrl} alt={companyName} />
                  <div className="hidden flex-wrap items-center gap-4 text-xs text-silver/80 md:flex">
                    {navLinks.map((label) => (
                      <span key={label}>{label}</span>
                    ))}
                  </div>
                </div>
                <span className="hidden border border-white/15 px-4 py-2 text-xs text-white/90 md:inline-flex">
                  {String(site?.nav_cta ?? "Get Quote")}
                </span>
              </div>
            </div>

            <div className="bg-white">
              {order.map((id) => sectionPreview(id))}
            </div>

            <div className="border-t border-white/10 bg-navy-deep px-6 py-8 text-silver/70">
              <div className="grid gap-8 md:grid-cols-[1.5fr_1fr]">
                <div>
                  <LogoPlate logoUrl={logoUrl} alt={companyName} />
                  <div className="mt-4 max-w-md text-sm leading-relaxed text-silver/70">
                    {String(site?.footer_intro ?? "Focused on precision manufacturing and dependable delivery for scale production.")}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.3em] text-mid-blue">Contact</div>
                  <div className="mt-3 space-y-2 text-sm">
                    <div>{String(site?.address ?? "Dongguan, Guangdong")}</div>
                    <div>{String(site?.phone ?? "+86 xxx xxxx xxxx")}</div>
                    <div>{String(site?.email ?? "info@example.com")}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="border border-border bg-white p-4">
            <div className="text-sm font-semibold text-navy-deep">Section visibility & order</div>
            <div className="mt-3 space-y-2">
              {order.map((id, idx) => (
                <div key={id} className="flex items-center gap-2 border border-border px-2 py-2 text-sm">
                  <button type="button" onClick={() => toggleSection(id)} className="text-navy-deep">
                    {visibility[id] ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                  <span className="min-w-0 flex-1">{SECTION_LABELS[id]}</span>
                  <button
                    type="button"
                    onClick={() => moveSection(idx, -1)}
                    className="text-navy-deep disabled:opacity-30"
                    disabled={idx === 0}
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveSection(idx, 1)}
                    className="text-navy-deep disabled:opacity-30"
                    disabled={idx === order.length - 1}
                  >
                    <ArrowDown size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-border bg-white p-4">
            <div className="text-sm font-semibold text-navy-deep">Field editor</div>
            <select
              className="mt-3 w-full border border-border bg-white px-3 py-2 text-sm"
              value={selected.key}
              onChange={(e) => setSelectedField(e.target.value)}
            >
              {EDITABLE_FIELDS.map((field) => (
                <option key={field.key} value={field.key}>
                  {field.label}
                </option>
              ))}
            </select>

            <div className="mt-3">
              {selected.image ? (
                <ImageUpload value={selectedValue} onChange={(v) => setValue(selected.key, v)} />
              ) : selected.multiline ? (
                <Field label={selected.label}>
                  <TextArea rows={5} value={selectedValue} onChange={(v) => setValue(selected.key, v)} />
                </Field>
              ) : (
                <Field label={selected.label}>
                  <TextInput value={selectedValue} onChange={(v) => setValue(selected.key, v)} />
                </Field>
              )}
            </div>
          </div>
        </div>

        <div className="xl:col-span-2">
          <SaveBar saving={saving} onSave={save} label="Save Live Editor Changes" />
        </div>
      </div>
    </div>
  );
}
