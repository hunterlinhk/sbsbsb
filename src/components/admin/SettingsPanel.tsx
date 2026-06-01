import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getSiteSettings,
  updateSiteSettings,
  getAboutContent,
  updateAboutContent,
  getContactContent,
  updateContactContent,
} from "@/lib/site.functions";
import { ImageUpload } from "@/components/site/ImageUpload";
import { Field, TextInput, TextArea, NumberInput, SaveBar } from "./fields";

type Row = Record<string, unknown>;

function useEntity(key: string, fetcher: () => Promise<{ item: Row | null }>) {
  const { data, isLoading } = useQuery({ queryKey: [key], queryFn: fetcher });
  const [form, setForm] = useState<Row>({});
  useEffect(() => {
    if (data?.item) setForm(data.item);
  }, [data]);
  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));
  return { form, set, isLoading };
}

export function SiteSettingsPanel({ token }: { token: string }) {
  const qc = useQueryClient();
  const { form, set, isLoading } = useEntity("admin-site-settings", () =>
    getSiteSettings(),
  );
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await updateSiteSettings({ data: { password: token, values: form } });
      toast.success("已保存");
      qc.invalidateQueries({ queryKey: ["site-settings"] });
      qc.invalidateQueries({ queryKey: ["admin-site-settings"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "保存失败");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) return <div className="py-12 text-muted-foreground">加载中...</div>;

  const s = form as Record<string, string>;
  return (
    <div className="space-y-8">
      <Section title="品牌">
        <ImageUpload
          label="网站 Logo"
          value={s.logo_url ?? ""}
          onChange={(v) => set("logo_url", v)}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="公司名称">
            <TextInput value={s.company_name ?? ""} onChange={(v) => set("company_name", v)} />
          </Field>
          <Field label="英文名称">
            <TextInput value={s.company_name_en ?? ""} onChange={(v) => set("company_name_en", v)} />
          </Field>
        </div>
      </Section>

      <Section title="导航文字">
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="首页"><TextInput value={s.nav_home ?? ""} onChange={(v) => set("nav_home", v)} /></Field>
          <Field label="产品中心"><TextInput value={s.nav_products ?? ""} onChange={(v) => set("nav_products", v)} /></Field>
          <Field label="新闻资讯"><TextInput value={s.nav_news ?? ""} onChange={(v) => set("nav_news", v)} /></Field>
          <Field label="关于我们"><TextInput value={s.nav_about ?? ""} onChange={(v) => set("nav_about", v)} /></Field>
          <Field label="联系我们"><TextInput value={s.nav_contact ?? ""} onChange={(v) => set("nav_contact", v)} /></Field>
          <Field label="CTA 按钮"><TextInput value={s.nav_cta ?? ""} onChange={(v) => set("nav_cta", v)} /></Field>
        </div>
      </Section>

      <Section title="页脚">
        <Field label="公司简介">
          <TextArea value={s.footer_intro ?? ""} onChange={(v) => set("footer_intro", v)} rows={3} />
        </Field>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="标语"><TextInput value={s.footer_slogan ?? ""} onChange={(v) => set("footer_slogan", v)} /></Field>
          <Field label="版权 (可用 {year})"><TextInput value={s.footer_copyright ?? ""} onChange={(v) => set("footer_copyright", v)} /></Field>
        </div>
      </Section>

      <Section title="联系方式">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="地址"><TextInput value={s.address ?? ""} onChange={(v) => set("address", v)} /></Field>
          <Field label="电话"><TextInput value={s.phone ?? ""} onChange={(v) => set("phone", v)} /></Field>
          <Field label="邮箱"><TextInput value={s.email ?? ""} onChange={(v) => set("email", v)} /></Field>
          <Field label="营业时间"><TextInput value={s.business_hours ?? ""} onChange={(v) => set("business_hours", v)} /></Field>
        </div>
      </Section>

      <SaveBar saving={saving} onSave={save} />
    </div>
  );
}

export function AboutPanel({ token }: { token: string }) {
  const qc = useQueryClient();
  const { form, set, isLoading } = useEntity("admin-about", () => getAboutContent());
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await updateAboutContent({ data: { password: token, values: form } });
      toast.success("已保存");
      qc.invalidateQueries({ queryKey: ["about-content"] });
      qc.invalidateQueries({ queryKey: ["admin-about"] });
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
      <Section title="页头">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="小标题 (英文)"><TextInput value={String(s.page_eyebrow ?? "")} onChange={(v) => set("page_eyebrow", v)} /></Field>
          <div />
          <Field label="主标题第一行"><TextInput value={String(s.page_title_line1 ?? "")} onChange={(v) => set("page_title_line1", v)} /></Field>
          <Field label="主标题第二行"><TextInput value={String(s.page_title_line2 ?? "")} onChange={(v) => set("page_title_line2", v)} /></Field>
        </div>
        <ImageUpload label="Hero 背景图" value={String(s.hero_image ?? "")} onChange={(v) => set("hero_image", v)} />
      </Section>

      <Section title="公司故事">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="英文小标题"><TextInput value={String(s.story_eyebrow ?? "")} onChange={(v) => set("story_eyebrow", v)} /></Field>
          <Field label="故事标题"><TextInput value={String(s.story_title ?? "")} onChange={(v) => set("story_title", v)} /></Field>
        </div>
        <Field label="故事正文 (支持换行)"><TextArea rows={8} value={String(s.story_body ?? "")} onChange={(v) => set("story_body", v)} /></Field>
      </Section>

      <Section title="数据统计">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="grid gap-4 md:grid-cols-3">
            <Field label={`数字 ${n}`}><NumberInput value={Number(s[`stat${n}_value`] ?? 0)} onChange={(v) => set(`stat${n}_value`, v)} /></Field>
            <Field label="后缀"><TextInput value={String(s[`stat${n}_suffix`] ?? "")} onChange={(v) => set(`stat${n}_suffix`, v)} /></Field>
            <Field label="说明"><TextInput value={String(s[`stat${n}_label`] ?? "")} onChange={(v) => set(`stat${n}_label`, v)} /></Field>
          </div>
        ))}
      </Section>

      <Section title="车间区块">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="英文小标题"><TextInput value={String(s.workshop_eyebrow ?? "")} onChange={(v) => set("workshop_eyebrow", v)} /></Field>
          <Field label="标题"><TextInput value={String(s.workshop_title ?? "")} onChange={(v) => set("workshop_title", v)} /></Field>
        </div>
        <Field label="描述"><TextArea rows={3} value={String(s.workshop_desc ?? "")} onChange={(v) => set("workshop_desc", v)} /></Field>
        <ImageUpload label="车间图片" value={String(s.workshop_image ?? "")} onChange={(v) => set("workshop_image", v)} />
      </Section>

      <SaveBar saving={saving} onSave={save} />
    </div>
  );
}

