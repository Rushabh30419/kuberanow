import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/auth-guard";
import { getUserPermissions, getRoles } from "@/lib/data-access";
import { prisma } from "@/lib/db";
import { PageHeader, Card } from "@/components/admin/ui";
import UserForm from "../UserForm";

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const me = await requirePermission("users.edit");

  const [user, roles, perms] = await Promise.all([
    prisma.user.findUnique({ where: { id }, select: { id: true, name: true, email: true, roleId: true } }),
    getRoles(),
    getUserPermissions(me.id),
  ]);
  if (!user) notFound();

  return (
    <div>
      <PageHeader title="Edit user" />
      <Card className="max-w-xl p-6">
        <UserForm
          user={user}
          roles={roles}
          canAssignRole={perms.includes("users.assignRole")}
          isSelf={user.id === me.id}
        />
      </Card>
    </div>
  );
}
