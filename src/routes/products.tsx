import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import coilImg from "@/assets/product-coil.jpg";
import workshopImg from "@/assets/workshop.jpg";
import qualityImg from "@/assets/quality.jpg";
import { getProductsPageData } from "@/lib/site.functions";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "产品中心 — 精密线圈与无线充电线圈 | 景鸿科技" },
      { name: "description", content: "景鸿科技产品中心：VCM线圈、超薄无线充电线圈、中大功率无线充电线圈、智能手表线圈。" },
      { property: "og:title", content: "产品中心 — 景鸿科技" },
      { property: "og:description", content: "精密线圈产品矩阵：VCM、超薄无线充、中大功率无线充、手表线圈。" },
      { property: "og:image", content: coilImg },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const { data } = useQuery({
    queryKey: ["products-page"],
    queryFn: () => getProductsPageData(),
    staleTime: 60_000,
  });
  const products = data?.products ?? [];
  const processes = data?.steps ?? [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="relative overflow-hidden bg-navy-deep pt-32 pb-20 text-white lg:pt-44 lg:pb-28">
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: `url(${workshopImg})`, backgroundSize: "cover", backgroundPosition: "center" }} />
          <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/70 via-navy-deep/85 to-navy-deep" />
          <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
            <Reveal>
              <div className="text-xs font-medium uppercase tracking-[0.3em] text-mid-blue">Product Center</div>
              <h1 className="mt-4 max-w-3xl font-display text-5xl font-bold leading-[1.05] md:text-7xl">
                精密制造<br /><span className="italic text-mid-blue">产品矩阵</span>
              </h1>
              <p className="mt-8 max-w-2xl text-base leading-relaxed text-silver/80 md:text-lg">
                覆盖 VCM 线圈、超薄无线充电线圈、中大功率无线充电线圈与智能手表线圈，以稳定的产能和严苛的品质标准服务全球知名品牌。
              </p>
            </Reveal>
          </div>
        </section>

        <section className="bg-background py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="grid gap-8 md:grid-cols-2">
              {products.map((p) => {
                const img = p.cover_url || coilImg;
                return (
                  <Reveal key={p.id}>
                    <Link
                      to="/products/$slug"
                      params={{ slug: p.slug ?? p.id }}
                      className="group flex h-full flex-col overflow-hidden border border-border bg-white transition-all hover:-translate-y-1 hover:shadow-2xl"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-navy-deep">
                        <img src={img} alt={p.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      </div>
                      <div className="flex flex-1 flex-col p-8">
                        {p.name_en ? (
                          <div className="text-xs font-medium uppercase tracking-[0.3em] text-mid-blue">{p.name_en}</div>
                        ) : null}
                        <h2 className="mt-3 font-display text-2xl font-bold text-navy-deep md:text-3xl">{p.name}</h2>
                        <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{p.intro}</p>
                        <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-navy-deep group-hover:text-mid-blue">
                          查看详情 <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                        </span>
                      </div>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-navy-deep py-24 text-white lg:py-32">
          <div className="absolute inset-0 opacity-15" style={{ backgroundImage: `url(${qualityImg})`, backgroundSize: "cover", backgroundPosition: "center" }} />
          <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
            <Reveal className="mb-16 max-w-2xl">
              <div className="text-xs font-medium uppercase tracking-[0.3em] text-mid-blue">Manufacturing Process</div>
              <h2 className="mt-4 font-display text-4xl font-bold leading-tight md:text-5xl">六步精密制造流程</h2>
              <p className="mt-6 text-silver/80">从原材料绕线到成品出厂，每一道工序都由自动化设备与专业团队协同完成。</p>
            </Reveal>
            <div className="grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
              {processes.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.05}>
                  <div className="group flex h-full flex-col gap-3 bg-navy-deep p-8 transition-colors hover:bg-navy lg:p-10">
                    <div className="font-display text-5xl font-bold text-mid-blue/40 transition-colors group-hover:text-mid-blue">{p.step_no}</div>
                    <h3 className="font-display text-xl font-bold text-white">{p.title}</h3>
                    <p className="text-sm text-silver/70">{p.description}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-background py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <Reveal>
              <div className="grid items-center gap-10 border border-border bg-white p-10 lg:grid-cols-3 lg:p-16">
                <div className="lg:col-span-2">
                  <h3 className="font-display text-3xl font-bold leading-tight text-navy-deep md:text-4xl">需要定制化的精密线圈方案？</h3>
                  <p className="mt-4 text-muted-foreground">我们的工程团队可根据您的产品需求，提供从打样到量产的一站式精密线圈制造服务。</p>
                </div>
                <Link to="/contact" className="inline-flex w-fit items-center gap-2 bg-mid-blue px-7 py-4 text-sm font-medium text-white transition-all hover:bg-navy-deep lg:justify-self-end">
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
