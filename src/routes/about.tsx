import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { Counter } from "@/components/site/Counter";
import workshopImg from "@/assets/workshop.jpg";
import heroFactory from "@/assets/hero-factory.jpg";
import { getAboutContent } from "@/lib/site.functions";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "关于我们 — 东莞市景鸿科技有限公司" },
      { name: "description", content: "东莞市景鸿科技有限公司位于东莞市凤岗镇，专注精密线圈制造。" },
      { property: "og:title", content: "关于我们 — 景鸿科技" },
      { property: "og:image", content: workshopImg },
    ],
  }),
  component: AboutPage,
});

function renderMarkdown(text: string) {
  // very simple **bold** + paragraph splitter
  return text.split(/\n\n+/).map((para, i) => {
    const parts = para.split(/(\*\*[^*]+\*\*)/g);
    return (
      <p key={i}>
        {parts.map((p, j) =>
          p.startsWith("**") && p.endsWith("**") ? (
            <strong key={j} className="text-navy-deep">{p.slice(2, -2)}</strong>
          ) : (
            <span key={j}>{p}</span>
          ),
        )}
      </p>
    );
  });
}

function AboutPage() {
  const { data } = useQuery({
    queryKey: ["about-content"],
    queryFn: () => getAboutContent(),
    staleTime: 60_000,
  });
  const a = data?.item;
  const heroImg = a?.hero_image || heroFactory;
  const workshop = a?.workshop_image || workshopImg;
  const stats = [
    { v: a?.stat1_value ?? 1800, s: a?.stat1_suffix ?? "㎡", l: a?.stat1_label ?? "车间面积" },
    { v: a?.stat2_value ?? 90, s: a?.stat2_suffix ?? "+", l: a?.stat2_label ?? "员工人数" },
    { v: a?.stat3_value ?? 50, s: a?.stat3_suffix ?? "+", l: a?.stat3_label ?? "绕线机" },
    { v: a?.stat4_value ?? 30, s: a?.stat4_suffix ?? "+", l: a?.stat4_label ?? "配套设备" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="relative overflow-hidden bg-navy-deep pt-32 pb-20 text-white lg:pt-44 lg:pb-28">
          <div className="absolute inset-0 opacity-25" style={{ backgroundImage: `url(${heroImg})`, backgroundSize: "cover", backgroundPosition: "center" }} />
          <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/60 via-navy-deep/85 to-navy-deep" />
          <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
            <Reveal>
              <div className="text-xs font-medium uppercase tracking-[0.3em] text-mid-blue">{a?.page_eyebrow || "About Us"}</div>
              <h1 className="mt-4 max-w-3xl font-display text-5xl font-bold leading-[1.05] md:text-7xl">
                {a?.page_title_line1 || "精密制造的"}<br />
                <span className="italic text-mid-blue">{a?.page_title_line2 || "坚守者"}</span>
              </h1>
            </Reveal>
          </div>
        </section>

        <section className="bg-background py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="grid gap-16 lg:grid-cols-12">
              <Reveal className="lg:col-span-5">
                <div className="text-xs font-medium uppercase tracking-[0.3em] text-mid-blue">{a?.story_eyebrow || "Our Story"}</div>
                <h2 className="mt-4 font-display text-4xl font-bold leading-tight text-navy-deep md:text-5xl">{a?.story_title || "专注精密线圈制造"}</h2>
              </Reveal>
              <Reveal className="lg:col-span-7" delay={0.15}>
                <div className="space-y-6 text-base leading-relaxed text-muted-foreground">
                  {a?.story_body ? renderMarkdown(a.story_body) : null}
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="bg-navy-deep text-white">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
            <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((x, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <div>
                    <div className="font-display text-5xl font-bold md:text-6xl">
                      <Counter to={x.v} suffix={x.s} />
                    </div>
                    <div className="mt-4 h-px w-12 bg-mid-blue" />
                    <div className="mt-4 text-sm text-silver/70">{x.l}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-background py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <Reveal>
              <div className="overflow-hidden">
                <img src={workshop} alt={a?.workshop_title || "智能化车间"} loading="lazy" className="aspect-[16/9] w-full object-cover" />
              </div>
              <div className="mt-8 max-w-2xl">
                <div className="text-xs font-medium uppercase tracking-[0.3em] text-mid-blue">{a?.workshop_eyebrow || "Smart Factory"}</div>
                <h2 className="mt-4 font-display text-3xl font-bold text-navy-deep md:text-4xl">{a?.workshop_title || "智能化精密制造车间"}</h2>
                <p className="mt-4 text-muted-foreground">{a?.workshop_desc}</p>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
