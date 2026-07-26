import Link from "next/link";
import { PlusCircle, Pencil } from "lucide-react";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/auth-guard";
import { getUserPermissions } from "@/lib/data-access";
import { deleteJob } from "@/lib/actions";
import { PageHeader, ButtonLink, DataTable, Badge, type Column } from "@/components/admin/ui";
import DeleteButton from "../DeleteButton";

export default async function JobsList() {
  const user = await requirePermission("jobs.view");
  const perms = await getUserPermissions(user.id);
  const jobs = await prisma.job.findMany({ orderBy: { createdAt: "desc" } });

  const columns: Column<(typeof jobs)[number]>[] = [
    {
      key: "title",
      header: "Title",
      cell: (j) => (
        <Link href={`/admin/jobs/${j.id}`} className="font-semibold text-career-heading hover:text-primary-navy">
          {j.title}
        </Link>
      ),
    },
    { key: "experience", header: "Experience", hideOnMobile: true, cell: (j) => <span className="text-slate-600">{j.experience || "—"}</span> },
    { key: "location", header: "Location", hideOnMobile: true, cell: (j) => <span className="text-slate-600">{j.location}</span> },
    {
      key: "type",
      header: "Type",
      cell: (j) => (
        <div className="flex flex-wrap gap-1">
          <Badge color="slate">{j.type}</Badge>
          <Badge color="slate">{j.mode}</Badge>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (j) => <Badge color={j.active ? "green" : "slate"}>{j.active ? "Active" : "Hidden"}</Badge>,
    },
    {
      key: "actions",
      header: "",
      cell: (j) => (
        <div className="flex items-center justify-end gap-3 text-xs font-semibold">
          <Link href={`/admin/jobs/${j.id}`} className="inline-flex items-center gap-1 text-blue-700 hover:underline">
            <Pencil className="size-3.5" /> Edit
          </Link>
          {perms.includes("jobs.delete") && <DeleteButton id={j.id} action={deleteJob} />}
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Jobs"
        subtitle={`${jobs.length} total · ${jobs.filter((j) => j.active).length} active`}
        actions={perms.includes("jobs.create") && <ButtonLink href="/admin/jobs/new" icon={PlusCircle}>New job</ButtonLink>}
      />
      <DataTable columns={columns} rows={jobs} rowKey={(j) => j.id} />
    </div>
  );
}
