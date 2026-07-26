import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { PlusCircle, Pencil, Briefcase, Inbox } from "lucide-react";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/auth-guard";
import { getUserPermissions } from "@/lib/data-access";
import { deleteJob } from "@/lib/actions";
import {
  PAGE_SIZE,
  buildListHref,
  clampPage,
  parseChoice,
  parsePage,
  parseParam,
} from "@/lib/pagination";
import {
  PageHeader,
  ButtonLink,
  DataTable,
  Badge,
  EmptyState,
  type Column,
} from "@/components/admin/ui";
import { Pagination } from "@/components/admin/Pagination";
import { DataTableToolbar, type TableSort } from "@/components/admin/DataTableToolbar";
import DeleteButton from "../DeleteButton";
import JobActiveToggle from "./JobActiveToggle";

const ACTIVE_VALUES = ["", "active", "hidden"] as const;
type ActiveValue = (typeof ACTIVE_VALUES)[number];

const SORT_OPTIONS: readonly TableSort[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title_asc", label: "Title A–Z" },
  { value: "title_desc", label: "Title Z–A" },
] as const;

const SORT_DEFAULT = "newest";
type SortValue = (typeof SORT_OPTIONS)[number]["value"];

function buildOrderBy(sort: SortValue): Prisma.JobOrderByWithRelationInput {
  switch (sort) {
    case "oldest":
      return { createdAt: "asc" };
    case "title_asc":
      return { title: "asc" };
    case "title_desc":
      return { title: "desc" };
    case "newest":
    default:
      return { createdAt: "desc" };
  }
}

const PATH = "/admin/jobs";
const TYPE_OPTIONS = ["", "Full-time", "Part-time", "Contract", "Internship", "Freelance"] as const;
const MODE_OPTIONS = ["", "On-site", "Remote", "Hybrid"] as const;
type TypeValue = (typeof TYPE_OPTIONS)[number];
type ModeValue = (typeof MODE_OPTIONS)[number];

