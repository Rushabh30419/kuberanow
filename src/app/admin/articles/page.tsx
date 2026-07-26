import Link from "next/link";
import { PlusCircle, Pencil } from "lucide-react";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/auth-guard";
import { getUserPermissions } from "@/lib/data-access";
import { deleteArticle } from "@/lib/actions";
import { PageHeader, ButtonLink, DataTable, Badge, type Column } from "@/components/admin/ui";
import DeleteButton from "../DeleteButton";

export default async function ArticlesList() {
  const user = await requirePermission("articles.view");
  const perms = await getUserPermissions(user.id);

  const articles = await prisma.article.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  const columns: Column<(typeof articles)[number]>[] = [
    {
      key: "title",
      header: "Title",
      cell: (a) => (
        <Link href={`/admin/articles/${a.id}`} className="font-semibold text-career-heading hover:text-primary-navy">
          {a.title}
        </Link>
      ),
    },
    {
      key: "category",
      header: "Category",
      hideOnMobile: true,
      cell: (a) => <Badge color="navy">{a.category.name}</Badge>,
    },
    { key: "author", header: "Author", hideOnMobile: true, cell: (a) => <span className="text-slate-600">{a.author}</span> },
    {
      key: "status",
      header: "Status",
      cell: (a) => <Badge color={a.status === "published" ? "green" : "amber"}>{a.status}</Badge>,
    },
    {
      key: "date",
      header: "Created",
      hideOnMobile: true,
      cell: (a) => <span className="text-xs text-slate-500">{new Date(a.createdAt).toLocaleDateString()}</span>,
    },
    {
      key: "actions",
      header: "",
      cell: (a) => (
        <div className="flex items-center justify-end gap-3 text-xs font-semibold">
          <Link href={`/admin/articles/${a.id}`} className="inline-flex items-center gap-1 text-blue-700 hover:underline">
            <Pencil className="size-3.5" /> Edit
          </Link>
          {perms.includes("articles.delete") && <DeleteButton id={a.id} action={deleteArticle} />}
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Articles"
        subtitle={`${articles.length} total`}
        actions={
          perms.includes("articles.create") && (
            <ButtonLink href="/admin/articles/new" icon={PlusCircle}>New article</ButtonLink>
          )
        }
      />
      <DataTable columns={columns} rows={articles} rowKey={(a) => a.id} />
    </div>
  );
}
