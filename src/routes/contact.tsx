import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { toast } from "sonner";
import { getContactContent, getSiteSettings, submitInquiry } from "@/lib/site.functions";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "联系我们 — 景鸿科技" },
      { name: "description", content: "联系东莞市景鸿科技有限公司，咨询精密线圈与微型直线电机制造业务。" },
      { property: "og:title", content: "联系我们 — 景鸿科技" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const { data: cdata } = useQuery({ queryKey: ["contact-content"], queryFn: () => getContactContent(), staleTime: 60_000 });
  const { data: sdata } = useQuery({ queryKey: ["site-settings"], queryFn: () => getSiteSettings(), staleTime: 60_000 });
  const c = cdata?.item;
  const s = sdata?.item;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const fd = new FormData(form);
    setSubmitting(true);
    try {
      await submitInquiry({
        data: {
          name: String(fd.get("name") || ""),
          company: String(fd.get("company") || "") || null,
          phone: String(fd.get("phone") || "") || null,
          email: String(fd.get("email") || "") || null,
          message: String(fd.get("message") || ""),
        },
      });
      toast.success("已收到您的询盘，我们会尽快与您联系！");
      form.reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "提交失败，请稍后再试");
    } finally {
      setSubmitting(false);
    }
  };

  const infos = [
    { icon: MapPin, title: "公司地址", value: s?.address || "广东省东莞市凤岗镇" },
    { icon: Phone, title: "联系电话", value: s?.phone || "请通过表单联系获取" },
    { icon: Mail, title: "商务邮箱", value: s?.email || "请通过表单联系获取" },
    { icon: Clock, title: "营业时间", value: s?.business_hours || "周一至周六 09:00 - 18:00" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="relative overflow-hidden bg-navy-deep pt-32 pb-20 text-white lg:pt-44 lg:pb-28">
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 30% 40%, var(--mid-blue) 0%, transparent 50%)" }} />
          <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
            <Reveal>
              <div className="text-xs font-medium uppercase tracking-[0.3em] text-mid-blue">{c?.page_eyebrow || "Get in Touch"}</div>
              <h1 className="mt-4 max-w-3xl font-display text-5xl font-bold leading-[1.05] md:text-7xl">
                {c?.page_title || "联系"}
                <span className="italic text-mid-blue">{c?.page_title_italic || "景鸿"}</span>
              </h1>
              <p className="mt-8 max-w-2xl text-base leading-relaxed text-silver/80 md:text-lg">{c?.page_intro}</p>
            </Reveal>
          </div>
        </section>

        <section className="bg-background py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="grid gap-16 lg:grid-cols-5">
              <Reveal className="lg:col-span-2">
                <div className="text-xs font-medium uppercase tracking-[0.3em] text-mid-blue">{c?.info_eyebrow || "Contact Info"}</div>
                <h2 className="mt-4 font-display text-3xl font-bold text-navy-deep md:text-4xl">{c?.info_title || "随时联系我们"}</h2>
                <ul className="mt-10 space-y-6">
                  {infos.map((it) => (
                    <li key={it.title} className="flex gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-navy-deep text-white">
                        <it.icon size={20} strokeWidth={1.5} />
                      </div>
                      <div>
                        <div className="font-display text-base font-bold text-navy-deep">{it.title}</div>
                        <div className="mt-1 whitespace-pre-line text-sm text-muted-foreground">{it.value}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal className="lg:col-span-3" delay={0.15}>
                <form onSubmit={onSubmit} className="border border-border bg-white p-8 lg:p-12">
                  <h3 className="font-display text-2xl font-bold text-navy-deep">{c?.form_title || "发送询盘"}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{c?.form_intro || "填写以下信息，我们会在 1 个工作日内回复您。"}</p>
                  <div className="mt-8 grid gap-6 sm:grid-cols-2">
                    <Field label="您的姓名 *" name="name" required />
                    <Field label="公司名称" name="company" />
                    <Field label="联系电话 *" name="phone" required />
                    <Field label="邮箱 *" name="email" type="email" required />
                  </div>
                  <div className="mt-6">
                    <Field label="询盘内容 *" name="message" required textarea />
                  </div>
                  <button type="submit" disabled={submitting}
                    className="mt-8 inline-flex items-center gap-2 bg-navy-deep px-7 py-4 text-sm font-medium text-white transition-all hover:bg-navy disabled:opacity-60">
                    {submitting ? "发送中..." : "发送询盘"} <Send size={14} />
                  </button>
                </form>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="bg-silver/40">
          <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
            <Reveal>
              <div className="flex aspect-[21/7] items-center justify-center border border-border bg-gradient-to-br from-navy-deep to-navy text-white">
                <div className="text-center">
                  <MapPin size={40} className="mx-auto text-mid-blue" strokeWidth={1.5} />
                  <div className="mt-4 font-display text-2xl font-bold">{c?.map_title || "广东省东莞市凤岗镇"}</div>
                  <div className="mt-2 text-sm text-silver/70">{c?.map_subtitle || "东莞市景鸿科技有限公司"}</div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function Field({ label, name, type = "text", required, textarea }: { label: string; name: string; type?: string; required?: boolean; textarea?: boolean }) {
  const cls = "mt-2 w-full border border-border bg-white px-4 py-3 text-sm text-navy-deep outline-none transition-colors focus:border-mid-blue";
  return (
    <label className="block">
      <span className="text-xs font-medium uppercase tracking-wider text-navy-deep">{label}</span>
      {textarea ? <textarea name={name} required={required} rows={5} className={cls} /> : <input type={type} name={name} required={required} className={cls} />}
    </label>
  );
}
