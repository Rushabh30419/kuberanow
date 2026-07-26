import Link from "next/link";
import { PlusCircle, Pencil } from "lucide-react";
import { requirePermission } from "@/lib/auth-guard";
import { getUserPermissions, getUsers } from "@/lib/data-access";
import { prisma } from "@/lib/db";
import { PageHeader, ButtonLink, DataTable, Badge, type Column } from "@/components/admin/ui";

export default async function UsersPage() {
  const user = await requirePermission("users.view");
  const perms = await getUserPermissions(user.id);

  // Eager-load role name for the badge
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { roleRelation: { select: { name: true } } },
  });

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
      cell: (u) => <Badge color={u.role === "admin" ? "cyan" : u.role === "editor" ? "navy" : "slate"}>{u.roleRelation?.name ?? "Reader"}</Badge>,
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
      cell: (u) =>
        perms.includes("users.edit") ? (
          <Link href={`/admin/users/${u.id}`} className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:underline">
            <Pencil className="size-3.5" /> Edit
          </Link>
        ) : null,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Users"
        subtitle={`${users.length} total`}
        actions={perms.includes("users.create") && <ButtonLink href="/admin/users/new" icon={PlusCircle}>Invite user</ButtonLink>}
      />
      <DataTable columns={columns} rows={users} rowKey={(u) => u.id} />
    </div>
  );
}
