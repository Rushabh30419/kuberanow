import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/auth-guard";
import { prisma } from "@/lib/db";
import { PageHeader, Card } from "@/components/admin/ui";
import JobForm from "../JobForm";

export default async function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requirePermission("jobs.edit");
  const job = await prisma.job.findUnique({ where: { id } });
  if (!job) notFound();

  return (
    <div>
      <PageHeader title="Edit job" />
      <Card className="max-w-2xl p-6">
        <JobForm job={job} />
      </Card>
    </div>
  );
}
