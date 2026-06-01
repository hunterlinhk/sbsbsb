import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import {
  adminListProducts,
  upsertProduct,
  deleteProduct,
  adminListSteps,
  upsertStep,
  deleteStep,
} from "@/lib/site.functions";
import { ImageUpload } from "@/components/site/ImageUpload";
import { Field, TextInput, TextArea, NumberInput } from "./fields";

export function ProductsPanel({ token }: { token: string }) {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: () => adminListProducts({ data: { password: token } }),
  });
  const items = data?.items ?? [];

  const save = async (id: string | null, values: Record<string, unknown>) => {
    try {
      await upsertProduct({ data: { password: token, id, values } });
      toast.success("已保存");
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      qc.invalidateQueries({ queryKey: ["products-page"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "保存失败");
    }
  };
  const remove = async (id: string) => {
    if (!confirm("确定删除该产品？")) return;
    await deleteProduct({ data: { password: token, id } });
    qc.invalidateQueries({ queryKey: ["admin-products"] });
    qc.invalidateQueries({ queryKey: ["products-page"] });
  };

  if (isLoading) return <div className="py-12 text-muted-foreground">加载中...</div>;

  return (
    <div className="space-y-4">
      {items.map((p) => (
        <ProductCard key={p.id} item={p} onSave={(v) => save(p.id, v)} onDelete={() => remove(p.id)} />
      ))}
      <button
        type="button"
        onClick={() =>
          save(null, {
            name: "新产品",
            name_en: "",
            intro: "",
            features: [],
            applications: "",
            process: "",
            cover_url: "",
            sort_order: items.length,
            published: true,
          })
        }
        className="inline-flex items-center gap-2 border border-dashed border-border bg-white px-4 py-3 text-sm text-navy-deep hover:bg-silver/30"
      >
        <Plus size={14} /> 新增产品
      </button>
    </div>
  );
}

function ProductCard({
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
  const s = f as Record<string, unknown>;
  const [featText, setFeatText] = useState(
    Array.isArray(s.features) ? (s.features as string[]).join("\n") : "",
  );

  return (
    <div className="border border-border bg-white p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="产品名称 *"><TextInput value={String(s.name ?? "")} onChange={(v) => set("name", v)} /></Field>
        <Field label="英文名"><TextInput value={String(s.name_en ?? "")} onChange={(v) => set("name_en", v)} /></Field>
      </div>
      <ImageUpload label="封面图片" value={String(s.cover_url ?? "")} onChange={(v) => set("cover_url", v)} />
      <Field label="产品简介"><TextArea rows={3} value={String(s.intro ?? "")} onChange={(v) => set("intro", v)} /></Field>
      <Field label="产品特性 (每行一条)">
        <TextArea rows={4} value={featText} onChange={setFeatText} />
      </Field>
      <Field label="应用领域"><TextArea rows={2} value={String(s.applications ?? "")} onChange={(v) => set("applications", v)} /></Field>
      <Field label="制造工艺"><TextArea rows={2} value={String(s.process ?? "")} onChange={(v) => set("process", v)} /></Field>
      <div className="mt-3 grid gap-4 md:grid-cols-3">
        <Field label="排序"><NumberInput value={Number(s.sort_order ?? 0)} onChange={(v) => set("sort_order", v)} /></Field>
        <label className="mt-6 inline-flex items-center gap-2 text-sm">
          <input type="checkbox" checked={Boolean(s.published)} onChange={(e) => set("published", e.target.checked)} />
          发布
        </label>
        <label className="mt-6 inline-flex items-center gap-2 text-sm">
          <input type="checkbox" checked={Boolean(s.featured)} onChange={(e) => set("featured", e.target.checked)} />
          精选
        </label>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <button onClick={onDelete} className="inline-flex items-center gap-1 border border-border px-3 py-2 text-xs text-red-600 hover:bg-red-50">
          <Trash2 size={14} /> 删除
        </button>
        <button
          onClick={() => {
            const features = featText.split("\n").map((s) => s.trim()).filter(Boolean);
            onSave({ ...f, features });
          }}
          className="inline-flex items-center gap-1 bg-navy-deep px-4 py-2 text-xs font-medium text-white hover:bg-navy"
        >
          保存
        </button>
      </div>
    </div>
  );
}

export function ProcessPanel({ token }: { token: string }) {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-steps"],
    queryFn: () => adminListSteps({ data: { password: token } }),
  });
  const items = data?.items ?? [];

  const save = async (id: string | null, values: Record<string, unknown>) => {
    try {
      await upsertStep({ data: { password: token, id, values } });
      toast.success("已保存");
      qc.invalidateQueries({ queryKey: ["admin-steps"] });
      qc.invalidateQueries({ queryKey: ["products-page"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "保存失败");
    }
  };
  const remove = async (id: string) => {
    if (!confirm("确定删除？")) return;
    await deleteStep({ data: { password: token, id } });
    qc.invalidateQueries({ queryKey: ["admin-steps"] });
    qc.invalidateQueries({ queryKey: ["products-page"] });
  };

  if (isLoading) return <div className="py-12 text-muted-foreground">加载中...</div>;

  return (
    <div className="space-y-4">
      {items.map((it) => (
        <StepCard key={it.id} item={it} onSave={(v) => save(it.id, v)} onDelete={() => remove(it.id)} />
      ))}
      <button
        type="button"
        onClick={() =>
          save(null, { step_no: String(items.length + 1).padStart(2, "0"), title: "新步骤", description: "", sort_order: items.length, visible: true })
        }
        className="inline-flex items-center gap-2 border border-dashed border-border bg-white px-4 py-3 text-sm text-navy-deep hover:bg-silver/30"
      >
        <Plus size={14} /> 新增步骤
      </button>
    </div>
  );
}

function StepCard({
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
      <div className="grid gap-4 md:grid-cols-3">
        <Field label="编号"><TextInput value={String(s.step_no ?? "")} onChange={(v) => set("step_no", v)} /></Field>
        <Field label="标题"><TextInput value={String(s.title ?? "")} onChange={(v) => set("title", v)} /></Field>
        <Field label="排序"><NumberInput value={Number(s.sort_order ?? 0)} onChange={(v) => set("sort_order", v)} /></Field>
      </div>
      <Field label="描述"><TextArea rows={2} value={String(s.description ?? "")} onChange={(v) => set("description", v)} /></Field>
      <label className="mt-3 inline-flex items-center gap-2 text-sm">
        <input type="checkbox" checked={Boolean(s.visible)} onChange={(e) => set("visible", e.target.checked)} />
        显示
      </label>
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
