import { type CSSProperties, type ElementType, type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Bold,
  Cpu,
  Eye,
  EyeOff,
  Factory,
  Italic,
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
  hero: "首屏 Hero",
  stats: "数据 Stats",
  capabilities: "能力 Capabilities",
  clients: "客户 Clients",
  advantage: "优势 Advantage",
  cta: "行动召唤 CTA",
};

const EDITABLE_FIELDS: { key: string; label: string; multiline?: boolean; image?: boolean }[] = [
  { key: "hero_eyebrow", label: "首屏 - 小标签" },
  { key: "hero_title_line1", label: "首屏 - 主标题第一行" },
  { key: "hero_title_line2", label: "首屏 - 主标题第二行" },
  { key: "hero_intro", label: "首屏 - 介绍文字", multiline: true },
  { key: "hero_image", label: "首屏 - 背景图", image: true },
  { key: "btn_explore", label: "首屏 - 主按钮文字" },
  { key: "btn_explore_link", label: "首屏 - 主按钮链接" },
  { key: "btn_contact", label: "首屏 - 次按钮文字" },
  { key: "btn_contact_link", label: "首屏 - 次按钮链接" },
  { key: "stats_title", label: "数据 - 标题（多行）", multiline: true },
  { key: "capabilities_title", label: "能力 - 标题" },
  { key: "capabilities_desc", label: "能力 - 描述", multiline: true },
  { key: "clients_title", label: "客户 - 标题" },
  { key: "advantage_title", label: "优势 - 标题", multiline: true },
  { key: "adv1_title", label: "优势卡片 1 - 标题" },
  { key: "adv1_desc", label: "优势卡片 1 - 描述", multiline: true },
  { key: "adv1_image", label: "优势卡片 1 - 图片", image: true },
  { key: "adv2_title", label: "优势卡片 2 - 标题" },
  { key: "adv2_desc", label: "优势卡片 2 - 描述", multiline: true },
  { key: "adv2_image", label: "优势卡片 2 - 图片", image: true },
  { key: "cta_title", label: "CTA - 标题（多行）", multiline: true },
  { key: "cta_desc", label: "CTA - 描述", multiline: true },
  { key: "cta_button", label: "CTA - 按钮文字" },
  { key: "cta_button_link", label: "CTA - 按钮链接" },
];

const BUILTIN_FONTS: { label: string; value: string }[] = [
  { label: "默认（继承）", value: "" },
  { label: "Inter", value: "Inter, system-ui, sans-serif" },
  { label: "系统字体", value: "system-ui, -apple-system, sans-serif" },
  { label: "苹方 / PingFang", value: "PingFang SC, -apple-system, sans-serif" },
  { label: "思源黑体 / Noto Sans", value: "Noto Sans SC, sans-serif" },
  { label: "无衬线 Sans", value: "sans-serif" },
  { label: "衬线 Serif", value: "Georgia, serif" },
  { label: "等宽 Mono", value: "JetBrains Mono, monospace" },
  { label: "优设标题黑", value: '"YouSheBiaoTiHei", "PingFang SC", sans-serif' },
  { label: "钉钉进步体", value: '"DingDingJinBuTi", "PingFang SC", sans-serif' },
];

type FieldStyle = {
  fontFamily?: string;
  fontSize?: number;
  weight?: "normal" | "bold" | "black";
  italic?: "normal" | "italic";
  color?: string;
  // legacy field, still honored for previously-saved data
  bold?: boolean;
};
type FieldStyles = Record<string, FieldStyle>;

const COLOR_SWATCHES: { label: string; value: string }[] = [
  { label: "深海军蓝", value: "#0f1b3d" },
  { label: "靛蓝", value: "#1e3a5f" },
  { label: "中蓝", value: "#3b6fa0" },
  { label: "银", value: "#e8edf3" },
  { label: "白", value: "#ffffff" },
  { label: "黑", value: "#000000" },
  { label: "灰", value: "#6b7280" },
  { label: "红", value: "#ef4444" },
  { label: "橙", value: "#f59e0b" },
  { label: "绿", value: "#22c55e" },
  { label: "青", value: "#06b6d4" },
  { label: "紫", value: "#8b5cf6" },
];

