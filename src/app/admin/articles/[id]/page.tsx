import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/auth-guard";
import { getUserPermissions, getCategories } from "@/lib/data-access";
import { prisma } from "@/lib/db";
import { PageHeader, Card } from "@/components/admin/ui";
import ArticleForm from "../ArticleForm";

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requirePermission("articles.edit");

  const [article, categories, perms] = await Promise.all([
    prisma.article.findUnique({ where: { id }, include: { category: true } }),
    getCategories(),
    getUserPermissions(user.id),
  ]);

  if (!article) notFound();

  return (
    <div>
      <PageHeader title="Edit article" />
      <Card className="max-w-2xl p-6">
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
          canPublish={perms.includes("articles.publish")}
        />
      </Card>
    </div>
  );
}
