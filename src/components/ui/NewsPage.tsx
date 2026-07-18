import { PageHeader } from "./PageHeader";
import { NewsGrid } from "./NewsGrid";
import type { NewsArticle } from "./NewsGrid";

type Props = {
  title: string;
  subtitle: string;
  breadcrumb: string;
  articles: NewsArticle[];
  hrefPrefix?: string;
};

export function NewsPage({
  title,
  subtitle,
  breadcrumb,
  articles,
}: Props) {
  return (
    <>
      <PageHeader title={title} subtitle={subtitle} breadcrumb={breadcrumb} />
      <main className="bg-background-color mx-auto w-full max-w-7xl flex-1 px-4 py-10">
        <div className="mb-8 flex items-baseline justify-between">
          <h2 className="text-xl font-semibold text-slate-900">
            Latest Stories
          </h2>
          <p className="text-sm text-slate-500">{articles.length} articles</p>
        </div>
        <NewsGrid articles={articles} />
      </main>
    </>
  );
}
