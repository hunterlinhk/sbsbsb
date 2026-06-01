import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";
import { uploadImage } from "@/lib/site.functions";
import { getAdminToken } from "@/lib/admin-auth";

export function ImageUpload({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) {
      toast.error("图片大小不能超过 5MB");
      return;
    }
    setBusy(true);
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => {
          const s = String(r.result);
          resolve(s.split(",")[1] || "");
        };
        r.onerror = reject;
        r.readAsDataURL(f);
      });
      const token = getAdminToken() || "";
      const res = await uploadImage({
        data: { password: token, filename: f.name, contentType: f.type || "image/jpeg", base64 },
      });
      onChange(res.url);
      toast.success("图片已上传");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "上传失败");
    } finally {
      setBusy(false);
      if (ref.current) ref.current.value = "";
    }
  };

  return (
    <div className="mt-2 space-y-2">
      {label ? (
        <div className="text-xs font-medium uppercase tracking-wider text-navy-deep">{label}</div>
      ) : null}
      <div className="flex flex-wrap items-start gap-3">
        {value ? (
          <div className="relative">
            <img src={value} alt="" className="h-24 w-24 border border-border object-cover" />
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-white text-red-600 shadow"
            >
              <X size={12} />
            </button>
          </div>
        ) : null}
        <button
          type="button"
          onClick={() => ref.current?.click()}
          disabled={busy}
          className="inline-flex h-24 min-w-[6rem] flex-col items-center justify-center gap-1 border border-dashed border-border bg-white px-4 text-xs text-muted-foreground hover:border-navy-deep disabled:opacity-50"
        >
          <Upload size={16} />
          {busy ? "上传中..." : value ? "替换图片" : "上传图片"}
        </button>
        <input
          ref={ref}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onPick}
        />
      </div>
      <input
        type="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="或填写图片 URL"
        className="w-full border border-border bg-white px-3 py-2 text-xs text-navy-deep outline-none focus:border-mid-blue"
      />
    </div>
  );
}
