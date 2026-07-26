import { requirePermission } from "@/lib/auth-guard";
import { getUserPermissions, getCategories } from "@/lib/data-access";
import { PageHeader, Card } from "@/components/admin/ui";
import ArticleForm from "../ArticleForm";

export default async function NewArticlePage() {
  const user = await requirePermission("articles.create");
  const [categories, perms] = await Promise.all([getCategories(), getUserPermissions(user.id)]);

  return (
    <div>
      <PageHeader title="New article" />
      <Card className="max-w-2xl p-6">
        <ArticleForm categories={categories} canPublish={perms.includes("articles.publish")} />
      </Card>
    </div>
  );
}
