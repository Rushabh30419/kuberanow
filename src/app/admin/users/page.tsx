import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { PlusCircle, Pencil, Users as UsersIcon } from "lucide-react";
import { requirePermission } from "@/lib/auth-guard";
import { getUserPermissions } from "@/lib/data-access";
import { prisma } from "@/lib/db";
import { deleteUser } from "@/lib/actions";
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

const SORT_OPTIONS: readonly TableSort[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "name_asc", label: "Name A–Z" },
  { value: "email_asc", label: "Email A–Z" },
] as const;

const SORT_DEFAULT = "newest";
type SortValue = (typeof SORT_OPTIONS)[number]["value"];

function buildOrderBy(sort: SortValue): Prisma.UserOrderByWithRelationInput {
  switch (sort) {
    case "oldest":
      return { createdAt: "asc" };
    case "name_asc":
      return { name: "asc" };
    case "email_asc":
      return { email: "asc" };
    case "newest":
    default:
      return { createdAt: "desc" };
  }
}

const PATH = "/admin/users";

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const me = await requirePermission("users.view");
  const perms = await getUserPermissions(me.id);
  const sp = await searchParams;

  const q = parseParam(sp.q);
  const roleId = parseParam(sp.roleId);
  const sort = parseChoice<SortValue>(sp.sort, SORT_OPTIONS.map((o) => o.value), SORT_DEFAULT);
  const requestedPage = parsePage(sp.page);
  const orderBy = buildOrderBy(sort);

  const where: Prisma.UserWhereInput = {
    ...(q
      ? {
          OR: [
            { name: { contains: q } },
            { email: { contains: q } },
          ],
        }
      : {}),
    ...(roleId ? { roleId } : {}),
  };

  const [users, total, roles] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy,
      include: { roleRelation: { select: { name: true } } },
      take: PAGE_SIZE,
      skip: (requestedPage - 1) * PAGE_SIZE,
    }),
    prisma.user.count({ where }),
    prisma.role.findMany({ orderBy: { name: "asc" } }),
  ]);

  const page = clampPage(requestedPage, total);
  const rows =
    page === requestedPage
      ? users
      : await prisma.user.findMany({
          where,
          orderBy,
          include: { roleRelation: { select: { name: true } } },
          take: PAGE_SIZE,
          skip: (page - 1) * PAGE_SIZE,
        });

  const hasFilters = Boolean(q || roleId || sort !== SORT_DEFAULT);

  const columns: Column<(typeof rows)[number]>[] = [
    {
      key: "name",
      header: "Name",
      cell: (u) => (
        <div className="flex items-center gap-3">
          <span className="flex size-8 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
            {(u.name ?? u.email)[0].toUpperCase()}
          </span>
          <div>
            <div className="font-semibold text-career-heading">{u.name ?? "—"}</div>
            <div className="text-xs text-slate-500">{u.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      cell: (u) => (
        <Badge color={u.role === "admin" ? "cyan" : u.role === "editor" ? "navy" : "slate"}>
          {u.roleRelation?.name ?? "Reader"}
        </Badge>
      ),
    },
    {
      key: "joined",
      header: "Joined",
      hideOnMobile: true,
      cell: (u) => <span className="text-xs text-slate-500">{new Date(u.createdAt).toLocaleDateString()}</span>,
    },
    {
      key: "actions",
      header: "",
      cell: (u) => (
        <div className="flex items-center justify-end gap-3 text-xs font-semibold">
          {perms.includes("users.edit") && (
            <Link href={`/admin/users/${u.id}`} className="inline-flex items-center gap-1 text-blue-700 hover:underline">
              <Pencil className="size-3.5" /> Edit
            </Link>
          )}
          {perms.includes("users.delete") && u.id !== me.id && (
            <DeleteButton id={u.id} action={deleteUser} />
          )}
        </div>
      ),
    },
  ];

  const params = { q, roleId, sort };

  return (
    <div>
      <PageHeader
        title="Users"
        subtitle={`${total} matching`}
        actions={perms.includes("users.create") && <ButtonLink href="/admin/users/new" icon={PlusCircle}>Invite user</ButtonLink>}
      />

      <DataTableToolbar
        action={PATH}
        search={q}
        searchPlaceholder="Search by name or email..."
        filters={[
          {
            name: "roleId",
            label: "Role",
            value: roleId,
            options: [
              { value: "", label: "All roles" },
              ...roles.map((r) => ({ value: r.id, label: r.name })),
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
        rowKey={(u) => u.id}
        empty={
          hasFilters ? (
            <EmptyState
              icon={UsersIcon}
              title="No users match these filters"
              description="Try clearing the search or role filter."
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
            <EmptyState icon={UsersIcon} title="No users yet" description="Invite someone to get started." />
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
