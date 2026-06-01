import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import {
  adminListInquiries,
  adminDeleteInquiry,
  updateInquiry,
} from "@/lib/site.functions";

function fmt(iso: string) {
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

const STATUS_LABEL: Record<string, string> = {
  pending: "未处理",
  contacted: "已联系",
  done: "已完成",
};

export function InquiriesPanel({ token }: { token: string }) {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-inquiries"],
    queryFn: () => adminListInquiries({ data: { password: token } }),
  });
  const items = data?.items ?? [];

  const update = async (id: string, patch: { status?: string; admin_note?: string }) => {
    try {
      await updateInquiry({
        data: { password: token, id, ...(patch as { status?: "pending" | "contacted" | "done"; admin_note?: string }) },
      });
      qc.invalidateQueries({ queryKey: ["admin-inquiries"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "操作失败");
    }
  };
  const remove = async (id: string) => {
    if (!confirm("确定删除？")) return;
    await adminDeleteInquiry({ data: { password: token, id } });
    qc.invalidateQueries({ queryKey: ["admin-inquiries"] });
  };

  if (isLoading) return <div className="py-12 text-muted-foreground">加载中...</div>;
  if (items.length === 0)
    return (
      <div className="border border-dashed border-border bg-white p-16 text-center text-muted-foreground">
        暂无询盘
      </div>
    );

  return (
    <div className="space-y-3">
      {items.map((q) => (
        <InquiryRow key={q.id} q={q} onUpdate={(p) => update(q.id, p)} onDelete={() => remove(q.id)} />
      ))}
    </div>
  );
}

function InquiryRow({
  q,
  onUpdate,
  onDelete,
}: {
  q: Record<string, unknown>;
  onUpdate: (p: { status?: string; admin_note?: string }) => void;
  onDelete: () => void;
}) {
  const status = String(q.status ?? "pending");
  const [note, setNote] = useState(String(q.admin_note ?? ""));
  const color =
    status === "done"
      ? "bg-silver/40 text-muted-foreground"
      : status === "contacted"
        ? "bg-amber-100 text-amber-800"
        : "bg-mid-blue/20 text-mid-blue";

  return (
    <div className={`border bg-white p-6 ${status === "done" ? "border-border opacity-80" : "border-mid-blue/40"}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-display text-lg font-bold text-navy-deep">{String(q.name)}</span>
            {q.company ? <span className="text-sm text-muted-foreground">@ {String(q.company)}</span> : null}
            <span className={`rounded-sm px-2 py-0.5 text-xs ${color}`}>{STATUS_LABEL[status] ?? status}</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
            {q.phone ? <span>电话：{String(q.phone)}</span> : null}
            {q.email ? <span>邮箱：{String(q.email)}</span> : null}
            <span>时间：{fmt(String(q.created_at))}</span>
          </div>
          <p className="mt-4 whitespace-pre-wrap text-sm text-navy-deep">{String(q.message)}</p>
        </div>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto]">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onBlur={() => note !== q.admin_note && onUpdate({ admin_note: note })}
          rows={2}
          placeholder="备注（自动保存）"
          className="w-full border border-border bg-white px-3 py-2 text-sm text-navy-deep outline-none focus:border-mid-blue"
        />
        <div className="flex flex-wrap items-start gap-2">
          <select
            value={status}
            onChange={(e) => onUpdate({ status: e.target.value })}
            className="border border-border bg-white px-3 py-2 text-sm text-navy-deep"
          >
            <option value="pending">未处理</option>
            <option value="contacted">已联系</option>
            <option value="done">已完成</option>
          </select>
          <button onClick={onDelete} className="inline-flex items-center gap-1 border border-border px-3 py-2 text-xs text-red-600 hover:bg-red-50">
            <Trash2 size={14} /> 删除
          </button>
        </div>
      </div>
    </div>
  );
}
