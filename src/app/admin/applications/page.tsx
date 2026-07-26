import { Mail } from "lucide-react";
import { requirePermission } from "@/lib/auth-guard";
import { getAllApplications } from "@/lib/data-access";
import { prisma } from "@/lib/db";
import { deleteApplication } from "@/lib/actions";
import { parsePage, PAGE_SIZE } from "@/lib/pagination";
import { PageHeader, DataTable, Badge, type Column } from "@/components/admin/ui";
import { Pagination } from "@/components/admin/Pagination";
import DeleteButton from "../DeleteButton";

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  await requirePermission("applications.view");
  const { page: pageStr } = await searchParams;
  const page = parsePage(pageStr);
  const skip = (page - 1) * PAGE_SIZE;

  const [apps, total] = await Promise.all([
    prisma.application.findMany({
      include: { job: { select: { title: true } } },
      orderBy: { createdAt: "desc" },
      skip,
      take: PAGE_SIZE,
    }),
    prisma.application.count(),
  ]);

  const rows = apps.map((a) => ({
    id: a.id,
    name: a.name,
    email: a.email,
    phone: a.phone,
    coverLetter: a.coverLetter,
    jobTitle: a.job.title,
    createdAt: a.createdAt,
  }));

  const columns: Column<typeof rows[number]>[] = [
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
    { key: "role", header: "Role", hideOnMobile: true, cell: (a) => <Badge color="navy">{a.jobTitle}</Badge> },
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
    {
      key: "actions",
      header: "",
      cell: (a) => (
        <div className="flex justify-end">
          <DeleteButton id={a.id} action={deleteApplication} />
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Job applications" subtitle={`${total} total`} />
      <DataTable
        columns={columns}
        rows={rows}
        rowKey={(a) => a.id}
        empty={
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
            <Mail className="mb-3 size-8 text-slate-300" />
            <p className="font-semibold text-slate-700">No applications yet</p>
            <p className="mt-1 text-sm text-slate-500">Job applications from the careers page will appear here.</p>
          </div>
        }
      />
      <Pagination
        page={page}
        total={total}
        pageSize={PAGE_SIZE}
        hrefFor={(p) => `/admin/applications?page=${p}`}
      />
    </div>
  );
}
