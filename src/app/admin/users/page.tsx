import Link from "next/link";
import { PlusCircle, Pencil } from "lucide-react";
import { requirePermission } from "@/lib/auth-guard";
import { getUserPermissions } from "@/lib/data-access";
import { prisma } from "@/lib/db";
import { deleteUser } from "@/lib/actions";
import { parsePage, PAGE_SIZE } from "@/lib/pagination";
import { PageHeader, ButtonLink, DataTable, Badge, type Column } from "@/components/admin/ui";
import { Pagination } from "@/components/admin/Pagination";
import DeleteButton from "../DeleteButton";

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const me = await requirePermission("users.view");
  const perms = await getUserPermissions(me.id);
  const { page: pageStr } = await searchParams;
  const page = parsePage(pageStr);
  const skip = (page - 1) * PAGE_SIZE;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: { roleRelation: { select: { name: true } } },
      skip,
      take: PAGE_SIZE,
    }),
    prisma.user.count(),
  ]);

  const columns: Column<(typeof users)[number]>[] = [
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

  return (
    <div>
      <PageHeader
        title="Users"
        subtitle={`${total} total`}
        actions={perms.includes("users.create") && <ButtonLink href="/admin/users/new" icon={PlusCircle}>Invite user</ButtonLink>}
      />
      <DataTable columns={columns} rows={users} rowKey={(u) => u.id} />
      <Pagination
        page={page}
        total={total}
        pageSize={PAGE_SIZE}
        hrefFor={(p) => `/admin/users?page=${p}`}
      />
    </div>
  );
}
