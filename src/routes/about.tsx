import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { Counter } from "@/components/site/Counter";
import workshopImg from "@/assets/workshop.jpg";
import heroFactory from "@/assets/hero-factory.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "关于我们 — 东莞市景鸿科技有限公司" },
      {
        name: "description",
        content:
          "东莞市景鸿科技有限公司位于东莞市凤岗镇，专注精密线圈和微型直线电机制造，车间1800㎡，员工90余人，月产能2000万个。",
      },
      { property: "og:title", content: "关于我们 — 景鸿科技" },
      {
        property: "og:description",
        content: "凤岗镇1800㎡精密制造工厂，融合精益生产与自动化技术。",
      },
      { property: "og:image", content: workshopImg },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="relative overflow-hidden bg-navy-deep pt-32 pb-20 text-white lg:pt-44 lg:pb-28">
          <div
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage: `url(${heroFactory})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/60 via-navy-deep/85 to-navy-deep" />
          <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
            <Reveal>
              <div className="text-xs font-medium uppercase tracking-[0.3em] text-mid-blue">
                About Us
              </div>
              <h1 className="mt-4 max-w-3xl font-display text-5xl font-bold leading-[1.05] md:text-7xl">
                精密制造的
                <br />
                <span className="italic text-mid-blue">坚守者</span>
              </h1>
            </Reveal>
          </div>
        </section>

        <section className="bg-background py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="grid gap-16 lg:grid-cols-12">
              <Reveal className="lg:col-span-5">
                <div className="text-xs font-medium uppercase tracking-[0.3em] text-mid-blue">
                  Our Story
                </div>
                <h2 className="mt-4 font-display text-4xl font-bold leading-tight text-navy-deep md:text-5xl">
                  专注精密线圈制造
                </h2>
              </Reveal>
              <Reveal className="lg:col-span-7" delay={0.15}>
                <div className="space-y-6 text-base leading-relaxed text-muted-foreground">
                  <p>
                    东莞市景鸿科技有限公司位于东莞市凤岗镇，专注于
                    <strong className="text-navy-deep">精密线圈和微型直线电机制造</strong>。
                    公司车间面积 1800 平方米，员工 90 多人，拥有以日特绕线机为主的各种绕线机 50 多台，
                    以及配套的焊锡、摆盘、外观检查、自动组装和品质检测设备 30 多台。
                  </p>
                  <p>
                    目前各型线圈产能达 <strong className="text-navy-deep">2000 万个/月</strong>。
                    终端客户有三星、华为、小米、传音等知名手机厂家。
                  </p>
                  <p>
                    公司通过<strong className="text-navy-deep">精益生产理念</strong>和
                    <strong className="text-navy-deep">自动化技术</strong>的融合运用，
                    为客户提供优质的线圈制造服务。
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Big stats band */}
        <section className="bg-navy-deep text-white">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
            <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { v: 1800, s: "㎡", l: "车间面积" },
                { v: 90, s: "+", l: "员工人数" },
                { v: 50, s: "+", l: "绕线机" },
                { v: 30, s: "+", l: "配套设备" },
              ].map((x, i) => (
                <Reveal key={x.l} delay={i * 0.08}>
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

        {/* Workshop image */}
        <section className="bg-background py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <Reveal>
              <div className="overflow-hidden">
                <img
                  src={workshopImg}
                  alt="景鸿科技智能化车间"
                  loading="lazy"
                  className="aspect-[16/9] w-full object-cover"
                />
              </div>
              <div className="mt-8 max-w-2xl">
                <div className="text-xs font-medium uppercase tracking-[0.3em] text-mid-blue">
                  Smart Factory
                </div>
                <h2 className="mt-4 font-display text-3xl font-bold text-navy-deep md:text-4xl">
                  智能化精密制造车间
                </h2>
                <p className="mt-4 text-muted-foreground">
                  车间布局科学、设备先进，以日特绕线机集群为核心，配套焊锡、摆盘、外观检查、自动组装与品质检测设备，
                  构建从原料到成品的完整智能产线。
                </p>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}