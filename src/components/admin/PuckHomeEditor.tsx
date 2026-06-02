import { useCallback, useEffect, useMemo, useState } from "react";
import { Puck, Render, type Data } from "@measured/puck";
import "@measured/puck/puck.css";
import { buildPuckConfig, defaultPuckData, isValidPuckData } from "@/lib/puck-config";
import { getAdminToken } from "@/lib/admin-auth";
import { getHomePuckData, saveHomePuckData, uploadFont } from "@/lib/site.functions";

const LOCAL_KEY = "puck-home-editor-prototype";
const FONTS_KEY = "custom-fonts";

type CustomFont = { name: string; url: string };

function loadFontsFromStorage(): CustomFont[] {
  try {
    const raw = localStorage.getItem(FONTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((f) => f && typeof f.name === "string" && typeof f.url === "string");
  } catch {
    return [];
  }
}

function injectFontFaces(fonts: CustomFont[]) {
  const styleId = "puck-custom-fonts";
  let el = document.getElementById(styleId) as HTMLStyleElement | null;
  if (!el) {
    el = document.createElement("style");
    el.id = styleId;
    document.head.appendChild(el);
  }
  el.textContent = fonts
    .map(
      (f) => `@font-face { font-family: "${f.name.replace(/"/g, "")}"; src: url("${f.url}"); font-display: swap; }`,
    )
    .join("\n");
}

function fileToBase64(file: File): Promise<{ base64: string; contentType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const r = reader.result as string;
      const base64 = r.split(",")[1] ?? "";
      resolve({ base64, contentType: file.type || "application/octet-stream" });
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function PuckHomeEditor() {
  const [initialData, setInitialData] = useState<Data | null>(null);
  const [previewData, setPreviewData] = useState<Data | null>(null);
  const [currentData, setCurrentData] = useState<Data | null>(null);
  const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [fonts, setFonts] = useState<CustomFont[]>([]);
  const [newFontName, setNewFontName] = useState("");

  // Load fonts & data on mount
  useEffect(() => {
    const f = loadFontsFromStorage();
    setFonts(f);
    injectFontFaces(f);
    (async () => {
      try {
        const { puck_data } = await getHomePuckData();
        if (isValidPuckData(puck_data)) {
          setInitialData(puck_data);
          setPreviewData(puck_data);
          setCurrentData(puck_data);
          return;
        }
      } catch (e) {
        console.warn("[Puck] 读取远程数据失败，尝试本地草稿", e);
      }
      try {
        const raw = localStorage.getItem(LOCAL_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as Data;
          if (isValidPuckData(parsed)) {
            setInitialData(parsed);
            setPreviewData(parsed);
            setCurrentData(parsed);
            return;
          }
        }
      } catch {
        // ignore
      }
      setInitialData(defaultPuckData);
      setPreviewData(defaultPuckData);
      setCurrentData(defaultPuckData);
    })();
  }, []);

  const showToast = useCallback((type: "ok" | "err", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 2500);
  }, []);

  const handleChange = useCallback((data: Data) => {
    setCurrentData(data);
  }, []);

  const handleSaveDraft = useCallback(async () => {
    if (!currentData) return;
    setBusy(true);
    try {
      try {
        localStorage.setItem(LOCAL_KEY, JSON.stringify(currentData));
      } catch {/* quota */}
      const token = getAdminToken();
      if (token) {
        await saveHomePuckData({ data: { password: token, puck_data: currentData } });
      }
      setPreviewData(currentData);
      showToast("ok", "草稿已保存");
    } catch (e) {
      showToast("err", `保存草稿失败：${(e as Error).message}`);
    } finally {
      setBusy(false);
    }
  }, [currentData, showToast]);

  const handlePublish = useCallback(async () => {
    if (!currentData) return;
    setBusy(true);
    try {
      const token = getAdminToken();
      if (!token) throw new Error("未登录");
      await saveHomePuckData({ data: { password: token, puck_data: currentData } });
      try {
        localStorage.setItem(LOCAL_KEY, JSON.stringify(currentData));
      } catch {/* quota */}
      setPreviewData(currentData);
      showToast("ok", "已发布到首页");
    } catch (e) {
      showToast("err", `发布失败：${(e as Error).message}`);
    } finally {
      setBusy(false);
    }
  }, [currentData, showToast]);

  const handleRevertToFallback = useCallback(async () => {
    if (!confirm("确定将线上首页恢复为旧版渲染逻辑？（清除拖拽数据）")) return;
    setBusy(true);
    try {
      const token = getAdminToken();
      if (!token) throw new Error("未登录");
      await saveHomePuckData({ data: { password: token, puck_data: null } });
      showToast("ok", "已恢复为旧版渲染");
    } catch (e) {
      showToast("err", `操作失败：${(e as Error).message}`);
    } finally {
      setBusy(false);
    }
  }, [showToast]);

  const handleFontUpload = useCallback(async (file: File) => {
    if (!newFontName.trim()) {
      showToast("err", "请先填写字体名称");
      return;
    }
    if (!/\.(woff2|woff|ttf|otf)$/i.test(file.name)) {
      showToast("err", "仅支持 .woff2 / .woff / .ttf / .otf");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      showToast("err", "字体文件不能超过 10MB");
      return;
    }
    const token = getAdminToken();
    if (!token) {
      showToast("err", "未登录");
      return;
    }
    setBusy(true);
    try {
      const { base64, contentType } = await fileToBase64(file);
      const { url } = await uploadFont({
        data: { password: token, filename: file.name, contentType, base64 },
      });
      const next = [...fonts.filter((f) => f.name !== newFontName.trim()), { name: newFontName.trim(), url }];
      setFonts(next);
      localStorage.setItem(FONTS_KEY, JSON.stringify(next));
      injectFontFaces(next);
      setNewFontName("");
      showToast("ok", "字体已上传");
    } catch (e) {
      showToast("err", `上传失败：${(e as Error).message}`);
    } finally {
      setBusy(false);
    }
  }, [fonts, newFontName, showToast]);

  const handleRemoveFont = useCallback((name: string) => {
    const next = fonts.filter((f) => f.name !== name);
    setFonts(next);
    localStorage.setItem(FONTS_KEY, JSON.stringify(next));
    injectFontFaces(next);
  }, [fonts]);

  const fontListText = useMemo(
    () => (fonts.length === 0 ? "暂无自定义字体，上传后可在区块字段中填写字体名称使用。" : ""),
    [fonts],
  );

  if (!initialData) {
    return <div className="p-8 text-sm text-muted-foreground">加载中…</div>;
  }

  return (
    <div className="space-y-4">
      <style>{`
        /* Make Puck preview elements feel clickable */
        .puck-preview-hover [data-puck-component]:hover { outline: 2px dashed #3b82f6; outline-offset: 2px; cursor: pointer; }
        /* Ensure Puck内部左右侧栏可独立滚动，避免 outline / 字段面板被截断 */
        .puck-editor-shell .Puck { height: 100% !important; }
        .puck-editor-shell .Puck-sideBar,
        .puck-editor-shell .Puck-leftSideBar,
        .puck-editor-shell .Puck-rightSideBar { overflow-y: auto !important; max-height: 100%; }
        .puck-editor-shell [class*="PuckLayout-leftSideBar"],
        .puck-editor-shell [class*="PuckLayout-rightSideBar"] { overflow-y: auto !important; }
        .puck-editor-shell [class*="SidebarSection"] { overflow: visible; }
      `}</style>


      <div className="rounded-sm border border-border bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-navy-deep">首页拖拽编辑器</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              发布前仅在编辑器中预览；点击"发布到首页"后，线上首页将使用拖拽编辑器内容。
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleSaveDraft}
              disabled={busy}
              className="border border-border bg-white px-4 py-2 text-sm text-navy-deep hover:bg-silver/30 disabled:opacity-50"
            >
              保存草稿
            </button>
            <button
              onClick={handlePublish}
              disabled={busy}
              className="bg-mid-blue px-4 py-2 text-sm font-medium text-white hover:bg-mid-blue/90 disabled:opacity-50"
            >
              发布到首页
            </button>
            <button
              onClick={handleRevertToFallback}
              disabled={busy}
              className="border border-border bg-white px-3 py-2 text-xs text-muted-foreground hover:bg-silver/30 disabled:opacity-50"
              title="清除拖拽数据，前台首页恢复使用旧版渲染逻辑"
            >
              恢复旧版渲染
            </button>
          </div>
        </div>
      </div>

      {toast && (
        <div
          className={`rounded-sm border px-4 py-3 text-sm ${
            toast.type === "ok"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {toast.msg}
        </div>
      )}

      {/* Fonts panel */}
      <div className="rounded-sm border border-border bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-bold text-navy-deep">字体设置</h3>
          <span className="text-xs text-muted-foreground">支持 .woff2 / .woff / .ttf / .otf，单个文件 ≤ 10MB</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            placeholder="字体名称（例如 MyBrandFont）"
            value={newFontName}
            onChange={(e) => setNewFontName(e.target.value)}
            className="border border-border bg-white px-3 py-2 text-sm"
          />
          <label className="cursor-pointer border border-border bg-white px-3 py-2 text-sm text-navy-deep hover:bg-silver/30">
            选择字体文件
            <input
              type="file"
              accept=".woff2,.woff,.ttf,.otf"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFontUpload(f);
                e.currentTarget.value = "";
              }}
            />
          </label>
        </div>
        {fontListText && <p className="mt-3 text-xs text-muted-foreground">{fontListText}</p>}
        {fonts.length > 0 && (
          <ul className="mt-3 space-y-2">
            {fonts.map((f) => (
              <li key={f.name} className="flex items-center justify-between border border-border bg-silver/20 px-3 py-2 text-sm">
                <div>
                  <span className="font-mono text-xs text-muted-foreground">{f.name}</span>
                  <span className="ml-3 text-base" style={{ fontFamily: `"${f.name}"` }}>
                    预览：景鸿科技 The quick brown fox 1234567890
                  </span>
                </div>
                <button
                  onClick={() => handleRemoveFont(f.name)}
                  className="text-xs text-red-600 hover:underline"
                >
                  移除
                </button>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-3 text-xs text-mid-blue">
          在每个区块的"标题字体 / 正文字体"字段中填写上方字体名称即可应用。
        </p>
      </div>

      {/* Puck editor */}
      <div
        className="puck-editor-shell overflow-hidden rounded-sm border border-border bg-white puck-preview-hover"
        style={{ height: "90vh", minHeight: 820 }}
      >
        <Puck
          config={puckConfig}
          data={initialData}
          onChange={handleChange}
          onPublish={handleSaveDraft}
          overrides={{
            puck: ({ children }) => <div className="h-full">{children}</div>,
          }}
          headerTitle="首页拖拽编辑器"
          headerPath="点击右上角保存草稿 / 发布到首页"
        />
      </div>

      {/* Render preview (collapsible so it doesn't crowd editor panels) */}
      <details className="rounded-sm border border-border bg-white p-4">
        <summary className="cursor-pointer text-sm font-bold text-navy-deep">
          渲染预览（最近一次保存） — 点击展开/收起
        </summary>
        <p className="mt-2 text-xs text-muted-foreground">该预览即发布后线上首页的样子</p>
        <div className="mt-3 overflow-hidden rounded-sm border border-border">
          {previewData && <Render config={puckConfig} data={previewData} />}
        </div>
      </details>
    </div>
  );
}
