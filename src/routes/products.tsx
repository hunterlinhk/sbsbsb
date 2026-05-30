import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import coilImg from "@/assets/product-coil.jpg";
import motorImg from "@/assets/product-motor.jpg";
import workshopImg from "@/assets/workshop.jpg";
import qualityImg from "@/assets/quality.jpg";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "产品中心 — 精密线圈与微型直线电机 | 景鸿科技" },
      {
        name: "description",
        content:
          "景鸿科技产品中心：精密线圈（月产2000万个）、微型直线电机，配套自动化制造流程，应用于手机摄像头、震动反馈、无线充电等核心模组。",
      },
      { property: "og:title", content: "产品中心 — 景鸿科技" },
      { property: "og:description", content: "精密线圈与微型直线电机产品矩阵。" },
      { property: "og:image", content: coilImg },
    ],
  }),
  component: ProductsPage,
});

const products = [
  {
    img: coilImg,
    tag: "Precision Coils",
    name: "精密线圈",
    desc: "依托50余台日特绕线机，提供多规格高精度线圈解决方案，月产能达2000万个，广泛应用于消费电子、智能手机模组等核心场景。",
    specs: [
      "线径范围：超细微米级线材",
      "结构类型：空心线圈、骨架线圈、自粘线圈等",
      "应用领域：摄像头VCM、震动马达、无线充电等",
      "月产能：2000万个",
    ],
  },
  {
    img: motorImg,
    tag: "Linear Motors",
    name: "微型直线电机",
    desc: "精密微型直线电机，应用于手机摄像头自动对焦 (VCM)、触觉反馈等核心模组，结合自动化组装产线确保稳定品质。",
    specs: [
      "尺寸：毫米级微型结构",
      "应用：摄像头AF/OIS、震动反馈",
      "性能：高响应速度、低噪音",
      "工艺：自动化组装+全检",
    ],
  },
];

const processes = [
  { step: "01", name: "精密绕线", desc: "日特绕线机集群" },
  { step: "02", name: "焊锡处理", desc: "高精度自动化焊接" },
  { step: "03", name: "摆盘整理", desc: "标准化排列输送" },
  { step: "04", name: "外观检查", desc: "自动视觉检测" },
  { step: "05", name: "自动组装", desc: "全自动产线集成" },
  { step: "06", name: "品质检测", desc: "全检+抽检双保险" },
];

function ProductsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Page hero */}
        <section className="relative overflow-hidden bg-navy-deep pt-32 pb-20 text-white lg:pt-44 lg:pb-28">
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `url(${workshopImg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/70 via-navy-deep/85 to-navy-deep" />
          <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
            <Reveal>
              <div className="text-xs font-medium uppercase tracking-[0.3em] text-mid-blue">
                Product Center
              </div>
              <h1 className="mt-4 max-w-3xl font-display text-5xl font-bold leading-[1.05] md:text-7xl">
                精密制造
                <br />
                <span className="italic text-mid-blue">产品矩阵</span>
              </h1>
              <p className="mt-8 max-w-2xl text-base leading-relaxed text-silver/80 md:text-lg">
                覆盖精密线圈与微型直线电机两大核心产品线，
                以稳定的产能和严苛的品质标准服务全球知名手机品牌。
              </p>
            </Reveal>
          </div>
        </section>

        {/* Product cards */}
        <section className="bg-background py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="space-y-20 lg:space-y-32">
              {products.map((p, i) => (
                <Reveal key={p.name}>
                  <article
                    className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${
                      i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
                    }`}
                  >
                    <div className="relative overflow-hidden bg-navy-deep">
                      <img
                        src={p.img}
                        alt={p.name}
                        loading="lazy"
                        className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-105"
                      />
                    </div>
                    <div>
                      <div className="text-xs font-medium uppercase tracking-[0.3em] text-mid-blue">
                        {p.tag}
                      </div>
                      <h2 className="mt-4 font-display text-4xl font-bold leading-tight text-navy-deep md:text-5xl">
                        {p.name}
                      </h2>
                      <div className="mt-6 h-px w-16 bg-navy-deep" />
                      <p className="mt-6 text-base leading-relaxed text-muted-foreground">
                        {p.desc}
                      </p>
                      <ul className="mt-8 space-y-3">
                        {p.specs.map((s) => (
                          <li key={s} className="flex items-start gap-3 text-sm text-navy-deep">
                            <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-mid-blue" />
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                      <Link
                        to="/contact"
                        className="mt-10 inline-flex items-center gap-2 bg-navy-deep px-6 py-3 text-sm font-medium text-white transition-all hover:bg-navy"
                      >
                        咨询详情 <ArrowRight size={14} />
                      </Link>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Manufacturing process */}
        <section className="relative overflow-hidden bg-navy-deep py-24 text-white lg:py-32">
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: `url(${qualityImg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
            <Reveal className="mb-16 max-w-2xl">
              <div className="text-xs font-medium uppercase tracking-[0.3em] text-mid-blue">
                Manufacturing Process
              </div>
              <h2 className="mt-4 font-display text-4xl font-bold leading-tight md:text-5xl">
                六步精密制造流程
              </h2>
              <p className="mt-6 text-silver/80">
                从原材料绕线到成品出厂，每一道工序都由自动化设备与专业团队协同完成。
              </p>
            </Reveal>
            <div className="grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
              {processes.map((p, i) => (
                <Reveal key={p.step} delay={i * 0.05}>
                  <div className="group flex h-full flex-col gap-3 bg-navy-deep p-8 transition-colors hover:bg-navy lg:p-10">
                    <div className="font-display text-5xl font-bold text-mid-blue/40 transition-colors group-hover:text-mid-blue">
                      {p.step}
                    </div>
                    <h3 className="font-display text-xl font-bold text-white">{p.name}</h3>
                    <p className="text-sm text-silver/70">{p.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Capabilities banner */}
        <section className="bg-background py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <Reveal>
              <div className="grid items-center gap-10 border border-border bg-white p-10 lg:grid-cols-3 lg:p-16">
                <div className="lg:col-span-2">
                  <h3 className="font-display text-3xl font-bold leading-tight text-navy-deep md:text-4xl">
                    需要定制化的精密线圈方案？
                  </h3>
                  <p className="mt-4 text-muted-foreground">
                    我们的工程团队可根据您的产品需求，提供从打样到量产的一站式精密线圈制造服务。
                  </p>
                </div>
                <Link
                  to="/contact"
                  className="inline-flex w-fit items-center gap-2 bg-mid-blue px-7 py-4 text-sm font-medium text-white transition-all hover:bg-navy-deep lg:justify-self-end"
                >
                  发送询价 <ArrowRight size={16} />
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}