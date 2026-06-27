import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, CheckCircle2, Cog, Cpu, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import coilImg from "@/assets/product-coil.jpg";
import { getProductBySlug } from "@/lib/site.functions";

type SubProduct = { title: string; description: string; specs?: string[] };
type Stat = { value: string; label: string };
type Advantage = { title: string; description: string };
type Scenario = { name: string; description: string };
type SpecRow = { name: string; value: string };

type FeaturesShape = {
  hero_subtitle?: string;
  stats?: Stat[];
  overview?: string[];
  sub_products?: SubProduct[];
  advantages?: Advantage[];
  scenarios?: Scenario[];
  spec_table?: SpecRow[];
};

const ADV_ICONS = [Cog, Cpu, ShieldCheck, Sparkles, Zap, CheckCircle2];

export const Route = createFileRoute("/products/$slug")({
  loader: async ({ params }) => {
    const res = await getProductBySlug({ data: { slug: params.slug } });
    if (!res.product) throw notFound();
    return res;
  },
  head: ({ loaderData }) => {
    const p = loaderData?.product;
    const title = p ? `${p.name} — 景鸿科技` : "产品详情 — 景鸿科技";
    const desc = p?.intro ?? "景鸿科技精密线圈产品详情。";
    return {
      meta: [
        { title },
        { name: "description", content: desc.slice(0, 155) },
        { property: "og:title", content: title },
        { property: "og:description", content: desc.slice(0, 155) },
        { property: "og:image", content: p?.cover_url || coilImg },
      ],
    };
  },
  component: ProductDetailPage,
  errorComponent: ({ error }) => (
    <div className="p-10 text-center text-navy-deep">加载失败：{error.message}</div>
  ),
  notFoundComponent: () => (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-32 text-center">
        <h1 className="font-display text-3xl font-bold text-navy-deep">未找到该产品</h1>
        <Link to="/products" className="mt-6 inline-flex items-center gap-2 text-mid-blue">
          <ArrowLeft size={16} /> 返回产品中心
        </Link>
      </main>
      <Footer />
    </div>
  ),
});

function parseFeatures(raw: unknown): FeaturesShape {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    // legacy: array of {title, description}
    if (Array.isArray(raw)) {
      return { sub_products: raw as SubProduct[] };
    }
    return {};
  }
  return raw as FeaturesShape;
}

