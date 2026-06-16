import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import coilImg from "@/assets/product-coil.jpg";
import { getProductBySlug } from "@/lib/site.functions";

type SubProduct = { title: string; description: string };

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
  const rawFeatures = (p.features as unknown) ?? [];
  const subs: SubProduct[] = Array.isArray(rawFeatures)
    ? (rawFeatures as unknown[]).flatMap((f) => {
        if (f && typeof f === "object" && "title" in f) {
          const obj = f as { title?: unknown; description?: unknown };
          return [{
            title: String(obj.title ?? ""),
            description: String(obj.description ?? ""),
          }];
        }
        if (typeof f === "string") return [{ title: f, description: "" }];
        return [];
      })
    : [];
  const img = p.cover_url || coilImg;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="relative overflow-hidden bg-navy-deep pt-32 pb-16 text-white lg:pt-44 lg:pb-24">
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
              {p.name_en ? (
                <div className="mt-8 text-xs font-medium uppercase tracking-[0.3em] text-mid-blue">{p.name_en}</div>
              ) : null}
              <h1 className="mt-4 max-w-4xl font-display text-5xl font-bold leading-[1.1] md:text-6xl">{p.name}</h1>
              <p className="mt-6 max-w-3xl text-base leading-relaxed text-silver/85 md:text-lg">{p.intro}</p>
            </Reveal>
          </div>
        </section>

        <section className="bg-background py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            {subs.length > 0 ? (
              <>
                <Reveal>
                  <h2 className="font-display text-3xl font-bold text-navy-deep md:text-4xl">产品系列</h2>
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
                      </article>
                    </Reveal>
                  ))}
                </div>
              </>
            ) : (
              <Reveal>
                <p className="text-base text-muted-foreground">该类目产品信息即将上线。</p>
              </Reveal>
            )}

            {(p.applications || p.process) && (
              <Reveal>
                <div className="mt-16 grid gap-6 border-t border-border pt-10 md:grid-cols-2">
                  {p.applications ? (
                    <div>
                      <div className="text-xs font-medium uppercase tracking-[0.3em] text-mid-blue">Applications</div>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.applications}</p>
                    </div>
                  ) : null}
                  {p.process ? (
                    <div>
                      <div className="text-xs font-medium uppercase tracking-[0.3em] text-mid-blue">Process</div>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.process}</p>
                    </div>
                  ) : null}
                </div>
              </Reveal>
            )}

            <Reveal>
              <Link
                to="/contact"
                className="mt-12 inline-flex items-center gap-2 bg-navy-deep px-7 py-4 text-sm font-medium text-white transition-all hover:bg-mid-blue"
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
