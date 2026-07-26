import { requirePermission } from "@/lib/auth-guard";
import { PageHeader, Card } from "@/components/admin/ui";
import JobForm from "../JobForm";

export default async function NewJobPage() {
  await requirePermission("jobs.create");
  return (
    <div>
      <PageHeader title="New job" />
      <Card className="max-w-2xl p-6">
        <JobForm />
      </Card>
    </div>
  );
}
