import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import coilImg from "@/assets/product-coil.jpg";
import { getProductById } from "@/lib/site.functions";

export const Route = createFileRoute("/products/$id")({
  loader: async ({ params }) => {
    const res = await getProductById({ data: { id: params.id } });
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
  const { id } = Route.useParams();
  const initial = Route.useLoaderData();
  const { data } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById({ data: { id } }),
    initialData: initial,
    staleTime: 60_000,
  });
  const p = data?.product;
  if (!p) return null;
  const features = (p.features as string[] | null) ?? [];
  const img = p.cover_url || coilImg;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="relative overflow-hidden bg-navy-deep pt-32 pb-16 text-white lg:pt-44 lg:pb-24">
          <div className="absolute inset-0 opacity-25" style={{ backgroundImage: `url(${img})`, backgroundSize: "cover", backgroundPosition: "center" }} />
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
            <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
              <Reveal>
                <div className="overflow-hidden bg-navy-deep">
                  <img src={img} alt={p.name} className="aspect-[4/3] w-full object-cover" />
                </div>
              </Reveal>
              <Reveal>
                <h2 className="font-display text-3xl font-bold text-navy-deep md:text-4xl">核心特点</h2>
                <div className="mt-4 h-px w-16 bg-navy-deep" />
                {features.length > 0 && (
                  <ul className="mt-8 space-y-4">
                    {features.map((s) => (
                      <li key={s} className="flex items-start gap-3 text-base text-navy-deep">
                        <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-mid-blue" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-10 space-y-4 border-t border-border pt-8">
                  {p.applications ? (
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      <strong className="text-navy-deep">应用领域：</strong>{p.applications}
                    </p>
                  ) : null}
                  {p.process ? (
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      <strong className="text-navy-deep">工艺说明：</strong>{p.process}
                    </p>
                  ) : null}
                </div>
                <Link to="/contact" className="mt-10 inline-flex items-center gap-2 bg-navy-deep px-7 py-4 text-sm font-medium text-white transition-all hover:bg-mid-blue">
                  咨询此产品 <ArrowRight size={14} />
                </Link>
              </Reveal>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
