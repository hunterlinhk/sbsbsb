import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";
import { uploadImage } from "@/lib/site.functions";
import { getAdminToken } from "@/lib/admin-auth";

const checkerboardStyle = {
  backgroundColor: "#0f172a",
  backgroundImage:
    "linear-gradient(45deg, rgba(255,255,255,0.08) 25%, transparent 25%), linear-gradient(-45deg, rgba(255,255,255,0.08) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.08) 75%), linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.08) 75%)",
  backgroundSize: "20px 20px",
  backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0",
} as const;

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
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return;
    }

    setBusy(true);
    try {
      const encodedImage = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = String(reader.result);
          resolve(result.split(",")[1] || "");
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const authToken = getAdminToken() || "";
      const res = await uploadImage({
        data: { ["password"]: authToken, filename: file.name, contentType: file.type || "image/jpeg", base64: encodedImage },
      });
      onChange(res.url);
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
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
            <div
              className="flex h-24 w-24 items-center justify-center overflow-hidden border border-border p-2"
              style={checkerboardStyle}
            >
              <img src={value} alt="" className="h-full w-full object-contain" />
            </div>
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
          {busy ? "Uploading..." : value ? "Replace image" : "Upload image"}
        </button>

        <input ref={ref} type="file" accept="image/*" className="hidden" onChange={onPick} />
      </div>

      <input
        type="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Or paste an image URL"
        className="w-full border border-border bg-white px-3 py-2 text-xs text-navy-deep outline-none focus:border-mid-blue"
      />
    </div>
  );
}
