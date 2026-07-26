import Link from "next/link";
import { Mail, Inbox, ChevronRight } from "lucide-react";
import type { Prisma } from "@prisma/client";
import { requirePermission } from "@/lib/auth-guard";
import { prisma } from "@/lib/db";
import { deleteApplication } from "@/lib/actions";
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
  DataTable,
  Badge,
  EmptyState,
  type Column,
} from "@/components/admin/ui";
import { Pagination } from "@/components/admin/Pagination";
import { DataTableToolbar, type TableSort } from "@/components/admin/DataTableToolbar";
import DeleteButton from "../DeleteButton";
import MarkAllApplicationRead from "./MarkAllApplicationRead";

const SORT_OPTIONS: readonly TableSort[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "name_asc", label: "Applicant name A–Z" },
] as const;

const SORT_DEFAULT = "newest";
type SortValue = (typeof SORT_OPTIONS)[number]["value"];

function buildOrderBy(sort: SortValue): Prisma.ApplicationOrderByWithRelationInput {
  switch (sort) {
    case "oldest":
      return { createdAt: "asc" };
    case "name_asc":
      return { name: "asc" };
    case "newest":
    default:
      return { createdAt: "desc" };
  }
}

const PATH = "/admin/applications";
const READ_VALUES = ["", "unread", "read"] as const;
type ReadValue = (typeof READ_VALUES)[number];

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requirePermission("applications.view");
  const sp = await searchParams;

  const q = parseParam(sp.q);
  const jobId = parseParam(sp.jobId);
  const readFilter = parseChoice<ReadValue>(sp.read, READ_VALUES, "");
  const sort = parseChoice<SortValue>(sp.sort, SORT_OPTIONS.map((o) => o.value), SORT_DEFAULT);
  const requestedPage = parsePage(sp.page);
  const orderBy = buildOrderBy(sort);

  const where: Prisma.ApplicationWhereInput = {
    ...(q
      ? {
          OR: [
            { name: { contains: q } },
            { email: { contains: q } },
            { phone: { contains: q } },
            { coverLetter: { contains: q } },
            { job: { is: { title: { contains: q } } } },
          ],
        }
      : {}),
    ...(jobId ? { jobId } : {}),
    ...(readFilter === "unread" ? { read: false } : readFilter === "read" ? { read: true } : {}),
  };

  const [apps, total, jobs, unreadCount, totalCount] = await Promise.all([
    prisma.application.findMany({
      where,
      include: { job: { select: { title: true, id: true } } },
      orderBy,
      take: PAGE_SIZE,
      skip: (requestedPage - 1) * PAGE_SIZE,
    }),
    prisma.application.count({ where }),
    prisma.job.findMany({ orderBy: { createdAt: "desc" }, select: { id: true, title: true } }),
    prisma.application.count({ where: { read: false } }),
    prisma.application.count(),
  ]);

  const page = clampPage(requestedPage, total);
  const appsRows =
    page === requestedPage
      ? apps
      : await prisma.application.findMany({
          where,
          include: { job: { select: { title: true, id: true } } },
          orderBy,
          take: PAGE_SIZE,
          skip: (page - 1) * PAGE_SIZE,
        });

  const rows = appsRows.map((a) => ({
    id: a.id,
    name: a.name,
    email: a.email,
    phone: a.phone,
    coverLetter: a.coverLetter,
    jobTitle: a.job.title,
    jobId: a.job.id,
    read: a.read,
    hasResume: Boolean(a.resumePath),
    resumeName: a.resumeName,
    createdAt: a.createdAt,
  }));

  const hasFilters = Boolean(q || jobId || readFilter || sort !== SORT_DEFAULT);
  const params = { q, jobId, read: readFilter, sort };

  const columns: Column<typeof rows[number]>[] = [
    {
      key: "applicant",
      header: "Applicant",
      cell: (a) => (
        <div className="flex items-center gap-2">
          {!a.read && (
            <span
              aria-label="Unread"
              className="inline-block size-2 shrink-0 rounded-full bg-blue-600"
            />
          )}
          <div>
            <div className="font-semibold text-career-heading">{a.name}</div>
            <a href={`mailto:${a.email}`} className="text-xs text-blue-700 hover:underline">
              {a.email}
            </a>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      hideOnMobile: true,
      cell: (a) => (
        <Link
          href={`/admin/jobs/${a.jobId}`}
          className="text-blue-700 hover:underline"
        >
          <Badge color="navy">{a.jobTitle}</Badge>
        </Link>
      ),
    },
    {
      key: "phone",
      header: "Phone",
      hideOnMobile: true,
      cell: (a) => <span className="text-slate-600">{a.phone ?? "—"}</span>,
    },
    {
      key: "note",
      header: "Cover note",
      hideOnMobile: true,
      cell: (a) => (
        <span className="line-clamp-2 max-w-xs text-slate-600">{a.coverLetter ?? "—"}</span>
      ),
    },
    {
      key: "resume",
      header: "Resume",
      hideOnMobile: true,
      cell: (a) =>
        a.hasResume ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
            <svg
              className="size-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"
              />
              <path strokeLinecap="round" d="M14 2v6h6" />
            </svg>
            {a.resumeName ? (
              <span className="line-clamp-1 max-w-[10rem]">{a.resumeName}</span>
            ) : (
              "Attached"
            )}
          </span>
        ) : (
          <span className="text-xs text-slate-400">—</span>
        ),
    },
    {
      key: "received",
      header: "Received",
      cell: (a) => (
        <span className="text-xs text-slate-500">
          {new Date(a.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      cell: (a) => (
        <div className="flex items-center justify-end gap-3 text-xs font-semibold">
          <Link
            href={`/admin/applications/${a.id}`}
            className="inline-flex items-center gap-1 text-blue-700 hover:underline"
          >
            View <ChevronRight className="size-3.5" />
          </Link>
          <DeleteButton
            id={a.id}
            action={deleteApplication}
            message={`Delete the application from ${a.name} for "${a.jobTitle}"? This cannot be undone.`}
            label="Delete"
          />
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Job applications"
        subtitle={
          unreadCount > 0
            ? `${unreadCount} unread · ${totalCount} total`
            : `${totalCount} total`
        }
        actions={unreadCount > 0 && <MarkAllApplicationRead disabled={false} />}
      />

      <DataTableToolbar
        action={PATH}
        search={q}
        searchPlaceholder="Search applicant, email, or job..."
        filters={[
          {
            name: "read",
            label: "Status",
            value: readFilter,
            options: [
              { value: "", label: "All" },
              { value: "unread", label: "Unread" },
              { value: "read", label: "Read" },
            ],
          },
          {
            name: "jobId",
            label: "Job opening",
            value: jobId,
            options: [
              { value: "", label: "All openings" },
              ...jobs.map((j) => ({ value: j.id, label: j.title })),
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
        rowKey={(a) => a.id}
        empty={
          hasFilters ? (
            <EmptyState
              icon={Inbox}
              title="No applications match these filters"
              description="Try clearing the search or job filter."
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
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
              <Mail className="mb-3 size-8 text-slate-300" />
              <p className="font-semibold text-slate-700">No applications yet</p>
              <p className="mt-1 text-sm text-slate-500">
                Job applications from the careers page will appear here.
              </p>
            </div>
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
