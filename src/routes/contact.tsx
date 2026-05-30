import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "联系我们 — 景鸿科技" },
      {
        name: "description",
        content: "联系东莞市景鸿科技有限公司，地址：东莞市凤岗镇，咨询精密线圈与微型直线电机制造业务。",
      },
      { property: "og:title", content: "联系我们 — 景鸿科技" },
      { property: "og:description", content: "凤岗镇精密线圈制造服务商。" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      toast.success("已收到您的询盘，我们会尽快与您联系！");
      (e.target as HTMLFormElement).reset();
      setSubmitting(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="relative overflow-hidden bg-navy-deep pt-32 pb-20 text-white lg:pt-44 lg:pb-28">
          <div className="absolute inset-0 opacity-30" style={{
            backgroundImage: "radial-gradient(circle at 30% 40%, var(--mid-blue) 0%, transparent 50%)"
          }} />
          <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
            <Reveal>
              <div className="text-xs font-medium uppercase tracking-[0.3em] text-mid-blue">
                Get in Touch
              </div>
              <h1 className="mt-4 max-w-3xl font-display text-5xl font-bold leading-[1.05] md:text-7xl">
                联系
                <span className="italic text-mid-blue">景鸿</span>
              </h1>
              <p className="mt-8 max-w-2xl text-base leading-relaxed text-silver/80 md:text-lg">
                无论是产品咨询、样品申请，还是参观工厂，我们都期待与您建立联系。
              </p>
            </Reveal>
          </div>
        </section>

        <section className="bg-background py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="grid gap-16 lg:grid-cols-5">
              {/* Info column */}
              <Reveal className="lg:col-span-2">
                <div className="text-xs font-medium uppercase tracking-[0.3em] text-mid-blue">
                  Contact Info
                </div>
                <h2 className="mt-4 font-display text-3xl font-bold text-navy-deep md:text-4xl">
                  随时联系我们
                </h2>
                <ul className="mt-10 space-y-6">
                  {[
                    { icon: MapPin, title: "公司地址", lines: ["广东省东莞市凤岗镇"] },
                    { icon: Phone, title: "联系电话", lines: ["请通过表单联系获取"] },
                    { icon: Mail, title: "商务邮箱", lines: ["请通过表单联系获取"] },
                    { icon: Clock, title: "营业时间", lines: ["周一至周六 09:00 - 18:00"] },
                  ].map((c) => (
                    <li key={c.title} className="flex gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-navy-deep text-white">
                        <c.icon size={20} strokeWidth={1.5} />
                      </div>
                      <div>
                        <div className="font-display text-base font-bold text-navy-deep">{c.title}</div>
                        {c.lines.map((l) => (
                          <div key={l} className="mt-1 text-sm text-muted-foreground">{l}</div>
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              </Reveal>

              {/* Form column */}
              <Reveal className="lg:col-span-3" delay={0.15}>
                <form onSubmit={onSubmit} className="border border-border bg-white p-8 lg:p-12">
                  <h3 className="font-display text-2xl font-bold text-navy-deep">发送询盘</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    填写以下信息，我们会在 1 个工作日内回复您。
                  </p>
                  <div className="mt-8 grid gap-6 sm:grid-cols-2">
                    <Field label="您的姓名 *" name="name" required />
                    <Field label="公司名称" name="company" />
                    <Field label="联系电话 *" name="phone" required />
                    <Field label="邮箱 *" name="email" type="email" required />
                  </div>
                  <div className="mt-6">
                    <Field label="询盘内容 *" name="message" required textarea />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="mt-8 inline-flex items-center gap-2 bg-navy-deep px-7 py-4 text-sm font-medium text-white transition-all hover:bg-navy disabled:opacity-60"
                  >
                    {submitting ? "发送中..." : "发送询盘"} <Send size={14} />
                  </button>
                </form>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Map placeholder */}
        <section className="bg-silver/40">
          <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
            <Reveal>
              <div className="flex aspect-[21/7] items-center justify-center border border-border bg-gradient-to-br from-navy-deep to-navy text-white">
                <div className="text-center">
                  <MapPin size={40} className="mx-auto text-mid-blue" strokeWidth={1.5} />
                  <div className="mt-4 font-display text-2xl font-bold">广东省东莞市凤岗镇</div>
                  <div className="mt-2 text-sm text-silver/70">东莞市景鸿科技有限公司</div>
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

function Field({
  label,
  name,
  type = "text",
  required,
  textarea,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  textarea?: boolean;
}) {
  const cls =
    "mt-2 w-full border border-border bg-white px-4 py-3 text-sm text-navy-deep outline-none transition-colors focus:border-mid-blue";
  return (
    <label className="block">
      <span className="text-xs font-medium uppercase tracking-wider text-navy-deep">{label}</span>
      {textarea ? (
        <textarea name={name} required={required} rows={5} className={cls} />
      ) : (
        <input type={type} name={name} required={required} className={cls} />
      )}
    </label>
  );
}