const PREV_SNAPSHOT_KEY = "home-content-prev-snapshot";

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

function parseFieldStyles(value: unknown): FieldStyles {
  if (!value || typeof value !== "object") return {};
  return value as FieldStyles;
}

function weightToCss(w: FieldStyle["weight"]): number | undefined {
  if (w === "normal") return 400;
  if (w === "bold") return 700;
  if (w === "black") return 900;
  return undefined;
}

function styleOf(styles: FieldStyles, key: string): CSSProperties | undefined {
  const s = styles[key];
  if (!s) return undefined;
  const css: CSSProperties = {};
  if (s.fontFamily) css.fontFamily = s.fontFamily;
  if (s.fontSize) css.fontSize = `${s.fontSize}px`;
  const w = weightToCss(s.weight);
  if (w !== undefined) css.fontWeight = w;
  else if (s.bold) css.fontWeight = 700;
  if (s.italic === "italic") css.fontStyle = "italic";
  else if (s.italic === "normal") css.fontStyle = "normal";
  if (s.color) css.color = s.color;
  return Object.keys(css).length ? css : undefined;
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
    <div
      role="group"
      title={title}
      onClick={(e) => {
        // Only react when the click target is not an editable text
        const target = e.target as HTMLElement;
        if (target.closest("[data-editable-text]")) return;
        onSelect();
      }}
      className={`block w-full cursor-pointer text-left transition ${
        selected
          ? "ring-2 ring-mid-blue ring-offset-2 ring-offset-white"
          : "hover:ring-1 hover:ring-mid-blue/60"
      }`}
    >
      {children}
    </div>
  );
}

type EditableTextProps = {
  fieldKey: string;
  value: string;
  onChange: (next: string) => void;
  onSelect: () => void;
  multiline?: boolean;
  as?: "span" | "div" | "p" | "h1" | "h2" | "h3";
  className?: string;
  style?: CSSProperties;
  placeholder?: string;
};