export function ContactPanel({ token }: { token: string }) {
  const qc = useQueryClient();
  const { form, set, isLoading } = useEntity("admin-contact", () => getContactContent());
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await updateContactContent({ data: { password: token, values: form } });
      toast.success("已保存");
      qc.invalidateQueries({ queryKey: ["contact-content"] });
      qc.invalidateQueries({ queryKey: ["admin-contact"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "保存失败");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) return <div className="py-12 text-muted-foreground">加载中...</div>;
  const s = form as Record<string, string>;

  return (
    <div className="space-y-8">
      <Section title="页面头部">
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="英文小标题"><TextInput value={s.page_eyebrow ?? ""} onChange={(v) => set("page_eyebrow", v)} /></Field>
          <Field label="主标题"><TextInput value={s.page_title ?? ""} onChange={(v) => set("page_title", v)} /></Field>
          <Field label="主标题斜体部分"><TextInput value={s.page_title_italic ?? ""} onChange={(v) => set("page_title_italic", v)} /></Field>
        </div>
        <Field label="介绍文案"><TextArea rows={2} value={s.page_intro ?? ""} onChange={(v) => set("page_intro", v)} /></Field>
      </Section>

      <Section title="联系信息区">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="英文小标题"><TextInput value={s.info_eyebrow ?? ""} onChange={(v) => set("info_eyebrow", v)} /></Field>
          <Field label="标题"><TextInput value={s.info_title ?? ""} onChange={(v) => set("info_title", v)} /></Field>
        </div>
        <p className="text-xs text-muted-foreground">地址、电话、邮箱、营业时间在「基础设置」中修改。</p>
      </Section>

      <Section title="询盘表单">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="表单标题"><TextInput value={s.form_title ?? ""} onChange={(v) => set("form_title", v)} /></Field>
          <Field label="表单提示"><TextInput value={s.form_intro ?? ""} onChange={(v) => set("form_intro", v)} /></Field>
        </div>
      </Section>

      <Section title="地图区块">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="主文字"><TextInput value={s.map_title ?? ""} onChange={(v) => set("map_title", v)} /></Field>
          <Field label="副文字"><TextInput value={s.map_subtitle ?? ""} onChange={(v) => set("map_subtitle", v)} /></Field>
        </div>
      </Section>

      <SaveBar saving={saving} onSave={save} />
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
