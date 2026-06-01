import type { ReactNode } from "react";

export const inputCls =
  "mt-1 w-full border border-border bg-white px-3 py-2 text-sm text-navy-deep outline-none focus:border-mid-blue";

export function Field({
  label,
  children,
  hint,
  className = "",
}: {
  label: string;
  children: ReactNode;
  hint?: string;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="text-xs font-medium uppercase tracking-wider text-navy-deep">
        {label}
      </span>
      {children}
      {hint ? (
        <span className="mt-1 block text-[11px] text-muted-foreground">{hint}</span>
      ) : null}
    </label>
  );
}

export function TextInput({
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <input
      type={type}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={inputCls}
    />
  );
}

export function NumberInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <input
      type="number"
      value={Number.isFinite(value) ? value : 0}
      onChange={(e) => onChange(Number(e.target.value) || 0)}
      className={inputCls}
    />
  );
}

export function TextArea({
  value,
  onChange,
  rows = 4,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <textarea
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      placeholder={placeholder}
      className={inputCls}
    />
  );
}

export function SaveBar({
  saving,
  onSave,
  label = "保存修改",
}: {
  saving: boolean;
  onSave: () => void;
  label?: string;
}) {
  return (
    <div className="sticky bottom-0 mt-8 flex justify-end border-t border-border bg-white/95 py-4 backdrop-blur">
      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="inline-flex items-center gap-2 bg-navy-deep px-6 py-3 text-sm font-medium text-white transition-all hover:bg-navy disabled:opacity-60"
      >
        {saving ? "保存中..." : label}
      </button>
    </div>
  );
}
