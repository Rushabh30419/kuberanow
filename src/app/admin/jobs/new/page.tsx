import Link from "next/link";
import { ChevronLeft, Briefcase } from "lucide-react";
import { requirePermission } from "@/lib/auth-guard";
import { PageHeader, Card } from "@/components/admin/ui";
import JobForm from "../JobForm";

export default async function NewJobPage() {
  await requirePermission("jobs.create");
  return (
    <div>
      <nav className="mb-3 flex items-center gap-1 text-xs text-slate-500">
        <Link href="/admin/jobs" className="inline-flex items-center gap-1 hover:text-primary-navy">
          <ChevronLeft className="size-3.5" /> Jobs
        </Link>
        <span aria-hidden="true">/</span>
        <span className="font-semibold text-slate-700">New</span>
      </nav>

      <PageHeader
        title="New job"
        subtitle="Create a new opening. It will appear on the careers page once you mark it Active."
        actions={
          <Link
            href="/admin/jobs"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            <ChevronLeft className="size-3.5" /> Back to jobs
          </Link>
        }
      />

      <Card className="max-w-3xl p-6">
        <div className="mb-5 flex items-start gap-3 rounded-lg border border-blue-100 bg-blue-50 p-3 text-sm text-blue-900">
          <Briefcase className="mt-0.5 size-4 shrink-0" />
          <p>
            Drafts are private until you mark the job <strong>Active</strong>. You can edit or hide a job at
            any time — applications already received are kept.
          </p>
        </div>
        <JobForm />
      </Card>
    </div>
  );
}
