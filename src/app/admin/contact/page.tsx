import { Mail } from "lucide-react";
import { requirePermission } from "@/lib/auth-guard";
import { prisma } from "@/lib/db";
import { deleteContactSubmission } from "@/lib/actions";
import { parsePage, PAGE_SIZE } from "@/lib/pagination";
import { PageHeader, Card, EmptyState } from "@/components/admin/ui";
import { Pagination } from "@/components/admin/Pagination";
import DeleteButton from "../DeleteButton";

export default async function ContactMessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  await requirePermission("contact.view");
  const { page: pageStr } = await searchParams;
  const page = parsePage(pageStr);
  const skip = (page - 1) * PAGE_SIZE;

  const [msgs, total] = await Promise.all([
    prisma.contactSubmission.findMany({ orderBy: { createdAt: "desc" }, skip, take: PAGE_SIZE }),
    prisma.contactSubmission.count(),
  ]);

  return (
    <div>
      <PageHeader title="Contact messages" subtitle={`${total} total`} />
      {msgs.length === 0 ? (
        <EmptyState icon={Mail} title="No messages yet" description="Submissions from the contact form will appear here." />
      ) : (
        <div className="space-y-3">
          {msgs.map((m) => (
            <Card key={m.id} className="p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <span className="font-semibold text-career-heading">{m.name}</span>
                  <a href={`mailto:${m.email}`} className="ml-2 text-xs text-blue-700 hover:underline">{m.email}</a>
                </div>
                <span className="text-xs text-slate-500">{new Date(m.createdAt).toLocaleString()}</span>
              </div>
              <p className="mt-1 text-sm font-semibold text-slate-700">{m.subject}</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{m.message}</p>
              <div className="mt-3 flex justify-end">
                <DeleteButton id={m.id} action={deleteContactSubmission} />
              </div>
            </Card>
          ))}
        </div>
      )}
      <Pagination
        page={page}
        total={total}
        pageSize={PAGE_SIZE}
        hrefFor={(p) => `/admin/contact?page=${p}`}
      />
    </div>
  );
}
