import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ExternalLink, Inbox, Clock } from "lucide-react";
import { requirePermission } from "@/lib/auth-guard";
import { getUserPermissions } from "@/lib/data-access";
import { prisma } from "@/lib/db";
import { deleteJob } from "@/lib/actions";
import { PageHeader, Card, Badge } from "@/components/admin/ui";
import DeleteButton from "../../DeleteButton";
import JobForm from "../JobForm";

export default async function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const me = await requirePermission("jobs.edit");
  const perms = await getUserPermissions(me.id);

  const [job, applicationCount] = await Promise.all([
    prisma.job.findUnique({ where: { id } }),
    prisma.application.count({ where: { jobId: id } }),
  ]);

  if (!job) notFound();

  return (
    <div>
      <nav className="mb-3 flex items-center gap-1 text-xs text-slate-500">
        <Link href="/admin/jobs" className="inline-flex items-center gap-1 hover:text-primary-navy">
          <ChevronLeft className="size-3.5" /> Jobs
        </Link>
        <span aria-hidden="true">/</span>
        <span className="line-clamp-1 font-semibold text-slate-700">{job.title}</span>
      </nav>

      <PageHeader
        title={job.title}
        subtitle="Edit the job posting. Changes are live on the careers page after saving."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <a
              href="/career"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <ExternalLink className="size-3.5" /> View on site
            </a>
            <Link
              href="/admin/jobs"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <ChevronLeft className="size-3.5" /> Back to jobs
            </Link>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <JobForm job={job} />
        </div>

        <aside className="space-y-4">
          <Card className="p-5">
            <h3 className="text-xs font-semibold tracking-wide text-slate-500 uppercase">Status</h3>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge color={job.active ? "green" : "slate"}>
                {job.active ? "Active" : "Hidden"}
              </Badge>
              <span className="text-xs text-slate-500">
                {job.active
                  ? "Visible on the public careers page."
                  : "Hidden from the public careers page."}
              </span>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-2 text-xs text-slate-500">
              <p className="flex items-center gap-2">
                <Clock className="size-3.5" /> Created {new Date(job.createdAt).toLocaleString()}
              </p>
              <p className="flex items-center gap-2">
                <Clock className="size-3.5" /> Last edited {new Date(job.updatedAt).toLocaleString()}
              </p>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="text-xs font-semibold tracking-wide text-slate-500 uppercase">Applications</h3>
            <p className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-career-heading">{applicationCount}</span>
              <span className="text-xs text-slate-500">
                {applicationCount === 1 ? "application" : "applications"} received
              </span>
            </p>
            <Link
              href={`/admin/applications?jobId=${job.id}`}
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Inbox className="size-3.5" /> View applications
            </Link>
            {perms.includes("applications.view") === false && (
              <p className="mt-2 text-[10px] text-slate-400">
                You need the <code>applications.view</code> permission to see them.
              </p>
            )}
          </Card>

          {perms.includes("jobs.delete") && (
            <Card className="border-red-200 bg-red-50/50 p-5">
              <h3 className="text-xs font-semibold tracking-wide text-red-700 uppercase">Danger zone</h3>
              <p className="mt-2 text-xs text-slate-600">
                Deleting this job also removes {applicationCount} related{" "}
                {applicationCount === 1 ? "application" : "applications"}. This cannot be undone.
              </p>
              <div className="mt-3">
                <DeleteButton
                  id={job.id}
                  action={deleteJob}
                  label="Delete job"
                />
              </div>
            </Card>
          )}
        </aside>
      </div>
    </div>
  );
}
