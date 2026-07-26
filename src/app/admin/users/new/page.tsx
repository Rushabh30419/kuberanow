import { requirePermission } from "@/lib/auth-guard";
import { getUserPermissions, getRoles } from "@/lib/data-access";
import { PageHeader, Card } from "@/components/admin/ui";
import UserForm from "../UserForm";

export default async function NewUserPage() {
  const user = await requirePermission("users.create");
  const [roles, perms] = await Promise.all([getRoles(), getUserPermissions(user.id)]);

  return (
    <div>
      <PageHeader title="Invite user" />
      <Card className="max-w-xl p-6">
        <UserForm roles={roles} canAssignRole={perms.includes("users.assignRole")} isSelf={false} />
      </Card>
    </div>
  );
}
