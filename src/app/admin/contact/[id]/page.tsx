import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  MailOpen,
  Calendar,
  User,
  AtSign,
  Trash2,
} from "lucide-react";
import { requirePermission } from "@/lib/auth-guard";
import { prisma } from "@/lib/db";
import { deleteContactSubmission } from "@/lib/actions";
import { PageHeader, Card, Badge } from "@/components/admin/ui";
import DeleteButton from "../../DeleteButton";
import ContactReadToggle from "../ContactReadToggle";
import MarkAsReadOnMount from "../MarkAsReadOnMount";

type Params = Promise<{ id: string }>;

/** Server action wired to the inline Delete button. After deleting, it
 *  returns the user to the messages list. */
async function deleteAndRedirect(id: string) {
  "use server";
  const res = await deleteContactSubmission(id);
  if (res.ok) redirect("/admin/contact");
  return res;
}

export default async function ViewContactMessagePage({ params }: { params: Params }) {
  const { id } = await params;
  await requirePermission("contact.view");

  const message = await prisma.contactSubmission.findUnique({ where: { id } });
  if (!message) notFound();

  // Neighbour navigation (older / newer by createdAt).
  const [prev, next] = await Promise.all([
    prisma.contactSubmission.findFirst({
      where: { createdAt: { gt: message.createdAt } },
      orderBy: { createdAt: "asc" },
      select: { id: true, subject: true },
    }),
    prisma.contactSubmission.findFirst({
      where: { createdAt: { lt: message.createdAt } },
      orderBy: { createdAt: "desc" },
      select: { id: true, subject: true },
    }),
  ]);

  return (
    <div>
      {/* Mark the message as read on the client (server-rendered revalidation
          is not allowed during a page render). */}
      <MarkAsReadOnMount id={message.id} enabled={!message.read} />

      <nav className="mb-3 flex items-center gap-1 text-xs text-slate-500">
        <Link href="/admin/contact" className="inline-flex items-center gap-1 hover:text-primary-navy">
          <ChevronLeft className="size-3.5" /> Contact messages
        </Link>
        <span aria-hidden="true">/</span>
        <span className="line-clamp-1 font-semibold text-slate-700">{message.subject}</span>
      </nav>

      <PageHeader
        title={message.subject}
        subtitle={`From ${message.name} · ${new Date(message.createdAt).toLocaleString()}`}
        actions={
          <Link
            href="/admin/contact"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            <ChevronLeft className="size-3.5" /> Back to messages
          </Link>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card className="p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Badge color={message.read ? "slate" : "cyan"}>
                  {message.read ? "Read" : "Unread"}
                </Badge>
                <span className="text-xs text-slate-500">
                  Received {new Date(message.createdAt).toLocaleString()}
                </span>
              </div>
              <ContactReadToggle id={message.id} read={message.read} />
            </div>

            <h2 className="text-lg font-semibold text-career-heading">Message</h2>
            <pre className="mt-3 whitespace-pre-wrap break-words rounded-lg bg-slate-50 p-4 text-sm leading-relaxed text-slate-800">
              {message.message}
            </pre>
          </Card>

          <Card className="p-5">
            <h3 className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
              Navigate
            </h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {prev ? (
                <Link
                  href={`/admin/contact/${prev.id}`}
                  className="group flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-3 transition-colors hover:border-slate-300"
                >
                  <ChevronLeft className="size-4 text-slate-400 group-hover:text-primary-navy" />
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold tracking-wide text-slate-400 uppercase">
                      Older
                    </p>
                    <p className="line-clamp-1 text-sm font-semibold text-career-heading">
                      {prev.subject}
                    </p>
                  </div>
                </Link>
              ) : (
                <div className="flex items-center gap-2 rounded-lg border border-dashed border-slate-200 p-3 text-xs text-slate-400">
                  <ChevronLeft className="size-4" />
                  <span>No older message</span>
                </div>
              )}
              {next ? (
                <Link
                  href={`/admin/contact/${next.id}`}
                  className="group flex items-center justify-end gap-2 rounded-lg border border-slate-200 bg-white p-3 text-right transition-colors hover:border-slate-300"
                >
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold tracking-wide text-slate-400 uppercase">
                      Newer
                    </p>
                    <p className="line-clamp-1 text-sm font-semibold text-career-heading">
                      {next.subject}
                    </p>
                  </div>
                  <ChevronRight className="size-4 text-slate-400 group-hover:text-primary-navy" />
                </Link>
              ) : (
                <div className="flex items-center justify-end gap-2 rounded-lg border border-dashed border-slate-200 p-3 text-xs text-slate-400">
                  <span>No newer message</span>
                  <ChevronRight className="size-4" />
                </div>
              )}
            </div>
          </Card>
        </div>

        <aside className="space-y-4">
          <Card className="p-5">
            <h3 className="text-xs font-semibold tracking-wide text-slate-500 uppercase">Sender</h3>
            <div className="mt-3 flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">
                {message.name[0]?.toUpperCase() ?? "?"}
              </span>
              <div className="min-w-0">
                <p className="truncate font-semibold text-career-heading">{message.name}</p>
                <a
                  href={`mailto:${message.email}`}
                  className="inline-flex items-center gap-1 text-xs text-blue-700 hover:underline"
                >
                  <AtSign className="size-3" />
                  {message.email}
                </a>
              </div>
            </div>
            <div className="mt-4 grid gap-2 text-xs text-slate-500">
              <p className="flex items-center gap-2">
                <User className="size-3.5" /> {message.name}
              </p>
              <p className="flex items-center gap-2">
                <AtSign className="size-3.5" />
                <a href={`mailto:${message.email}`} className="hover:underline">
                  {message.email}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Calendar className="size-3.5" /> {new Date(message.createdAt).toLocaleString()}
              </p>
              {message.read && message.readAt && (
                <p className="flex items-center gap-2">
                  <MailOpen className="size-3.5" /> Read {new Date(message.readAt).toLocaleString()}
                </p>
              )}
            </div>
          </Card>

          <Card className="border-red-200 bg-red-50/50 p-5">
            <h3 className="text-xs font-semibold tracking-wide text-red-700 uppercase">
              Danger zone
            </h3>
            <p className="mt-2 text-xs text-slate-600">
              Delete this message permanently. This cannot be undone.
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold">
              <Trash2 className="size-3.5 text-red-600" />
              <DeleteButton
                id={message.id}
                action={deleteAndRedirect}
                message={`Delete the message "${message.subject}" from ${message.name}? This cannot be undone.`}
                label="Delete message"
              />
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
