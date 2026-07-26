import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  MailOpen,
  Calendar,
  Phone,
  User,
  AtSign,
  Trash2,
} from "lucide-react";
import { requirePermission } from "@/lib/auth-guard";
import { prisma } from "@/lib/db";
import { deleteApplication } from "@/lib/actions";
import { PageHeader, Card, Badge } from "@/components/admin/ui";
import DeleteButton from "../../DeleteButton";
import ApplicationReadToggle from "../ApplicationReadToggle";
import MarkApplicationAsReadOnMount from "../MarkApplicationAsReadOnMount";

type Params = Promise<{ id: string }>;

/** Server action wired to the inline Delete button. After deleting, it
 *  returns the user to the applications list. */
async function deleteAndRedirect(id: string) {
  "use server";
  const res = await deleteApplication(id);
  if (res.ok) redirect("/admin/applications");
  return res;
}

export default async function ViewApplicationPage({ params }: { params: Params }) {
  const { id } = await params;
  await requirePermission("applications.view");

  const application = await prisma.application.findUnique({
    where: { id },
    include: { job: { select: { id: true, title: true, type: true, mode: true, location: true } } },
  });
  if (!application) notFound();

  // Neighbour navigation (older / newer by createdAt, same job).
  const [prev, next] = await Promise.all([
    prisma.application.findFirst({
      where: { jobId: application.jobId, createdAt: { gt: application.createdAt } },
      orderBy: { createdAt: "asc" },
      select: { id: true, name: true },
    }),
    prisma.application.findFirst({
      where: { jobId: application.jobId, createdAt: { lt: application.createdAt } },
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true },
    }),
  ]);

  return (
    <div>
      <MarkApplicationAsReadOnMount id={application.id} enabled={!application.read} />

      <nav className="mb-3 flex items-center gap-1 text-xs text-slate-500">
        <Link
          href="/admin/applications"
          className="inline-flex items-center gap-1 hover:text-primary-navy"
        >
          <ChevronLeft className="size-3.5" /> Job applications
        </Link>
        <span aria-hidden="true">/</span>
        <span className="line-clamp-1 font-semibold text-slate-700">
          {application.name} — {application.job.title}
        </span>
      </nav>

      <PageHeader
        title={`${application.name}`}
        subtitle={`Application for ${application.job.title} · Received ${new Date(application.createdAt).toLocaleString()}`}
        actions={
          <Link
            href="/admin/applications"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            <ChevronLeft className="size-3.5" /> Back to applications
          </Link>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card className="p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Badge color={application.read ? "slate" : "cyan"}>
                  {application.read ? "Read" : "Unread"}
                </Badge>
                <span className="text-xs text-slate-500">
                  Received {new Date(application.createdAt).toLocaleString()}
                </span>
              </div>
              <ApplicationReadToggle id={application.id} read={application.read} />
            </div>

            <h2 className="text-lg font-semibold text-career-heading">Cover letter</h2>
            {application.coverLetter ? (
              <pre className="mt-3 whitespace-pre-wrap break-words rounded-lg bg-slate-50 p-4 text-sm leading-relaxed text-slate-800">
                {application.coverLetter}
              </pre>
            ) : (
              <p className="mt-3 text-sm italic text-slate-500">
                No cover letter was provided.
              </p>
            )}

            <div className="mt-5 border-t border-slate-100 pt-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-career-heading">Resume / CV</h2>
                {application.resumePath && application.resumeName && (
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                    Attached
                  </span>
                )}
              </div>

              {application.resumePath && application.resumeName ? (
                <a
                  href={application.resumePath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 transition-colors hover:border-slate-300"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-white">
                    <svg
                      className="size-4 text-slate-600"
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
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-sm font-semibold text-career-heading">
                      {application.resumeName}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {application.resumeSize
                        ? `${(application.resumeSize / 1024).toFixed(1)} KB`
                        : ""}
                      {application.resumeMime ? ` · ${application.resumeMime}` : ""}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-blue-700 hover:underline">
                    Download
                  </span>
                </a>
              ) : (
                <div className="mt-3 flex items-center gap-3 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-3 text-sm text-slate-500">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-white">
                    <svg
                      className="size-4 text-slate-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 13h6m-3-3v6m9-6v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h7l3 3z"
                      />
                    </svg>
                  </span>
                  <div>
                    <p className="font-semibold text-slate-700">No resume attached</p>
                    <p className="text-[11px] text-slate-500">
                      The applicant didn&apos;t upload a file with this application.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
              Other applications for this role
            </h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {prev ? (
                <Link
                  href={`/admin/applications/${prev.id}`}
                  className="group flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-3 transition-colors hover:border-slate-300"
                >
                  <ChevronLeft className="size-4 text-slate-400 group-hover:text-primary-navy" />
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold tracking-wide text-slate-400 uppercase">
                      Older
                    </p>
                    <p className="line-clamp-1 text-sm font-semibold text-career-heading">
                      {prev.name}
                    </p>
                  </div>
                </Link>
              ) : (
                <div className="flex items-center gap-2 rounded-lg border border-dashed border-slate-200 p-3 text-xs text-slate-400">
                  <ChevronLeft className="size-4" />
                  <span>No earlier applicant</span>
                </div>
              )}
              {next ? (
                <Link
                  href={`/admin/applications/${next.id}`}
                  className="group flex items-center justify-end gap-2 rounded-lg border border-slate-200 bg-white p-3 text-right transition-colors hover:border-slate-300"
                >
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold tracking-wide text-slate-400 uppercase">
                      Newer
                    </p>
                    <p className="line-clamp-1 text-sm font-semibold text-career-heading">
                      {next.name}
                    </p>
                  </div>
                  <ChevronRight className="size-4 text-slate-400 group-hover:text-primary-navy" />
                </Link>
              ) : (
                <div className="flex items-center justify-end gap-2 rounded-lg border border-dashed border-slate-200 p-3 text-xs text-slate-400">
                  <span>No later applicant</span>
                  <ChevronRight className="size-4" />
                </div>
              )}
            </div>
          </Card>
        </div>

        <aside className="space-y-4">
          <Card className="p-5">
            <h3 className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
              Applicant
            </h3>
            <div className="mt-3 flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">
                {application.name[0]?.toUpperCase() ?? "?"}
              </span>
              <div className="min-w-0">
                <p className="truncate font-semibold text-career-heading">{application.name}</p>
                <a
                  href={`mailto:${application.email}`}
                  className="inline-flex items-center gap-1 text-xs text-blue-700 hover:underline"
                >
                  <AtSign className="size-3" />
                  {application.email}
                </a>
              </div>
            </div>
            <div className="mt-4 grid gap-2 text-xs text-slate-500">
              <p className="flex items-center gap-2">
                <User className="size-3.5" /> {application.name}
              </p>
              <p className="flex items-center gap-2">
                <AtSign className="size-3.5" />
                <a href={`mailto:${application.email}`} className="hover:underline">
                  {application.email}
                </a>
              </p>
              {application.phone && (
                <p className="flex items-center gap-2">
                  <Phone className="size-3.5" />
                  <a href={`tel:${application.phone}`} className="hover:underline">
                    {application.phone}
                  </a>
                </p>
              )}
              <p className="flex items-center gap-2">
                <Calendar className="size-3.5" />
                {new Date(application.createdAt).toLocaleString()}
              </p>
              {application.read && application.readAt && (
                <p className="flex items-center gap-2">
                  <MailOpen className="size-3.5" /> Read {new Date(application.readAt).toLocaleString()}
                </p>
              )}
            </div>
          </Card>

          <Card className="border-red-200 bg-red-50/50 p-5">
            <h3 className="text-xs font-semibold tracking-wide text-red-700 uppercase">
              Danger zone
            </h3>
            <p className="mt-2 text-xs text-slate-600">
              Delete this application permanently. This cannot be undone.
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold">
              <Trash2 className="size-3.5 text-red-600" />
              <DeleteButton
                id={application.id}
                action={deleteAndRedirect}
                message={`Delete the application from ${application.name} for "${application.job.title}"? This cannot be undone.`}
                label="Delete application"
              />
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
