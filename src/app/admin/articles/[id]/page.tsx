import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleForm from "../ArticleForm";
import { prisma } from "@/lib/db";
import { getCategories } from "@/lib/data-access";

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [article, categories] = await Promise.all([
    prisma.article.findUnique({
      where: { id },
      include: { category: true },
    }),
    getCategories(),
  ]);

  if (!article) notFound();

  return (
    <div>
      <Link href="/admin/articles" className="text-xs text-slate-500 hover:text-slate-900">
        ← Back to articles
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-slate-900">Edit article</h1>
      <div className="mt-6 max-w-2xl rounded-xl border border-slate-200 bg-white p-6">
        <ArticleForm
          article={{
            id: article.id,
            title: article.title,
            excerpt: article.excerpt,
            body: article.body,
            imageUrl: article.imageUrl,
            author: article.author,
            status: article.status,
            category: { slug: article.category.slug },
          }}
          categories={categories}
        />
      </div>
    </div>
  );
}
