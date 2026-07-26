import { Mail } from "lucide-react";
import { requirePermission } from "@/lib/auth-guard";
import { getAllApplications } from "@/lib/data-access";
import { PageHeader, DataTable, Badge, type Column } from "@/components/admin/ui";

export default async function ApplicationsPage() {
  await requirePermission("applications.view");
  const apps = await getAllApplications();

  const columns: Column<(typeof apps)[number]>[] = [
    {
      key: "applicant",
      header: "Applicant",
      cell: (a) => (
        <div>
          <div className="font-semibold text-career-heading">{a.name}</div>
          <a href={`mailto:${a.email}`} className="text-xs text-blue-700 hover:underline">{a.email}</a>
        </div>
      ),
    },
    { key: "role", header: "Role", hideOnMobile: true, cell: (a) => <Badge color="navy">{a.job.title}</Badge> },
    { key: "phone", header: "Phone", hideOnMobile: true, cell: (a) => <span className="text-slate-600">{a.phone ?? "—"}</span> },
    {
      key: "note",
      header: "Cover note",
      hideOnMobile: true,
      cell: (a) => <span className="line-clamp-2 max-w-xs text-slate-600">{a.coverLetter ?? "—"}</span>,
    },
    {
      key: "received",
      header: "Received",
      cell: (a) => <span className="text-xs text-slate-500">{new Date(a.createdAt).toLocaleDateString()}</span>,
    },
  ];

  return (
    <div>
      <PageHeader title="Job applications" subtitle={`${apps.length} total`} />
      <DataTable
        columns={columns}
        rows={apps}
        rowKey={(a) => a.id}
        empty={
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
            <Mail className="mb-3 size-8 text-slate-300" />
            <p className="font-semibold text-slate-700">No applications yet</p>
            <p className="mt-1 text-sm text-slate-500">Job applications from the careers page will appear here.</p>
          </div>
        }
      />
    </div>
  );
}