export default async function JobsList({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const user = await requirePermission("jobs.view");
  const perms = await getUserPermissions(user.id);
  const sp = await searchParams;

  const q = parseParam(sp.q);
  const type = parseChoice<TypeValue>(sp.type, TYPE_OPTIONS, "");
  const mode = parseChoice<ModeValue>(sp.mode, MODE_OPTIONS, "");
  const active = parseChoice<ActiveValue>(sp.active, ACTIVE_VALUES, "");
  const sort = parseChoice<SortValue>(sp.sort, SORT_OPTIONS.map((o) => o.value), SORT_DEFAULT);
  const requestedPage = parsePage(sp.page);
  const orderBy = buildOrderBy(sort);

  const where: Prisma.JobWhereInput = {
    ...(q
      ? {
          OR: [
            { title: { contains: q } },
            { description: { contains: q } },
            { experience: { contains: q } },
            { salary: { contains: q } },
            { location: { contains: q } },
          ],
        }
      : {}),
    ...(type ? { type } : {}),
    ...(mode ? { mode } : {}),
    ...(active === "active" ? { active: true } : active === "hidden" ? { active: false } : {}),
  };

  const [jobs, total, activeCount, applicationCounts] = await Promise.all([
    prisma.job.findMany({
      where,
      orderBy,
      take: PAGE_SIZE,
      skip: (requestedPage - 1) * PAGE_SIZE,
      include: { _count: { select: { applications: true } } },
    }),
    prisma.job.count({ where }),
    prisma.job.count({ where: { active: true } }),
    prisma.application.groupBy({ by: ["jobId"], _count: { _all: true } }),
  ]);

  // We use _count.applications from the relation include (above) for per-row
  // counts in the table; the groupBy result is aggregated into the header
  // subtitle so we don't need a second map.
  void applicationCounts;

  const page = clampPage(requestedPage, total);
  const rows =
    page === requestedPage
      ? jobs
      : await prisma.job.findMany({
          where,
          orderBy,
          take: PAGE_SIZE,
          skip: (page - 1) * PAGE_SIZE,
          include: { _count: { select: { applications: true } } },
        });

  const hasFilters = Boolean(q || type || mode || active || sort !== SORT_DEFAULT);

  const columns: Column<(typeof rows)[number]>[] = [
    {
      key: "title",
      header: "Title",
      cell: (j) => (
        <Link
          href={`/admin/jobs/${j.id}`}
          className="font-semibold text-career-heading hover:text-primary-navy"
        >
          {j.title}
        </Link>
      ),
    },
    {
      key: "experience",
      header: "Experience",
      hideOnMobile: true,
      cell: (j) => <span className="text-slate-600">{j.experience || "—"}</span>,
    },
    {
      key: "location",
      header: "Location",
      hideOnMobile: true,
      cell: (j) => <span className="text-slate-600">{j.location}</span>,
    },
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
      key: "applications",
      header: "Applicants",
      hideOnMobile: true,
      cell: (j) => {
        const count = j._count.applications;
        return (
          <Link
            href={`/admin/applications?jobId=${j.id}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:underline"
          >
            <Inbox className="size-3.5" /> {count}
          </Link>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      cell: (j) =>
        perms.includes("jobs.edit") ? (
          <JobActiveToggle id={j.id} active={j.active} title={j.title} />
        ) : (
          <Badge color={j.active ? "green" : "slate"}>{j.active ? "Active" : "Hidden"}</Badge>
        ),
    },
    {
      key: "actions",
      header: "",
      cell: (j) => (
        <div className="flex items-center justify-end gap-3 text-xs font-semibold">
          <Link
            href={`/admin/jobs/${j.id}`}
            className="inline-flex items-center gap-1 text-blue-700 hover:underline"
          >
            <Pencil className="size-3.5" /> Edit
          </Link>
          {perms.includes("jobs.delete") && (
            <DeleteButton
              id={j.id}
              action={deleteJob}
              message={`Delete "${j.title}"? Any applications submitted for this role will also be removed. This cannot be undone.`}
              label="Delete"
            />
          )}
        </div>
      ),
    },
  ];

  const params = { q, type, mode, active, sort };

  return (
    <div>
      <PageHeader
        title="Jobs"
        subtitle={`${activeCount} active · ${total} matching${
          applicationCounts.length
            ? ` · ${applicationCounts.reduce((s, r) => s + r._count._all, 0)} total applications`
            : ""
        }`}
        actions={
          perms.includes("jobs.create") && (
            <ButtonLink href="/admin/jobs/new" icon={PlusCircle}>
              New job
            </ButtonLink>
          )
        }
      />

      <DataTableToolbar
        action={PATH}
        search={q}
        searchPlaceholder="Search title, description, location..."
        filters={[
          {
            name: "active",
            label: "Status",
            value: active,
            options: [
              { value: "", label: "All" },
              { value: "active", label: "Active" },
              { value: "hidden", label: "Hidden" },
            ],
          },
          {
            name: "type",
            label: "Type",
            value: type,
            options: [
              { value: "", label: "All types" },
              { value: "Full-time", label: "Full-time" },
              { value: "Part-time", label: "Part-time" },
              { value: "Contract", label: "Contract" },
              { value: "Internship", label: "Internship" },
              { value: "Freelance", label: "Freelance" },
            ],
          },
          {
            name: "mode",
            label: "Mode",
            value: mode,
            options: [
              { value: "", label: "All modes" },
              { value: "On-site", label: "On-site" },
              { value: "Remote", label: "Remote" },
              { value: "Hybrid", label: "Hybrid" },
            ],
          },
        ]}
        sort={sort}
        defaultSort={SORT_DEFAULT}
        sortOptions={[...SORT_OPTIONS]}
        resultCount={total}
      />

      <DataTable
        columns={columns}
        rows={rows}
        rowKey={(j) => j.id}
        empty={
          hasFilters ? (
            <EmptyState
              icon={Briefcase}
              title="No jobs match these filters"
              description="Try clearing the search or status filters."
              action={
                <Link
                  href={PATH}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Clear filters
                </Link>
              }
            />
          ) : (
            <EmptyState
              icon={Briefcase}
              title="No jobs yet"
              description="Create your first job opening to get started."
              action={
                perms.includes("jobs.create") && (
                  <Link
                    href="/admin/jobs/new"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary-navy px-3 py-1.5 text-xs font-semibold text-white hover:bg-dark-navy1"
                  >
                    <PlusCircle className="size-3.5" /> Create a job
                  </Link>
                )
              }
            />
          )
        }
      />
      <Pagination
        page={page}
        total={total}
        pageSize={PAGE_SIZE}
        hrefFor={(p) => buildListHref(PATH, params, p)}
      />
    </div>
  );
}
