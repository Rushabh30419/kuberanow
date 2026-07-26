import Link from "next/link";
import { PlusCircle, ShieldCheck, Users } from "lucide-react";
import { requirePermission } from "@/lib/auth-guard";
import { getUserPermissions, getRoles } from "@/lib/data-access";
import { deleteRole } from "@/lib/actions";
import { PageHeader, ButtonLink, Card, Badge, EmptyState } from "@/components/admin/ui";
import DeleteButton from "../DeleteButton";

export default async function RolesPage() {
  const user = await requirePermission("roles.view");
  const perms = await getUserPermissions(user.id);
  const roles = await getRoles();

  return (
    <div>
      <PageHeader
        title="Roles & permissions"
        subtitle="Define what each role can do. Users inherit permissions from their assigned role."
        actions={perms.includes("roles.create") && <ButtonLink href="/admin/roles/new" icon={PlusCircle}>New role</ButtonLink>}
      />

      {roles.length === 0 ? (
        <EmptyState icon={ShieldCheck} title="No roles" description="Create a role to start grouping permissions." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {roles.map((r) => (
            <Card key={r.id} className="flex flex-col p-5">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-5 text-primary-navy" />
                  <div>
                    <div className="font-semibold text-career-heading">
                      {r.name}
                      {r.system && <Badge color="cyan" className="ml-2">System</Badge>}
                    </div>
                  </div>
                </div>
              </div>
              <p className="mt-2 line-clamp-2 text-xs text-slate-500">{r.description ?? "No description."}</p>

              <div className="mt-4 flex gap-4 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1">
                  <ShieldCheck className="size-3.5" /> {r._count.permissions} permissions
                </span>
                <span className="inline-flex items-center gap-1">
                  <Users className="size-3.5" /> {r._count.users} users
                </span>
              </div>

              <div className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-3 text-xs font-semibold">
                {perms.includes("roles.edit") && (
                  <Link href={`/admin/roles/${r.id}`} className="text-blue-700 hover:underline">Edit permissions</Link>
                )}
                {!r.system && perms.includes("roles.delete") && (
                  <DeleteButton id={r.id} action={deleteRole} />
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