function ProductDetailPage() {
  const { slug } = Route.useParams();
  const initial = Route.useLoaderData();
  const { data } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => getProductBySlug({ data: { slug } }),
    initialData: initial,
    staleTime: 60_000,
  });
  const p = data?.product;
  if (!p) return null;

  const f = parseFeatures(p.features);
  const subs = f.sub_products ?? [];
  const stats = f.stats ?? [];
  const overview = f.overview ?? [];
  const advantages = f.advantages ?? [];
  const scenarios = f.scenarios ?? [];
  const specTable = f.spec_table ?? [];
  const img = p.cover_url || coilImg;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* HERO */}
        <section className="relative overflow-hidden bg-navy-deep pt-32 pb-20 text-white lg:pt-44 lg:pb-28">
          <div
            className="absolute inset-0 opacity-25"
            style={{ backgroundImage: `url(${img})`, backgroundSize: "cover", backgroundPosition: "center" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/75 via-navy-deep/90 to-navy-deep" />
          <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
            <Link to="/products" className="inline-flex items-center gap-2 text-sm text-silver/70 transition-colors hover:text-white">
              <ArrowLeft size={14} /> 返回产品中心
            </Link>
            <Reveal>
              {f.hero_subtitle ? (
                <div className="mt-8 text-xs font-medium uppercase tracking-[0.3em] text-mid-blue">{f.hero_subtitle}</div>
              ) : p.name_en ? (
                <div className="mt-8 text-xs font-medium uppercase tracking-[0.3em] text-mid-blue">{p.name_en}</div>
              ) : null}
              <h1 className="mt-4 max-w-4xl font-display text-5xl font-bold leading-[1.1] md:text-6xl">{p.name}</h1>
              <p className="mt-6 max-w-3xl text-base leading-relaxed text-silver/85 md:text-lg">{p.intro}</p>
            </Reveal>

            {stats.length > 0 && (
              <Reveal>
                <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden border border-white/10 bg-white/10 md:grid-cols-4">
                  {stats.map((s) => (
                    <div key={s.label} className="bg-navy-deep p-6">
                      <div className="font-display text-3xl font-bold text-white md:text-4xl">{s.value}</div>
                      <div className="mt-2 text-xs text-silver/70 md:text-sm">{s.label}</div>
                    </div>
                  ))}
                </div>
              </Reveal>
            )}
          </div>
        </section>

        {/* OVERVIEW */}
        {overview.length > 0 && (
          <section className="bg-background py-20 lg:py-24">
            <div className="mx-auto max-w-7xl px-6 lg:px-10">
              <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">
                <Reveal>
                  <div className="text-xs font-medium uppercase tracking-[0.3em] text-mid-blue">Overview</div>
                  <h2 className="mt-4 font-display text-3xl font-bold text-navy-deep md:text-4xl">产品概述</h2>
                  <div className="mt-4 h-px w-16 bg-navy-deep" />
                </Reveal>
                <div className="space-y-5">
                  {overview.map((para, i) => (
                    <Reveal key={i} delay={i * 0.05}>
                      <p className="text-base leading-relaxed text-muted-foreground md:text-lg">{para}</p>
                    </Reveal>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* SUB PRODUCTS */}
        {subs.length > 0 && (
          <section className="bg-silver/20 py-20 lg:py-28">
            <div className="mx-auto max-w-7xl px-6 lg:px-10">
              <Reveal>
                <div className="text-xs font-medium uppercase tracking-[0.3em] text-mid-blue">Product Series</div>
                <h2 className="mt-4 font-display text-3xl font-bold text-navy-deep md:text-4xl">产品系列</h2>
                <div className="mt-4 h-px w-16 bg-navy-deep" />
              </Reveal>
              <div className="mt-12 grid gap-6 md:grid-cols-2">
                {subs.map((s, i) => (
                  <Reveal key={s.title} delay={i * 0.05}>
                    <article className="group flex h-full flex-col border border-border bg-white p-8 transition-all hover:-translate-y-1 hover:border-mid-blue hover:shadow-xl lg:p-10">
                      <div className="flex items-center gap-3">
                        <span className="font-display text-3xl font-bold text-mid-blue/50 transition-colors group-hover:text-mid-blue">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <h3 className="font-display text-xl font-bold text-navy-deep md:text-2xl">{s.title}</h3>
                      </div>
                      <p className="mt-5 text-sm leading-relaxed text-muted-foreground md:text-base">{s.description}</p>
                      {s.specs && s.specs.length > 0 && (
                        <ul className="mt-6 grid grid-cols-2 gap-2 border-t border-border pt-5">
                          {s.specs.map((spec) => (
                            <li key={spec} className="flex items-start gap-2 text-xs text-navy-deep md:text-sm">
                              <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-mid-blue" />
                              <span>{spec}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </article>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ADVANTAGES */}
        {advantages.length > 0 && (
          <section className="bg-background py-20 lg:py-28">
            <div className="mx-auto max-w-7xl px-6 lg:px-10">
              <Reveal>
                <div className="text-xs font-medium uppercase tracking-[0.3em] text-mid-blue">Advantages</div>
                <h2 className="mt-4 font-display text-3xl font-bold text-navy-deep md:text-4xl">技术优势</h2>
                <div className="mt-4 h-px w-16 bg-navy-deep" />
              </Reveal>
              <div className="mt-12 grid gap-px overflow-hidden bg-border md:grid-cols-2 lg:grid-cols-4">
                {advantages.map((a, i) => {
                  const Icon = ADV_ICONS[i % ADV_ICONS.length];
                  return (
                    <Reveal key={a.title} delay={i * 0.05}>
                      <div className="h-full bg-white p-8">
                        <Icon size={32} className="text-mid-blue" />
                        <h3 className="mt-5 font-display text-lg font-bold text-navy-deep">{a.title}</h3>
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{a.description}</p>
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* SCENARIOS */}
        {scenarios.length > 0 && (
          <section className="bg-navy-deep py-20 text-white lg:py-28">
            <div className="mx-auto max-w-7xl px-6 lg:px-10">
              <Reveal>
                <div className="text-xs font-medium uppercase tracking-[0.3em] text-mid-blue">Applications</div>
                <h2 className="mt-4 font-display text-3xl font-bold md:text-4xl">典型应用场景</h2>
                <div className="mt-4 h-px w-16 bg-mid-blue" />
              </Reveal>
              <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {scenarios.map((s, i) => (
                  <Reveal key={s.name} delay={i * 0.05}>
                    <div className="h-full border border-white/10 bg-white/5 p-6 transition-colors hover:border-mid-blue hover:bg-white/10">
                      <h3 className="font-display text-lg font-bold text-white">{s.name}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-silver/70">{s.description}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* SPEC TABLE */}
        {specTable.length > 0 && (
          <section className="bg-background py-20 lg:py-28">
            <div className="mx-auto max-w-7xl px-6 lg:px-10">
              <Reveal>
                <div className="text-xs font-medium uppercase tracking-[0.3em] text-mid-blue">Specifications</div>
                <h2 className="mt-4 font-display text-3xl font-bold text-navy-deep md:text-4xl">工艺参数</h2>
                <div className="mt-4 h-px w-16 bg-navy-deep" />
              </Reveal>
              <Reveal>
                <div className="mt-12 overflow-hidden border border-border">
                  <table className="w-full">
                    <tbody>
                      {specTable.map((row, i) => (
                        <tr
                          key={row.name}
                          className={i % 2 === 0 ? "bg-white" : "bg-silver/20"}
                        >
                          <td className="w-1/3 border-r border-border px-6 py-4 text-sm font-medium text-navy-deep md:text-base">
                            {row.name}
                          </td>
                          <td className="px-6 py-4 text-sm text-muted-foreground md:text-base">{row.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Reveal>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="bg-silver/30 py-20 lg:py-24">
          <div className="mx-auto max-w-4xl px-6 text-center lg:px-10">
            <Reveal>
              <h2 className="font-display text-3xl font-bold text-navy-deep md:text-4xl">
                需要 {p.name} 的定制方案？
              </h2>
              <p className="mt-5 text-base text-muted-foreground md:text-lg">
                提供从样品打样、模具开发到规模量产的全流程服务，欢迎联系工程团队获取技术支持与报价。
              </p>
              <Link
                to="/contact"
                className="mt-10 inline-flex items-center gap-2 bg-navy-deep px-8 py-4 text-sm font-medium text-white transition-all hover:bg-mid-blue"
              >
                咨询此类产品 <ArrowRight size={14} />
              </Link>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
