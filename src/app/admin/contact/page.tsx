import type { Prisma } from "@prisma/client";
import { ChevronRight, Mail } from "lucide-react";
import Link from "next/link";
import { requirePermission } from "@/lib/auth-guard";
import { prisma } from "@/lib/db";
import { deleteContactSubmission } from "@/lib/actions";
import {
  PAGE_SIZE,
  buildListHref,
  clampPage,
  parseChoice,
  parsePage,
  parseParam,
} from "@/lib/pagination";
import { PageHeader, Card, EmptyState, Badge } from "@/components/admin/ui";
import { Pagination } from "@/components/admin/Pagination";
import { DataTableToolbar, type TableSort } from "@/components/admin/DataTableToolbar";
import DeleteButton from "../DeleteButton";
import ContactReadToggle from "./ContactReadToggle";
import MarkAllContactRead from "./MarkAllContactRead";

const SORT_OPTIONS: readonly TableSort[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "name_asc", label: "Sender name A–Z" },
] as const;

const SORT_DEFAULT = "newest";
type SortValue = (typeof SORT_OPTIONS)[number]["value"];

function buildOrderBy(sort: SortValue): Prisma.ContactSubmissionOrderByWithRelationInput {
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

const PATH = "/admin/contact";
const READ_VALUES = ["", "unread", "read"] as const;
type ReadValue = (typeof READ_VALUES)[number];

export default async function ContactMessagesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requirePermission("contact.view");
  const sp = await searchParams;

  const q = parseParam(sp.q);
  const readFilter = parseChoice<ReadValue>(sp.read, READ_VALUES, "");
  const sort = parseChoice<SortValue>(sp.sort, SORT_OPTIONS.map((o) => o.value), SORT_DEFAULT);
  const requestedPage = parsePage(sp.page);
  const orderBy = buildOrderBy(sort);

  const where: Prisma.ContactSubmissionWhereInput = {
    ...(q
      ? {
          OR: [
            { name: { contains: q } },
            { email: { contains: q } },
            { subject: { contains: q } },
            { message: { contains: q } },
          ],
        }
      : {}),
    ...(readFilter === "unread" ? { read: false } : readFilter === "read" ? { read: true } : {}),
  };

  const [msgs, total, unreadCount, totalCount] = await Promise.all([
    prisma.contactSubmission.findMany({
      where,
      orderBy,
      take: PAGE_SIZE,
      skip: (requestedPage - 1) * PAGE_SIZE,
    }),
    prisma.contactSubmission.count({ where }),
    prisma.contactSubmission.count({ where: { read: false } }),
    prisma.contactSubmission.count(),
  ]);

  const page = clampPage(requestedPage, total);
  const rows =
    page === requestedPage
      ? msgs
      : await prisma.contactSubmission.findMany({
          where,
          orderBy,
          take: PAGE_SIZE,
          skip: (page - 1) * PAGE_SIZE,
        });

  const hasFilters = Boolean(q || readFilter || sort !== SORT_DEFAULT);
  const params = { q, read: readFilter, sort };

  return (
    <div>
      <PageHeader
        title="Contact messages"
        subtitle={
          unreadCount > 0
            ? `${unreadCount} unread · ${totalCount} total`
            : `${totalCount} total`
        }
        actions={unreadCount > 0 && <MarkAllContactRead disabled={false} />}
      />

      <DataTableToolbar
        action={PATH}
        search={q}
        searchPlaceholder="Search sender, subject, or message..."
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
        ]}
        sort={sort}
        defaultSort={SORT_DEFAULT}
        sortOptions={[...SORT_OPTIONS]}
        resultCount={total}
      />

      {rows.length === 0 ? (
        hasFilters ? (
          <EmptyState
            icon={Mail}
            title="No messages match these filters"
            description="Try clearing the search or status filter."
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
            icon={Mail}
            title="No messages yet"
            description="Submissions from the contact form will appear here."
          />
        )
      ) : (
        <div className="space-y-3">
          {rows.map((m) => (
            <Card
              key={m.id}
              className={`p-4 transition-colors ${
                m.read ? "opacity-90" : "border-blue-200 bg-blue-50/30"
              }`}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  {!m.read && <Badge color="cyan">New</Badge>}
                  <span
                    className={`font-semibold ${
                      m.read ? "text-career-heading" : "text-career-heading"
                    }`}
                  >
                    {m.name}
                  </span>
                  <a
                    href={`mailto:${m.email}`}
                    className="text-xs text-blue-700 hover:underline"
                  >
                    {m.email}
                  </a>
                </div>
                <span className="text-xs text-slate-500">
                  {new Date(m.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="mt-1 text-sm font-semibold text-slate-700">{m.subject}</p>
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">{m.message}</p>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <ContactReadToggle id={m.id} read={m.read} />
                <div className="flex items-center gap-3 text-xs font-semibold">
                  <Link
                    href={`/admin/contact/${m.id}`}
                    className="inline-flex items-center gap-1 text-blue-700 hover:underline"
                  >
                    View <ChevronRight className="size-3.5" />
                  </Link>
                  <DeleteButton
                    id={m.id}
                    action={deleteContactSubmission}
                    message={`Delete the message "${m.subject}" from ${m.name}? This cannot be undone.`}
                    label="Delete"
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Pagination
        page={page}
        total={total}
        pageSize={PAGE_SIZE}
        hrefFor={(p) => buildListHref(PATH, params, p)}
      />
    </div>
  );
}
