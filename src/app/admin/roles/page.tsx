import Link from "next/link";
import { PlusCircle, ShieldCheck, Users as UsersIcon, Pencil } from "lucide-react";
import type { Prisma } from "@prisma/client";
import { requirePermission } from "@/lib/auth-guard";
import { getUserPermissions } from "@/lib/data-access";
import { prisma } from "@/lib/db";
import { deleteRole } from "@/lib/actions";
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

const SYSTEM_VALUES = ["", "system", "custom"] as const;
type SystemValue = (typeof SYSTEM_VALUES)[number];

const SORT_OPTIONS: readonly TableSort[] = [
  { value: "name_asc", label: "Name A–Z" },
  { value: "name_desc", label: "Name Z–A" },
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
] as const;

const SORT_DEFAULT = "name_asc";
type SortValue = (typeof SORT_OPTIONS)[number]["value"];

function buildOrderBy(sort: SortValue): Prisma.RoleOrderByWithRelationInput {
  switch (sort) {
    case "name_desc":
      return { name: "desc" };
    case "newest":
      return { createdAt: "desc" };
    case "oldest":
      return { createdAt: "asc" };
    case "name_asc":
    default:
      return { name: "asc" };
  }
}

const PATH = "/admin/roles";

export default async function RolesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const user = await requirePermission("roles.view");
  const perms = await getUserPermissions(user.id);
  const sp = await searchParams;

  const q = parseParam(sp.q);
  const system = parseChoice<SystemValue>(sp.system, SYSTEM_VALUES, "");
  const sort = parseChoice<SortValue>(sp.sort, SORT_OPTIONS.map((o) => o.value), SORT_DEFAULT);
  const requestedPage = parsePage(sp.page);
  const orderBy = buildOrderBy(sort);

  const where: Prisma.RoleWhereInput = {
    ...(q
      ? {
          OR: [
            { name: { contains: q } },
            { description: { contains: q } },
          ],
        }
      : {}),
    ...(system === "system" ? { system: true } : system === "custom" ? { system: false } : {}),
  };

  const [roles, total] = await Promise.all([
    prisma.role.findMany({
      where,
      orderBy,
      include: { _count: { select: { users: true, permissions: true } } },
      take: PAGE_SIZE,
      skip: (requestedPage - 1) * PAGE_SIZE,
    }),
    prisma.role.count({ where }),
  ]);

  const page = clampPage(requestedPage, total);
  const rows =
    page === requestedPage
      ? roles
      : await prisma.role.findMany({
          where,
          orderBy,
          include: { _count: { select: { users: true, permissions: true } } },
          take: PAGE_SIZE,
          skip: (page - 1) * PAGE_SIZE,
        });

  const hasFilters = Boolean(q || system || sort !== SORT_DEFAULT);

  const columns: Column<(typeof rows)[number]>[] = [
    {
      key: "name",
      header: "Role",
      cell: (r) => (
        <div>
          <div className="flex items-center gap-2 font-semibold text-career-heading">
            {r.name}
            {r.system && <Badge color="cyan">System</Badge>}
          </div>
          <div className="line-clamp-1 text-xs text-slate-500">{r.description ?? "No description."}</div>
        </div>
      ),
    },
    {
      key: "permissions",
      header: "Permissions",
      hideOnMobile: true,
      cell: (r) => (
        <span className="inline-flex items-center gap-1 text-slate-600">
          <ShieldCheck className="size-3.5" /> {r._count.permissions}
        </span>
      ),
    },
    {
      key: "users",
      header: "Members",
      hideOnMobile: true,
      cell: (r) => (
        <span className="inline-flex items-center gap-1 text-slate-600">
          <UsersIcon className="size-3.5" /> {r._count.users}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      cell: (r) => (
        <div className="flex items-center justify-end gap-3 text-xs font-semibold">
          {perms.includes("roles.edit") && (
            <Link href={`/admin/roles/${r.id}`} className="inline-flex items-center gap-1 text-blue-700 hover:underline">
              <Pencil className="size-3.5" /> Edit
            </Link>
          )}
          {!r.system && perms.includes("roles.delete") && (
            <DeleteButton id={r.id} action={deleteRole} />
          )}
        </div>
      ),
    },
  ];

  const params = { q, system, sort };

  return (
    <div>
      <PageHeader
        title="Roles & permissions"
        subtitle="Define what each role can do. Users inherit permissions from their assigned role."
        actions={perms.includes("roles.create") && <ButtonLink href="/admin/roles/new" icon={PlusCircle}>New role</ButtonLink>}
      />

      <DataTableToolbar
        action={PATH}
        search={q}
        searchPlaceholder="Search role or description..."
        filters={[
          {
            name: "system",
            label: "Type",
            value: system,
            options: [
              { value: "", label: "All roles" },
              { value: "system", label: "System roles" },
              { value: "custom", label: "Custom roles" },
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
        rowKey={(r) => r.id}
        empty={
          hasFilters ? (
            <EmptyState
              icon={ShieldCheck}
              title="No roles match these filters"
              description="Try clearing the search or type filter."
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
            <EmptyState icon={ShieldCheck} title="No roles" description="Create a role to start grouping permissions." />
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
