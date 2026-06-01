import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import {
  getHomeContent,
  updateHomeContent,
  adminListCapabilities,
  upsertCapability,
  deleteCapability,
} from "@/lib/site.functions";
import { ImageUpload } from "@/components/site/ImageUpload";
import { Field, TextInput, TextArea, NumberInput, SaveBar } from "./fields";

export function HomePanel({ token }: { token: string }) {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-home"],
    queryFn: () => getHomeContent(),
  });
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [brandsText, setBrandsText] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data?.home) {
      setForm(data.home);
      const b = (data.home as { brands?: string[] }).brands;
      setBrandsText(Array.isArray(b) ? b.join(", ") : "");
    }
  }, [data]);

  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    setSaving(true);
    try {
      const values = {
        ...form,
        brands: brandsText.split(",").map((s) => s.trim()).filter(Boolean),
      };
      await updateHomeContent({ data: { password: token, values } });
      toast.success("已保存");
      qc.invalidateQueries({ queryKey: ["home-content"] });
      qc.invalidateQueries({ queryKey: ["admin-home"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "保存失败");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) return <div className="py-12 text-muted-foreground">加载中...</div>;
  const s = form as Record<string, string | number>;

  return (
    <div className="space-y-8">
      <Section title="Hero 主视觉">
        <ImageUpload label="背景图" value={String(s.hero_image ?? "")} onChange={(v) => set("hero_image", v)} />
        <Field label="英文小标题"><TextInput value={String(s.hero_eyebrow ?? "")} onChange={(v) => set("hero_eyebrow", v)} /></Field>
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="标题第一行"><TextInput value={String(s.hero_title_line1 ?? "")} onChange={(v) => set("hero_title_line1", v)} /></Field>
          <Field label="标题第二行"><TextInput value={String(s.hero_title_line2 ?? "")} onChange={(v) => set("hero_title_line2", v)} /></Field>
          <Field label="斜体强调"><TextInput value={String(s.hero_title_italic ?? "")} onChange={(v) => set("hero_title_italic", v)} /></Field>
        </div>
        <Field label="介绍文案"><TextArea rows={3} value={String(s.hero_intro ?? "")} onChange={(v) => set("hero_intro", v)} /></Field>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="主按钮文字"><TextInput value={String(s.btn_explore ?? "")} onChange={(v) => set("btn_explore", v)} /></Field>
          <Field label="次按钮文字"><TextInput value={String(s.btn_contact ?? "")} onChange={(v) => set("btn_contact", v)} /></Field>
        </div>
      </Section>

      <Section title="数据统计">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="英文小标题"><TextInput value={String(s.stats_eyebrow ?? "")} onChange={(v) => set("stats_eyebrow", v)} /></Field>
          <Field label="标题 (支持\\n换行)"><TextInput value={String(s.stats_title ?? "")} onChange={(v) => set("stats_title", v)} /></Field>
        </div>
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="grid gap-4 md:grid-cols-3">
            <Field label={`数字 ${n}`}><NumberInput value={Number(s[`stat${n}_value`] ?? 0)} onChange={(v) => set(`stat${n}_value`, v)} /></Field>
            <Field label="后缀"><TextInput value={String(s[`stat${n}_suffix`] ?? "")} onChange={(v) => set(`stat${n}_suffix`, v)} /></Field>
            <Field label="说明"><TextInput value={String(s[`stat${n}_label`] ?? "")} onChange={(v) => set(`stat${n}_label`, v)} /></Field>
          </div>
        ))}
      </Section>

      <Section title="核心能力区头">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="英文小标题"><TextInput value={String(s.capabilities_eyebrow ?? "")} onChange={(v) => set("capabilities_eyebrow", v)} /></Field>
          <Field label="标题"><TextInput value={String(s.capabilities_title ?? "")} onChange={(v) => set("capabilities_title", v)} /></Field>
        </div>
        <Field label="描述"><TextArea rows={2} value={String(s.capabilities_desc ?? "")} onChange={(v) => set("capabilities_desc", v)} /></Field>
        <p className="text-xs text-muted-foreground">能力卡片在下方「核心能力卡片」单独管理。</p>
      </Section>

      <Section title="客户品牌">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="英文小标题"><TextInput value={String(s.clients_eyebrow ?? "")} onChange={(v) => set("clients_eyebrow", v)} /></Field>
          <Field label="标题"><TextInput value={String(s.clients_title ?? "")} onChange={(v) => set("clients_title", v)} /></Field>
        </div>
        <Field label="品牌列表 (逗号分隔)" hint="例如：SAMSUNG, HUAWEI, XIAOMI">
          <TextInput value={brandsText} onChange={setBrandsText} />
        </Field>
      </Section>

      <Section title="核心优势">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="英文小标题"><TextInput value={String(s.advantage_eyebrow ?? "")} onChange={(v) => set("advantage_eyebrow", v)} /></Field>
          <Field label="标题"><TextInput value={String(s.advantage_title ?? "")} onChange={(v) => set("advantage_title", v)} /></Field>
        </div>
        {[1, 2].map((n) => (
          <div key={n} className="border border-border bg-silver/10 p-4">
            <div className="mb-3 text-xs font-medium uppercase tracking-wider text-mid-blue">优势卡片 {n}</div>
            <ImageUpload label="图片" value={String(s[`adv${n}_image`] ?? "")} onChange={(v) => set(`adv${n}_image`, v)} />
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              <Field label="标签"><TextInput value={String(s[`adv${n}_tag`] ?? "")} onChange={(v) => set(`adv${n}_tag`, v)} /></Field>
              <Field label="标题"><TextInput value={String(s[`adv${n}_title`] ?? "")} onChange={(v) => set(`adv${n}_title`, v)} /></Field>
            </div>
            <Field label="描述"><TextArea rows={3} value={String(s[`adv${n}_desc`] ?? "")} onChange={(v) => set(`adv${n}_desc`, v)} /></Field>
          </div>
        ))}
      </Section>

      <Section title="底部 CTA">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="英文小标题"><TextInput value={String(s.cta_eyebrow ?? "")} onChange={(v) => set("cta_eyebrow", v)} /></Field>
          <Field label="标题"><TextInput value={String(s.cta_title ?? "")} onChange={(v) => set("cta_title", v)} /></Field>
        </div>
        <Field label="描述"><TextArea rows={2} value={String(s.cta_desc ?? "")} onChange={(v) => set("cta_desc", v)} /></Field>
        <Field label="按钮文字"><TextInput value={String(s.cta_button ?? "")} onChange={(v) => set("cta_button", v)} /></Field>
      </Section>

      <SaveBar saving={saving} onSave={save} />

      <Section title="核心能力卡片">
        <CapabilitiesEditor token={token} />
      </Section>
    </div>
  );
}

