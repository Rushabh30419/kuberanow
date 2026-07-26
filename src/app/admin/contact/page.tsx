import { Mail } from "lucide-react";
import { requirePermission } from "@/lib/auth-guard";
import { getContactSubmissions } from "@/lib/data-access";
import { PageHeader, Card, EmptyState } from "@/components/admin/ui";

export default async function ContactMessagesPage() {
  await requirePermission("contact.view");
  const msgs = await getContactSubmissions();

  return (
    <div>
      <PageHeader title="Contact messages" subtitle={`${msgs.length} total`} />
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
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
