import { type ReactNode, useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowDown, ArrowUp, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Field, SaveBar, TextArea, TextInput } from "@/components/admin/fields";
import { ImageUpload } from "@/components/site/ImageUpload";
import { getHomeContent, saveHomeLiveEditor } from "@/lib/site.functions";

type SectionId = "hero" | "stats" | "capabilities" | "clients" | "advantage" | "cta";

const DEFAULT_SECTION_ORDER: SectionId[] = [
  "hero",
  "stats",
  "capabilities",
  "clients",
  "advantage",
  "cta",
];

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
      className={`w-full text-left transition ${
        selected ? "ring-2 ring-mid-blue ring-offset-2" : "hover:ring-1 hover:ring-mid-blue/60"
      }`}
    >
      {children}
    </button>
  );
}

export function LiveEditorPanel({ token }: { token: string }) {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-live-editor-home"],
    queryFn: () => getHomeContent(),
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
  const brands = (form.brands as string[] | undefined) ?? [];
  const capabilities = data?.capabilities ?? [];

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
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) return <div className="py-12 text-muted-foreground">Loading...</div>;

  const selected = EDITABLE_FIELDS.find((f) => f.key === selectedField) ?? EDITABLE_FIELDS[0];
  const selectedValue = String((form[selected.key] as string | undefined) ?? "");

  const sectionPreview = (id: SectionId) => {
    if (!visibility[id]) return null;

    if (id === "hero") {
      return (
        <section key={id} className="border border-border bg-white p-5">
          <EditableBlock title="hero" selected={selectedField.startsWith("hero_") || selectedField.startsWith("btn_")} onSelect={() => setSelectedField("hero_title_line1")}>
            <div className="text-xs uppercase tracking-[0.2em] text-mid-blue">{String(form.hero_eyebrow ?? "")}</div>
            <h3 className="mt-2 font-display text-3xl font-bold text-navy-deep">{String(form.hero_title_line1 ?? "")}</h3>
            <h3 className="font-display text-3xl font-bold text-mid-blue">{String(form.hero_title_line2 ?? "")}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{String(form.hero_intro ?? "")}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="inline-flex bg-navy-deep px-3 py-1 text-sm text-white">{String(form.btn_explore ?? "")}</span>
              <span className="inline-flex border border-border px-3 py-1 text-sm text-navy-deep">{String(form.btn_contact ?? "")}</span>
            </div>
          </EditableBlock>
        </section>
      );
    }

    if (id === "stats") {
      return (
        <section key={id} className="border border-border bg-white p-5">
          <EditableBlock title="stats" selected={selectedField.startsWith("stats_") || selectedField.startsWith("stat")} onSelect={() => setSelectedField("stats_title")}>
            <h3 className="font-display text-2xl font-bold text-navy-deep">{String(form.stats_title ?? "")}</h3>
          </EditableBlock>
        </section>
      );
    }

    if (id === "capabilities") {
      return (
        <section key={id} className="border border-border bg-white p-5">
          <EditableBlock title="capabilities" selected={selectedField.startsWith("capabilities_")} onSelect={() => setSelectedField("capabilities_title")}>
            <h3 className="font-display text-2xl font-bold text-navy-deep">{String(form.capabilities_title ?? "")}</h3>
          </EditableBlock>
          <div className="mt-3 grid gap-2 md:grid-cols-2">
            {capabilities.map((item) => (
              <div key={item.id} className="border border-border p-2 text-xs text-muted-foreground">
                <div className="text-sm font-medium text-navy-deep">{item.title}</div>
                {item.description}
              </div>
            ))}
          </div>
        </section>
      );
    }

    if (id === "clients") {
      return (
        <section key={id} className="border border-border bg-white p-5">
          <EditableBlock title="clients" selected={selectedField.startsWith("clients_")} onSelect={() => setSelectedField("clients_title")}>
            <h3 className="font-display text-2xl font-bold text-navy-deep">{String(form.clients_title ?? "")}</h3>
          </EditableBlock>
          <div className="mt-3 flex flex-wrap gap-2">
            {brands.map((brand, i) => (
              <span key={`${brand}-${i}`} className="border border-border px-2 py-1 text-xs text-navy-deep">
                {brand}
              </span>
            ))}
          </div>
        </section>
      );
    }

    if (id === "advantage") {
      return (
        <section key={id} className="border border-border bg-white p-5">
          <EditableBlock title="advantage" selected={selectedField.startsWith("adv") || selectedField.startsWith("advantage_")} onSelect={() => setSelectedField("advantage_title")}>
            <h3 className="font-display text-2xl font-bold text-navy-deep">{String(form.advantage_title ?? "")}</h3>
          </EditableBlock>
        </section>
      );
    }

    return (
      <section key={id} className="border border-border bg-navy-deep p-5 text-white">
        <EditableBlock title="cta" selected={selectedField.startsWith("cta_")} onSelect={() => setSelectedField("cta_title")}>
          <h3 className="font-display text-2xl font-bold">{String(form.cta_title ?? "")}</h3>
          <p className="mt-2 text-sm text-silver/80">{String(form.cta_desc ?? "")}</p>
          <span className="mt-3 inline-flex bg-white px-3 py-1 text-sm text-navy-deep">{String(form.cta_button ?? "")}</span>
        </EditableBlock>
      </section>
    );
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-mid-blue/30 bg-mid-blue/5 px-4 py-2 text-sm font-medium text-navy-deep">
        首页可视化编辑器已加载
      </div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-4 rounded-md border border-border bg-silver/10 p-4">
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Home Preview (click a section)</div>
        {order.map((id) => sectionPreview(id))}
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
            {EDITABLE_FIELDS.map((f) => (
              <option key={f.key} value={f.key}>
                {f.label}
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
  );
}