function CapabilitiesEditor({ token }: { token: string }) {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-caps"],
    queryFn: () => adminListCapabilities({ data: { password: token } }),
  });
  const items = data?.items ?? [];

  const save = async (id: string | null, values: Record<string, unknown>) => {
    try {
      await upsertCapability({ data: { password: token, id, values } });
      toast.success("已保存");
      qc.invalidateQueries({ queryKey: ["admin-caps"] });
      qc.invalidateQueries({ queryKey: ["home-content"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "保存失败");
    }
  };
  const remove = async (id: string) => {
    if (!confirm("确定删除？")) return;
    await deleteCapability({ data: { password: token, id } });
    qc.invalidateQueries({ queryKey: ["admin-caps"] });
    qc.invalidateQueries({ queryKey: ["home-content"] });
  };

  if (isLoading) return <div className="text-muted-foreground">加载中...</div>;

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <CapabilityCard key={item.id} item={item} onSave={(v) => save(item.id, v)} onDelete={() => remove(item.id)} />
      ))}
      <button
        type="button"
        onClick={() => save(null, { title: "新能力", description: "", icon: "Cpu", sort_order: items.length, visible: true })}
        className="inline-flex items-center gap-2 border border-dashed border-border bg-white px-4 py-2 text-sm text-navy-deep hover:bg-silver/30"
      >
        <Plus size={14} /> 新增能力卡片
      </button>
    </div>
  );
}

function CapabilityCard({
  item,
  onSave,
  onDelete,
}: {
  item: Record<string, unknown>;
  onSave: (v: Record<string, unknown>) => void;
  onDelete: () => void;
}) {
  const [f, setF] = useState(item);
  const set = (k: string, v: unknown) => setF((p) => ({ ...p, [k]: v }));
  const s = f as Record<string, string | number | boolean>;
  return (
    <div className="border border-border bg-white p-5">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="标题"><TextInput value={String(s.title ?? "")} onChange={(v) => set("title", v)} /></Field>
        <Field label="图标名 (lucide)" hint="例如：Cpu, Cog, ShieldCheck, Zap"><TextInput value={String(s.icon ?? "")} onChange={(v) => set("icon", v)} /></Field>
      </div>
      <Field label="描述"><TextArea rows={2} value={String(s.description ?? "")} onChange={(v) => set("description", v)} /></Field>
      <ImageUpload label="图片 (可选)" value={String(s.image ?? "")} onChange={(v) => set("image", v)} />
      <div className="mt-3 grid gap-4 md:grid-cols-3">
        <Field label="排序"><NumberInput value={Number(s.sort_order ?? 0)} onChange={(v) => set("sort_order", v)} /></Field>
        <label className="mt-6 inline-flex items-center gap-2 text-sm">
          <input type="checkbox" checked={Boolean(s.visible)} onChange={(e) => set("visible", e.target.checked)} />
          显示
        </label>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <button onClick={onDelete} className="inline-flex items-center gap-1 border border-border px-3 py-2 text-xs text-red-600 hover:bg-red-50">
          <Trash2 size={14} /> 删除
        </button>
        <button onClick={() => onSave(f)} className="inline-flex items-center gap-1 bg-navy-deep px-4 py-2 text-xs font-medium text-white hover:bg-navy">
          保存
        </button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-border bg-white p-6">
      <h3 className="mb-5 font-display text-lg font-bold text-navy-deep">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

// silence unused import warnings
void ChevronUp;
void ChevronDown;