function EditableText({
  fieldKey,
  value,
  onChange,
  onSelect,
  multiline,
  as = "span",
  className,
  style,
  placeholder,
}: EditableTextProps) {
  const Tag = as as ElementType;
  const ref = useRef<HTMLElement>(null);

  // Sync external value into the DOM only when the element isn't focused
  // (so typing isn't interrupted).
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (document.activeElement === el) return;
    if (el.innerText !== value) el.innerText = value;
  }, [value]);

  const composedStyle: CSSProperties = {
    outline: "none",
    minWidth: "1ch",
    minHeight: "1em",
    whiteSpace: multiline ? "pre-wrap" : undefined,
    ...style,
  };

  return (
    
    <Tag
      ref={ref as never}
      data-editable-text={fieldKey}
      data-placeholder={placeholder}
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      onFocus={(e: React.FocusEvent<HTMLElement>) => {
        e.stopPropagation();
        onSelect();
      }}
      onClick={(e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        onSelect();
      }}
      onInput={(e: React.FormEvent<HTMLElement>) => {
        // Keep the parent form in sync as the user types so the right panel
        // and rendered styles reflect changes immediately.
        const text = (e.currentTarget as HTMLElement).innerText;
        onChange(text);
      }}
      onKeyDown={(e: React.KeyboardEvent<HTMLElement>) => {
        if (!multiline && e.key === "Enter") {
          e.preventDefault();
          (e.currentTarget as HTMLElement).blur();
        }
      }}
      className={className}
      style={composedStyle}
    />
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

function FontControls({
  value,
  onChange,
  customFonts,
}: {
  value: FieldStyle;
  onChange: (next: FieldStyle) => void;
  customFonts: { name: string; url: string }[];
}) {
  const update = (patch: Partial<FieldStyle>) => onChange({ ...value, ...patch });
  return (
    <div className="mt-4 space-y-3 rounded border border-border bg-silver/10 p-3">
      <div className="text-xs font-semibold text-navy-deep">文字样式</div>

      <div>
        <div className="mb-1 text-xs text-muted-foreground">字体</div>
        <select
          className="w-full border border-border bg-white px-2 py-1.5 text-sm"
          value={value.fontFamily ?? ""}
          onChange={(e) => update({ fontFamily: e.target.value || undefined })}
        >
          {BUILTIN_FONTS.map((f) => (
            <option key={f.label} value={f.value}>
              {f.label}
            </option>
          ))}
          {customFonts.map((f) => (
            <option key={`custom-${f.name}`} value={`"${f.name}"`}>
              {f.name}（自定义）
            </option>
          ))}
        </select>
      </div>

      <div>
        <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
          <span>字号</span>
          <span>{value.fontSize ? `${value.fontSize}px` : "默认"}</span>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min={10}
            max={120}
            step={1}
            value={value.fontSize ?? 16}
            onChange={(e) => update({ fontSize: Number(e.target.value) })}
            className="flex-1"
          />
          <input
            type="number"
            min={8}
            max={200}
            value={value.fontSize ?? ""}
            placeholder="px"
            onChange={(e) =>
              update({ fontSize: e.target.value ? Number(e.target.value) : undefined })
            }
            className="w-16 border border-border bg-white px-2 py-1 text-xs"
          />
          <button
            type="button"
            onClick={() => update({ fontSize: undefined })}
            className="border border-border bg-white px-2 py-1 text-xs text-muted-foreground"
          >
            重置
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <div className="mb-1 text-xs text-muted-foreground">粗细</div>
          <select
            className="w-full border border-border bg-white px-2 py-1.5 text-sm"
            value={value.weight ?? (value.bold ? "bold" : "")}
            onChange={(e) => {
              const v = e.target.value;
              update({
                weight: v === "" ? undefined : (v as FieldStyle["weight"]),
                bold: undefined,
              });
            }}
          >
            <option value="">默认（继承）</option>
            <option value="normal">常规 400</option>
            <option value="bold">加粗 700</option>
            <option value="black">特粗 900</option>
          </select>
        </div>
        <div>
          <div className="mb-1 text-xs text-muted-foreground">字形</div>
          <select
            className="w-full border border-border bg-white px-2 py-1.5 text-sm"
            value={value.italic ?? ""}
            onChange={(e) => {
              const v = e.target.value;
              update({ italic: v === "" ? undefined : (v as "normal" | "italic") });
            }}
          >
            <option value="">默认（继承）</option>
            <option value="normal">正常</option>
            <option value="italic">斜体</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() =>
            update({
              weight: (value.weight === "bold" || value.bold) ? "normal" : "bold",
              bold: undefined,
            })
          }
          className={`inline-flex items-center gap-1 border px-3 py-1.5 text-xs ${
            value.weight === "bold" || value.bold
              ? "border-mid-blue bg-mid-blue text-white"
              : "border-border bg-white text-navy-deep"
          }`}
          title="快捷加粗（再次点击切回常规）"
        >
          <Bold size={12} /> 加粗
        </button>
        <button
          type="button"
          onClick={() =>
            update({ italic: value.italic === "italic" ? "normal" : "italic" })
          }
          className={`inline-flex items-center gap-1 border px-3 py-1.5 text-xs ${
            value.italic === "italic"
              ? "border-mid-blue bg-mid-blue text-white"
              : "border-border bg-white text-navy-deep"
          }`}
          title="快捷斜体（再次点击切回正常）"
        >
          <Italic size={12} /> 斜体
        </button>
        <button
          type="button"
          onClick={() => onChange({})}
          className="ml-auto border border-border bg-white px-2 py-1.5 text-xs text-muted-foreground"
        >
          清空样式
        </button>
      </div>

      <div>
        <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
          <span>文字颜色</span>
          <span>{value.color ?? "默认（继承）"}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="color"
            value={value.color ?? "#0f1b3d"}
            onChange={(e) => update({ color: e.target.value })}
            className="h-8 w-10 cursor-pointer border border-border bg-white p-0"
            title="自定义颜色"
          />
          <input
            type="text"
            value={value.color ?? ""}
            placeholder="#hex"
            onChange={(e) => {
              const v = e.target.value.trim();
              update({ color: v || undefined });
            }}
            className="w-24 border border-border bg-white px-2 py-1 font-mono text-xs"
          />
          <button
            type="button"
            onClick={() => update({ color: undefined })}
            className="border border-border bg-white px-2 py-1 text-xs text-muted-foreground"
          >
            清除
          </button>
        </div>
        <div className="mt-2 grid grid-cols-6 gap-1.5">
          {COLOR_SWATCHES.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => update({ color: c.value })}
              title={`${c.label} ${c.value}`}
              aria-label={c.label}
              className={`h-7 w-full border ${
                value.color?.toLowerCase() === c.value.toLowerCase()
                  ? "border-mid-blue ring-2 ring-mid-blue/40"
                  : "border-border"
              }`}
              style={{ backgroundColor: c.value }}
            />
          ))}
        </div>
      </div>
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
  const [customFonts, setCustomFonts] = useState<{ name: string; url: string }[]>([]);

  useEffect(() => {
    if (data?.home) setForm(data.home as Record<string, unknown>);
  }, [data]);

  // Read custom fonts uploaded via the Puck editor (localStorage).
  useEffect(() => {
    try {
      const raw = localStorage.getItem("custom-fonts");
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) {
          const fonts = arr.filter(
            (f) => f && typeof f.name === "string" && typeof f.url === "string",
          );
          setCustomFonts(fonts);
          // inject @font-face for preview
          const styleId = "live-editor-custom-fonts";
          let el = document.getElementById(styleId) as HTMLStyleElement | null;
          if (!el) {
            el = document.createElement("style");
            el.id = styleId;
            document.head.appendChild(el);
          }
          el.textContent = fonts
            .map(
              (f) =>
                `@font-face { font-family: "${String(f.name).replace(/"/g, "")}"; src: url("${f.url}"); font-display: swap; }`,
            )
            .join("\n");
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const order = useMemo(() => parseSectionOrder(form.section_order), [form.section_order]);
  const visibility = useMemo(
    () => parseSectionVisibility(form.section_visibility),
    [form.section_visibility],
  );
  const fieldStyles = useMemo(() => parseFieldStyles(form.field_styles), [form.field_styles]);
  const brands = ((form.brands as string[] | undefined) ?? DEFAULT_BRANDS).slice(0, 6);
  const capabilities = data?.capabilities ?? [];
  const site = siteSettingsData?.item as Record<string, unknown> | undefined;
  const logoUrl = String(site?.logo_url ?? defaultLogo);
  const companyName = String(site?.company_name ?? "Logo");
  const navLinks = [
    String(site?.nav_home ?? "首页"),
    String(site?.nav_products ?? "产品"),
    String(site?.nav_news ?? "新闻"),
    String(site?.nav_about ?? "关于我们"),
    String(site?.nav_contact ?? "联系我们"),
  ];

  const setValue = (key: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const setFieldStyle = (key: string, style: FieldStyle) => {
    const next: FieldStyles = { ...fieldStyles };
    // prune keys whose value is undefined
    const cleaned: FieldStyle = {};
    (Object.keys(style) as (keyof FieldStyle)[]).forEach((k) => {
      const v = style[k];
      if (v !== undefined && v !== "" && !(typeof v === "boolean" && v === false)) {
        (cleaned as Record<string, unknown>)[k] = v;
      }
    });
    if (Object.keys(cleaned).length === 0) {
      delete next[key];
    } else {
      next[key] = cleaned;
    }
    setValue("field_styles", next);
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

  const [hasSnapshot, setHasSnapshot] = useState(false);
  useEffect(() => {
    try {
      setHasSnapshot(!!localStorage.getItem(PREV_SNAPSHOT_KEY));
    } catch {
      /* ignore */
    }
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      // Snapshot the last-known-saved DB state so the user can revert.
      try {
        if (data?.home) {
          localStorage.setItem(PREV_SNAPSHOT_KEY, JSON.stringify(data.home));
          setHasSnapshot(true);
        }
      } catch {
        /* ignore quota */
      }
      await saveHomeLiveEditor({
        data: {
          password: token,
          values: {
            ...form,
            section_order: order,
            section_visibility: visibility,
            field_styles: fieldStyles,
          },
        },
      });
      toast.success("已保存（可在底部点“恢复上一版本”回滚）");
      qc.invalidateQueries({ queryKey: ["home-content"] });
      qc.invalidateQueries({ queryKey: ["admin-home"] });
      qc.invalidateQueries({ queryKey: ["admin-live-editor-home"] });
    } catch (saveError) {
      toast.error(saveError instanceof Error ? saveError.message : "保存失败");
    } finally {
      setSaving(false);
    }
  };

  const restorePrevious = () => {
    try {
      const raw = localStorage.getItem(PREV_SNAPSHOT_KEY);
      if (!raw) {
        toast.error("没有可恢复的版本");
        return;
      }
      const prev = JSON.parse(raw);
      if (prev && typeof prev === "object") {
        setForm(prev as Record<string, unknown>);
        toast.success("已载入上一版本，点击“保存”后才会生效");
      }
    } catch {
      toast.error("恢复失败：快照已损坏");
    }
  };


  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="border border-mid-blue bg-mid-blue/10 px-4 py-3 text-sm font-semibold text-navy-deep">
          可视化编辑器已加载
        </div>
        <div className="py-6 text-muted-foreground">正在加载首页数据…</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-4">
        <div className="border border-mid-blue bg-mid-blue/10 px-4 py-3 text-sm font-semibold text-navy-deep">
          可视化编辑器已加载
        </div>
        <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          数据加载失败：{error instanceof Error ? error.message : "未知错误"}
        </div>
      </div>
    );
  }

  const selected = EDITABLE_FIELDS.find((field) => field.key === selectedField) ?? EDITABLE_FIELDS[0];
  const selectedValue = String((form[selected.key] as string | undefined) ?? "");
  const previewCapabilities = capabilities.length
    ? capabilities
    : [
        { id: "cap-1", title: "精密线圈", description: "为移动模组提供精细绕线工艺。", icon: "cpu" },
        { id: "cap-2", title: "快速打样", description: "灵活的打样与量产切换能力。", icon: "zap" },
        { id: "cap-3", title: "智能车间", description: "通过自动化产线保持稳定产出。", icon: "factory" },
        { id: "cap-4", title: "品质保证", description: "从首件到出货的全流程检验。", icon: "shield-check" },
      ];

  const stats = [
    {
      value: String(form.stat1_value ?? 1800),
      suffix: String(form.stat1_suffix ?? "㎡"),
      label: String(form.stat1_label ?? "厂房面积"),
    },
    {
      value: String(form.stat2_value ?? 90),
      suffix: String(form.stat2_suffix ?? "+"),
      label: String(form.stat2_label ?? "团队规模"),
    },
    {
      value: String(form.stat3_value ?? 80),
      suffix: String(form.stat3_suffix ?? "+"),
      label: String(form.stat3_label ?? "设备数量"),
    },
    {
      value: String(form.stat4_value ?? 2000),
      suffix: String(form.stat4_suffix ?? "万/月"),
      label: String(form.stat4_label ?? "月产能"),
    },
  ];

  const sectionPreview = (id: SectionId) => {
    if (!visibility[id]) return null;

    if (id === "hero") {
      return (
        <EditableBlock
          key={id}
          title="首屏 Hero"
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
              <div
                className="inline-flex items-center gap-2 rounded-sm border border-white/15 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-silver/90"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-mid-blue" />
                <EditableText
                  fieldKey="hero_eyebrow"
                  value={String(form.hero_eyebrow ?? "精密线圈制造")}
                  onChange={(v) => setValue("hero_eyebrow", v)}
                  onSelect={() => setSelectedField("hero_eyebrow")}
                  as="span"
                  style={styleOf(fieldStyles, "hero_eyebrow")}
                />
              </div>
              <h3 className="mt-5 max-w-3xl font-display text-4xl font-bold leading-[1.02] md:text-5xl">
                <EditableText
                  fieldKey="hero_title_line1"
                  value={String(form.hero_title_line1 ?? "精密制造")}
                  onChange={(v) => setValue("hero_title_line1", v)}
                  onSelect={() => setSelectedField("hero_title_line1")}
                  as="span"
                  style={styleOf(fieldStyles, "hero_title_line1")}
                />
                <br />
                <EditableText
                  fieldKey="hero_title_line2"
                  value={String(form.hero_title_line2 ?? "为规模而生")}
                  onChange={(v) => setValue("hero_title_line2", v)}
                  onSelect={() => setSelectedField("hero_title_line2")}
                  as="span"
                  className="text-silver"
                  style={styleOf(fieldStyles, "hero_title_line2")}
                />
              </h3>
              <EditableText
                fieldKey="hero_intro"
                value={String(form.hero_intro ?? "")}
                onChange={(v) => setValue("hero_intro", v)}
                onSelect={() => setSelectedField("hero_intro")}
                multiline
                as="p"
                className="mt-5 max-w-2xl text-sm leading-relaxed text-silver/80 md:text-base"
                style={styleOf(fieldStyles, "hero_intro")}
              />
              <div className="mt-7 flex flex-wrap gap-3">
                <span
                  className="inline-flex items-center gap-2 bg-mid-blue px-5 py-3 text-xs font-medium text-white"
                >
                  <EditableText
                    fieldKey="btn_explore"
                    value={String(form.btn_explore ?? "了解产品")}
                    onChange={(v) => setValue("btn_explore", v)}
                    onSelect={() => setSelectedField("btn_explore")}
                    as="span"
                    style={styleOf(fieldStyles, "btn_explore")}
                  />
                  <ArrowRight size={14} />
                </span>
                <EditableText
                  fieldKey="btn_contact"
                  value={String(form.btn_contact ?? "联系我们")}
                  onChange={(v) => setValue("btn_contact", v)}
                  onSelect={() => setSelectedField("btn_contact")}
                  as="span"
                  className="inline-flex items-center gap-2 border border-white/20 bg-white/5 px-5 py-3 text-xs font-medium text-white"
                  style={styleOf(fieldStyles, "btn_contact")}
                />
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
          title="数据 Stats"
          selected={selectedField.startsWith("stats_") || selectedField.startsWith("stat")}
          onSelect={() => setSelectedField("stats_title")}
        >
          <section className="bg-navy-deep px-6 py-10 text-white md:px-8 md:py-14">
            <div className="text-[10px] uppercase tracking-[0.3em] text-mid-blue">
              {String(form.stats_eyebrow ?? "数据见证")}
            </div>
            <EditableText
              fieldKey="stats_title"
              value={String(form.stats_title ?? "规模化的\n制造实力")}
              onChange={(v) => setValue("stats_title", v)}
              onSelect={() => setSelectedField("stats_title")}
              multiline
              as="h3"
              className="mt-4 font-display text-3xl font-bold leading-tight md:text-4xl"
              style={styleOf(fieldStyles, "stats_title")}
            />
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
          title="能力 Capabilities"
          selected={selectedField.startsWith("capabilities_")}
          onSelect={() => setSelectedField("capabilities_title")}
        >
          <section className="bg-background px-6 py-10 md:px-8 md:py-14">
            <div className="text-[10px] uppercase tracking-[0.3em] text-mid-blue">
              {String(form.capabilities_eyebrow ?? "核心能力")}
            </div>
            <EditableText
              fieldKey="capabilities_title"
              value={String(form.capabilities_title ?? "我们的能力")}
              onChange={(v) => setValue("capabilities_title", v)}
              onSelect={() => setSelectedField("capabilities_title")}
              as="h3"
              className="mt-4 font-display text-3xl font-bold leading-tight text-navy-deep md:text-4xl"
              style={styleOf(fieldStyles, "capabilities_title")}
            />
            <EditableText
              fieldKey="capabilities_desc"
              value={String(form.capabilities_desc ?? "")}
              onChange={(v) => setValue("capabilities_desc", v)}
              onSelect={() => setSelectedField("capabilities_desc")}
              multiline
              as="p"
              className="mt-3 max-w-xl text-sm text-muted-foreground"
              style={styleOf(fieldStyles, "capabilities_desc")}
            />
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
          title="客户 Clients"
          selected={selectedField.startsWith("clients_")}
          onSelect={() => setSelectedField("clients_title")}
        >
          <section className="bg-silver/40 px-6 py-10 md:px-8 md:py-14">
            <div className="text-center">
              <div className="text-[10px] uppercase tracking-[0.3em] text-mid-blue">
                {String(form.clients_eyebrow ?? "合作伙伴")}
              </div>
              <EditableText
                fieldKey="clients_title"
                value={String(form.clients_title ?? "服务客户")}
                onChange={(v) => setValue("clients_title", v)}
                onSelect={() => setSelectedField("clients_title")}
                as="h3"
                className="mt-3 font-display text-2xl font-bold text-navy-deep md:text-3xl"
                style={styleOf(fieldStyles, "clients_title")}
              />
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
          key: "adv1",
          img: String(form.adv1_image ?? workshopImg),
          tag: String(form.adv1_tag ?? "产线"),
          title: String(form.adv1_title ?? "自动化产线"),
          desc: String(form.adv1_desc ?? ""),
        },
        {
          key: "adv2",
          img: String(form.adv2_image ?? qualityImg),
          tag: String(form.adv2_tag ?? "品质"),
          title: String(form.adv2_title ?? "品质管控"),
          desc: String(form.adv2_desc ?? ""),
        },
      ];

      return (
        <EditableBlock
          key={id}
          title="优势 Advantage"
          selected={selectedField.startsWith("adv") || selectedField.startsWith("advantage_")}
          onSelect={() => setSelectedField("advantage_title")}
        >
          <section className="bg-background px-6 py-10 md:px-8 md:py-14">
            <div className="text-[10px] uppercase tracking-[0.3em] text-mid-blue">
              {String(form.advantage_eyebrow ?? "我们的优势")}
            </div>
            <h3
              className="mt-4 font-display text-3xl font-bold leading-tight text-navy-deep md:text-4xl"
              style={styleOf(fieldStyles, "advantage_title")}
            >
              {String(form.advantage_title ?? "核心优势")}
            </h3>
            <div className="mt-8 space-y-10">
              {items.map((item, index) => (
                <div key={item.key} className="grid gap-6 lg:grid-cols-2 lg:items-center">
                  <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                    <img src={item.img} alt={item.title} className="aspect-[4/3] w-full object-cover" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.25em] text-mid-blue">{item.tag}</div>
                    <div
                      className="mt-3 font-display text-2xl font-bold text-navy-deep"
                      style={styleOf(fieldStyles, `${item.key}_title`)}
                    >
                      {item.title}
                    </div>
                    <div
                      className="mt-4 text-sm leading-relaxed text-muted-foreground"
                      style={styleOf(fieldStyles, `${item.key}_desc`)}
                    >
                      {item.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              <div className="relative overflow-hidden">
                <img src={coilImg} alt="精密线圈" className="aspect-square w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/90 via-navy-deep/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 font-display text-lg font-bold text-white">精密线圈</div>
              </div>
              <div className="relative overflow-hidden">
                <img src={motorImg} alt="直线电机" className="aspect-square w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/90 via-navy-deep/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 font-display text-lg font-bold text-white">直线电机</div>
              </div>
              <div className="flex flex-col items-start justify-end bg-navy-deep p-5 text-white">
                <div className="text-[10px] uppercase tracking-[0.3em] text-mid-blue">产品</div>
                <div className="mt-2 font-display text-2xl font-bold">查看全部产品</div>
                <div className="mt-5 inline-flex items-center gap-2 text-sm text-silver">
                  前往产品页 <ArrowRight size={14} />
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
        title="CTA"
        selected={selectedField.startsWith("cta_")}
        onSelect={() => setSelectedField("cta_title")}
      >
        <section className="bg-[linear-gradient(135deg,#0f172a,#12325c,#1d4f91)] px-6 py-12 text-white md:px-8 md:py-16">
          <div className="mx-auto max-w-3xl text-center">
            <div className="text-[10px] uppercase tracking-[0.3em] text-mid-blue">
              {String(form.cta_eyebrow ?? "携手共建")}
            </div>
            <h3
              className="mt-5 font-display text-3xl font-bold leading-tight md:text-4xl"
              style={styleOf(fieldStyles, "cta_title")}
            >
              {splitLines(form.cta_title, "让我们助力您的下一个项目").map((line, index, lines) => (
                <span key={`${line}-${index}`}>
                  {line}
                  {index < lines.length - 1 && <br />}
                </span>
              ))}
            </h3>
            <p
              className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-silver/80"
              style={styleOf(fieldStyles, "cta_desc")}
            >
              {String(form.cta_desc ?? "")}
            </p>
            <span
              className="mt-7 inline-flex items-center gap-2 bg-white px-6 py-3 text-sm font-medium text-navy-deep"
              style={styleOf(fieldStyles, "cta_button")}
            >
              {String(form.cta_button ?? "联系我们")}
              <ArrowRight size={14} />
            </span>
          </div>
        </section>
      </EditableBlock>
    );
  };

  const showFontControls = !selected.image && !selected.key.endsWith("_link");
  const currentStyle = fieldStyles[selected.key] ?? {};

  return (
    <div className="space-y-6">
      <div className="border border-mid-blue bg-mid-blue/10 px-4 py-3 text-sm font-semibold text-navy-deep">
        可视化编辑器已加载
      </div>
      {!data?.home && (
        <div className="border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          未能获取首页内容，预览正在使用默认占位内容。
        </div>
      )}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-4 rounded-md border border-border bg-silver/10 p-4">
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">首页预览</div>
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
                  {String(site?.nav_cta ?? "获取报价")}
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
                    {String(site?.footer_intro ?? "专注于精密制造与稳定交付，服务规模化生产。")}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.3em] text-mid-blue">联系方式</div>
                  <div className="mt-3 space-y-2 text-sm">
                    <div>{String(site?.address ?? "广东省东莞市")}</div>
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
            <div className="text-sm font-semibold text-navy-deep">板块显示与排序</div>
            <div className="mt-3 space-y-2">
              {order.map((id, idx) => (
                <div key={id} className="flex items-center gap-2 border border-border px-2 py-2 text-sm">
                  <button type="button" onClick={() => toggleSection(id)} className="text-navy-deep" title="显示/隐藏">
                    {visibility[id] ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                  <span className="min-w-0 flex-1">{SECTION_LABELS[id]}</span>
                  <button
                    type="button"
                    onClick={() => moveSection(idx, -1)}
                    className="text-navy-deep disabled:opacity-30"
                    disabled={idx === 0}
                    title="上移"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveSection(idx, 1)}
                    className="text-navy-deep disabled:opacity-30"
                    disabled={idx === order.length - 1}
                    title="下移"
                  >
                    <ArrowDown size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-border bg-white p-4">
            <div className="text-sm font-semibold text-navy-deep">字段编辑</div>
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

            {showFontControls && (
              <FontControls
                value={currentStyle}
                onChange={(next) => setFieldStyle(selected.key, next)}
                customFonts={customFonts}
              />
            )}
          </div>
        </div>

        <div className="xl:col-span-2 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 border border-border bg-white px-4 py-3">
            <div className="text-sm text-navy-deep">
              <span className="font-semibold">版本回滚：</span>
              <span className="text-muted-foreground">
                {hasSnapshot
                  ? "可恢复到上一次保存前的版本。点击恢复后，仍需点“保存”才会生效。"
                  : "尚无可恢复版本。每次保存都会自动备份上一版本。"}
              </span>
            </div>
            <button
              type="button"
              onClick={restorePrevious}
              disabled={!hasSnapshot}
              className="border border-border bg-white px-3 py-1.5 text-sm text-navy-deep disabled:opacity-40"
            >
              恢复上一版本
            </button>
          </div>
          <SaveBar saving={saving} onSave={save} label="保存可视化编辑器修改" />
        </div>
      </div>
    </div>
  );
}
