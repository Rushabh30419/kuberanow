import { requirePermission } from "@/lib/auth-guard";
import { PageHeader } from "@/components/admin/ui";
import RoleForm from "../RoleForm";

export default async function NewRolePage() {
  await requirePermission("roles.create");
  return (
    <div>
      <PageHeader title="New role" subtitle="Create a custom role with the permissions you choose." />
      <div className="max-w-3xl">
        <RoleForm />
      </div>
    </div>
  );
}
