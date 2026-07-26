import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { PlusCircle, Pencil, FileText } from "lucide-react";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/auth-guard";
import { getUserPermissions } from "@/lib/data-access";
import { deleteArticle } from "@/lib/actions";
import {
  PAGE_SIZE,
  buildListHref,
  clampPage,
  parseChoice,
  parsePage,
  parseParam,
} from "@/lib/pagination";
import {
  PageHeader,
  ButtonLink,
  DataTable,
  Badge,
  EmptyState,
  type Column,
} from "@/components/admin/ui";
import { Pagination } from "@/components/admin/Pagination";
import { DataTableToolbar, type TableSort } from "@/components/admin/DataTableToolbar";
import DeleteButton from "../DeleteButton";

const STATUS_OPTIONS = ["", "draft", "published"] as const;
type StatusValue = (typeof STATUS_OPTIONS)[number];

const SORT_OPTIONS: readonly TableSort[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "updated", label: "Recently updated" },
  { value: "title_asc", label: "Title A–Z" },
  { value: "title_desc", label: "Title Z–A" },
] as const;

const SORT_DEFAULT = "newest";
type SortValue = (typeof SORT_OPTIONS)[number]["value"];

function buildOrderBy(sort: SortValue): Prisma.ArticleOrderByWithRelationInput {
  switch (sort) {
    case "oldest":
      return { createdAt: "asc" };
    case "updated":
      return { updatedAt: "desc" };
    case "title_asc":
      return { title: "asc" };
    case "title_desc":
      return { title: "desc" };
    case "newest":
    default:
      return { createdAt: "desc" };
  }
}

const PATH = "/admin/articles";

export default async function ArticlesList({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const user = await requirePermission("articles.view");
  const perms = await getUserPermissions(user.id);
  const sp = await searchParams;

  const q = parseParam(sp.q);
  const status = parseChoice<StatusValue>(sp.status, STATUS_OPTIONS, "");
  const categoryId = parseParam(sp.categoryId);
  const sort = parseChoice<SortValue>(sp.sort, SORT_OPTIONS.map((o) => o.value), SORT_DEFAULT);
  const requestedPage = parsePage(sp.page);
  const orderBy = buildOrderBy(sort);

  const where: Prisma.ArticleWhereInput = {
    ...(q
      ? {
          OR: [
            { title: { contains: q } },
            { slug: { contains: q } },
            { excerpt: { contains: q } },
            { author: { contains: q } },
          ],
        }
      : {}),
    ...(status ? { status } : {}),
    ...(categoryId ? { categoryId } : {}),
  };

  const [articles, total, categories, publishedCount] = await Promise.all([
    prisma.article.findMany({
      where,
      orderBy,
      include: { category: true },
      take: PAGE_SIZE,
      skip: (requestedPage - 1) * PAGE_SIZE,
    }),
    prisma.article.count({ where }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.article.count({ where: { status: "published" } }),
  ]);

  const page = clampPage(requestedPage, total);

  // Re-fetch the clamped page if the requested page was out of range.
  const rows =
    page === requestedPage
      ? articles
      : await prisma.article.findMany({
          where,
          orderBy,
          include: { category: true },
          take: PAGE_SIZE,
          skip: (page - 1) * PAGE_SIZE,
        });

  const hasFilters = Boolean(q || status || categoryId || sort !== SORT_DEFAULT);

  const columns: Column<(typeof rows)[number]>[] = [
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

  const params = { q, status, categoryId, sort };

  return (
    <div>
      <PageHeader
        title="Articles"
        subtitle={`${publishedCount} published · ${total} matching`}
        actions={
          perms.includes("articles.create") && (
            <ButtonLink href="/admin/articles/new" icon={PlusCircle}>New article</ButtonLink>
          )
        }
      />

      <DataTableToolbar
        action={PATH}
        search={q}
        searchPlaceholder="Search title, author, or excerpt..."
        filters={[
          {
            name: "status",
            label: "Status",
            value: status,
            options: [
              { value: "", label: "All statuses" },
              { value: "draft", label: "Draft" },
              { value: "published", label: "Published" },
            ],
          },
          {
            name: "categoryId",
            label: "Category",
            value: categoryId,
            options: [
              { value: "", label: "All categories" },
              ...categories.map((c) => ({ value: c.id, label: c.name })),
            ],
          },
        ]}
        sort={sort}
        defaultSort={SORT_DEFAULT}
        sortOptions={[...SORT_OPTIONS]}
        resultCount={total}
      />

      <DataTable
        columns={columns}
        rows={rows}
        rowKey={(a) => a.id}
        empty={
          hasFilters ? (
            <EmptyState
              icon={FileText}
              title="No articles match these filters"
              description="Try clearing the search or changing the status/category."
              action={
                <Link
                  href={PATH}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Clear filters
                </Link>
              }
            />
          ) : (
            <EmptyState icon={FileText} title="No articles yet" description="Create your first article to get started." />
          )
        }
      />
      <Pagination
        page={page}
        total={total}
        pageSize={PAGE_SIZE}
        hrefFor={(p) => buildListHref(PATH, params, p)}
      />
    </div>
  );
}
