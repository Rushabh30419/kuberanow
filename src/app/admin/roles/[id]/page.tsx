import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/auth-guard";
import { getRole } from "@/lib/data-access";
import { PageHeader } from "@/components/admin/ui";
import RoleForm from "../RoleForm";

export default async function EditRolePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requirePermission("roles.edit");
  const role = await getRole(id);
  if (!role) notFound();

  return (
    <div>
      <PageHeader title={`Edit · ${role.name}`} subtitle={role.description ?? undefined} />
      <div className="max-w-3xl">
        <RoleForm role={role} />
      </div>
    </div>
  );
}
