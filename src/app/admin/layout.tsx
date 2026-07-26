import { requireEditor } from "@/lib/auth-guard";
import { getUserPermissions } from "@/lib/data-access";
import { AdminShell } from "./AdminShell";

export const metadata = {
  title: "Admin · KuberaNow",
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireEditor();
  const permissions = await getUserPermissions(user.id);

  return (
    <AdminShell user={user} permissions={permissions}>
      {children}
    </AdminShell>
  );
}
