import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getArticleBySlug, getCategoryBySlug, getCategories } from "@/lib/data-access";
import { PageHeader } from "@/components/ui/PageHeader";

type Props = {
  params: Promise<{ category: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Article not found — KuberaNow" };
  return {
    title: `${article.title} — KuberaNow`,
    description: article.excerpt,
  };
}

export default async function ArticlePage({ params }: Props) {
  const { category, slug } = await params;

  // Validate the category exists; 404 if not.
  const cat = await getCategoryBySlug(category);
  if (!cat) notFound();

  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  return (
    <>
      <PageHeader title={article.title} subtitle={article.excerpt} breadcrumb={`News / ${article.category}`} />
      <main className="bg-background-color mx-auto w-full max-w-3xl flex-1 px-4 py-10">
        <article>
          {article.image && (
            <div className="relative mb-6 aspect-video w-full overflow-hidden rounded-2xl bg-slate-100">
              <Image
                src={article.image}
                alt={article.title}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
                priority
              />
            </div>
          )}

          <div className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 uppercase">
              {article.category}
            </span>
            <span className="font-medium text-slate-700">{article.author}</span>
            <span>·</span>
            <span>{article.date}</span>
            <span>·</span>
            <span>{article.readTime}</span>
          </div>

          <div className="prose prose-slate max-w-none">
            {article.body.split("\n\n").map((para, i) => (
              <p key={i} className="mb-4 leading-relaxed text-slate-700">
                {para}
              </p>
            ))}
          </div>

          <div className="mt-10 border-t border-slate-200 pt-6">
            <Link
              href={`/news/${category}`}
              className="text-sm font-semibold text-blue-700 hover:underline"
            >
              ← Back to {article.category}
            </Link>
          </div>
        </article>
      </main>
    </>
  );
}

// Pre-render the known article routes at build time.
export async function generateStaticParams() {
  const categories = await getCategories();
  const params: { category: string; slug: string }[] = [];
  for (const c of categories) {
    // Defer to runtime DB at request time if you don't want to enumerate here.
    // For simplicity we leave the list empty so all routes render on-demand.
    void c;
  }
  return params;
}
