import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Calendar, ArrowRight, Newspaper } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { getPublishedNews } from "@/lib/site.functions";

export const Route = createFileRoute("/news")({
  head: () => ({
    meta: [
      { title: "新闻资讯 — 景鸿科技" },
      {
        name: "description",
        content:
          "了解东莞市景鸿科技有限公司最新的企业新闻、行业动态与精密线圈制造资讯。",
      },
      { property: "og:title", content: "新闻资讯 — 景鸿科技" },
      { property: "og:description", content: "景鸿科技最新企业资讯与行业动态。" },
    ],
  }),
  component: NewsPage,
});

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

function NewsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["public-news"],
    queryFn: () => getPublishedNews(),
  });
  const items = data?.items ?? [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="relative overflow-hidden bg-navy-deep pt-32 pb-20 text-white lg:pt-44 lg:pb-28">
          <div
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage:
                "radial-gradient(circle at 70% 30%, var(--mid-blue) 0%, transparent 55%)",
            }}
          />
          <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
            <Reveal>
              <div className="text-xs font-medium uppercase tracking-[0.3em] text-mid-blue">
                News &amp; Insights
              </div>
              <h1 className="mt-4 font-display text-5xl font-bold leading-[1.05] md:text-7xl">
                新闻
                <span className="italic text-mid-blue">资讯</span>
              </h1>
              <p className="mt-8 max-w-2xl text-base leading-relaxed text-silver/80 md:text-lg">
                跟踪景鸿科技最新企业动态、产品发布与行业趋势分析。
              </p>
            </Reveal>
          </div>
        </section>

        <section className="bg-background py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            {isLoading ? (
              <div className="py-20 text-center text-muted-foreground">加载中...</div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center gap-4 border border-dashed border-border bg-white py-24 text-center">
                <Newspaper size={40} className="text-mid-blue" strokeWidth={1.5} />
                <div className="font-display text-xl font-bold text-navy-deep">
                  暂无新闻发布
                </div>
                <div className="text-sm text-muted-foreground">敬请关注，我们将持续更新企业动态。</div>
              </div>
            ) : (
              <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
                {items.map((n, i) => (
                  <Reveal key={n.id} delay={i * 0.05}>
                    <Link
                      to="/news/$id"
                      params={{ id: n.id }}
                      className="group flex h-full flex-col bg-white p-8 transition-colors hover:bg-silver/30"
                    >
                      {n.cover_url ? (
                        <div className="mb-6 aspect-[16/9] w-full overflow-hidden bg-navy-deep">
                          <img
                            src={n.cover_url}
                            alt={n.title}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      ) : null}
                      <div className="flex items-center gap-2 text-xs text-mid-blue">
                        <Calendar size={14} />
                        {formatDate(n.created_at)}
                      </div>
                      <h2 className="mt-4 font-display text-xl font-bold leading-snug text-navy-deep">
                        {n.title}
                      </h2>
                      {n.summary ? (
                        <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
                          {n.summary}
                        </p>
                      ) : null}
                      <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-navy-deep">
                        阅读全文 <ArrowRight size={14} />
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}