import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Calendar } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { getNewsById } from "@/lib/site.functions";

export const Route = createFileRoute("/news/$id")({
  component: NewsDetailPage,
});

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

function NewsDetailPage() {
  const { id } = Route.useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["news", id],
    queryFn: () => getNewsById({ data: { id } }),
  });
  const item = data?.item;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-24 lg:pt-40">
        <div className="mx-auto max-w-3xl px-6 lg:px-10">
          <Link
            to="/news"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-navy-deep"
          >
            <ArrowLeft size={14} /> 返回新闻列表
          </Link>
          {isLoading ? (
            <div className="py-20 text-center text-muted-foreground">加载中...</div>
          ) : !item ? (
            <div className="py-20 text-center text-muted-foreground">
              文章不存在或已下架
            </div>
          ) : (
            <article className="mt-8">
              <div className="flex items-center gap-2 text-xs text-mid-blue">
                <Calendar size={14} /> {formatDate(item.created_at)}
              </div>
              <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-navy-deep md:text-5xl">
                {item.title}
              </h1>
              {item.summary ? (
                <p className="mt-6 border-l-2 border-mid-blue pl-4 text-base text-muted-foreground">
                  {item.summary}
                </p>
              ) : null}
              {item.cover_url ? (
                <img
                  src={item.cover_url}
                  alt={item.title}
                  className="mt-10 w-full"
                  loading="lazy"
                />
              ) : null}
              <div className="prose mt-10 max-w-none whitespace-pre-wrap text-base leading-relaxed text-navy-deep">
                {item.content}
              </div>
            </article>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}