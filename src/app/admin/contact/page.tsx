import { requireAdmin } from "@/lib/auth-guard";
import { getContactSubmissions } from "@/lib/data-access";

export default async function ContactMessagesPage() {
  await requireAdmin();
  const msgs = await getContactSubmissions();

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Contact messages</h1>
      <p className="mt-1 text-sm text-slate-500">{msgs.length} total</p>

      <div className="mt-6 space-y-3">
        {msgs.map((m) => (
          <div key={m.id} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <span className="font-semibold text-slate-900">{m.name}</span>
                <a href={`mailto:${m.email}`} className="ml-2 text-xs text-blue-700 hover:underline">{m.email}</a>
              </div>
              <span className="text-xs text-slate-500">{new Date(m.createdAt).toLocaleString()}</span>
            </div>
            <p className="mt-1 text-sm font-medium text-slate-700">{m.subject}</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{m.message}</p>
          </div>
        ))}
        {msgs.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">
            No messages yet.
          </div>
        )}
      </div>
    </div>
  );
}
