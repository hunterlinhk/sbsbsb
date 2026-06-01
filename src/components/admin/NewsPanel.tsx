import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import {
  adminListAllNews,
  upsertNews,
  adminDeleteNews,
} from "@/lib/site.functions";
import { ImageUpload } from "@/components/site/ImageUpload";
import { Field, TextInput, TextArea } from "./fields";

export function NewsPanel({ token }: { token: string }) {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-news"],
    queryFn: () => adminListAllNews({ data: { password: token } }),
  });
  const items = data?.items ?? [];

  const save = async (id: string | null, values: Record<string, unknown>) => {
    try {
      await upsertNews({ data: { password: token, id, values } });
      toast.success("已保存");
      qc.invalidateQueries({ queryKey: ["admin-news"] });
      qc.invalidateQueries({ queryKey: ["public-news"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "保存失败");
    }
  };
  const remove = async (id: string) => {
    if (!confirm("确定删除该新闻？")) return;
    await adminDeleteNews({ data: { password: token, id } });
    qc.invalidateQueries({ queryKey: ["admin-news"] });
    qc.invalidateQueries({ queryKey: ["public-news"] });
  };

  if (isLoading) return <div className="py-12 text-muted-foreground">加载中...</div>;

  return (
    <div className="space-y-4">
      {items.map((n) => (
        <NewsCard key={n.id} item={n} onSave={(v) => save(n.id, v)} onDelete={() => remove(n.id)} />
      ))}
      <button
        type="button"
        onClick={() =>
          save(null, {
            title: "新文章",
            summary: "",
            content: "",
            cover_url: "",
            published: false,
            published_date: new Date().toISOString().slice(0, 10),
          })
        }
        className="inline-flex items-center gap-2 border border-dashed border-border bg-white px-4 py-3 text-sm text-navy-deep hover:bg-silver/30"
      >
        <Plus size={14} /> 新增新闻
      </button>
    </div>
  );
}

function NewsCard({
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

  return (
    <div className="border border-border bg-white p-6">
      <Field label="标题 *"><TextInput value={String(s.title ?? "")} onChange={(v) => set("title", v)} /></Field>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="发布日期">
          <TextInput
            type="date"
            value={String(s.published_date ?? "").slice(0, 10)}
            onChange={(v) => set("published_date", v || null)}
          />
        </Field>
        <label className="mt-7 inline-flex items-center gap-2 text-sm">
          <input type="checkbox" checked={Boolean(s.published)} onChange={(e) => set("published", e.target.checked)} />
          发布上线
        </label>
      </div>
      <ImageUpload label="封面图片" value={String(s.cover_url ?? "")} onChange={(v) => set("cover_url", v)} />
      <Field label="摘要"><TextArea rows={2} value={String(s.summary ?? "")} onChange={(v) => set("summary", v)} /></Field>
      <Field label="正文 *"><TextArea rows={10} value={String(s.content ?? "")} onChange={(v) => set("content", v)} /></Field>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="SEO 标题"><TextInput value={String(s.seo_title ?? "")} onChange={(v) => set("seo_title", v)} /></Field>
        <Field label="SEO 描述"><TextInput value={String(s.seo_desc ?? "")} onChange={(v) => set("seo_desc", v)} /></Field>
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
