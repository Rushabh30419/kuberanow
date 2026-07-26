import { requireAdmin } from "@/lib/auth-guard";
import { getAllApplications } from "@/lib/data-access";

export default async function ApplicationsPage() {
  await requireAdmin();
  const apps = await getAllApplications();

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Job applications</h1>
      <p className="mt-1 text-sm text-slate-500">{apps.length} total</p>

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Applicant</th>
              <th className="hidden px-4 py-3 text-left font-semibold sm:table-cell">Role</th>
              <th className="hidden px-4 py-3 text-left font-semibold md:table-cell">Phone</th>
              <th className="hidden px-4 py-3 text-left font-semibold lg:table-cell">Cover note</th>
              <th className="px-4 py-3 text-left font-semibold">Received</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {apps.map((a) => (
              <tr key={a.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-900">{a.name}</div>
                  <a href={`mailto:${a.email}`} className="text-xs text-blue-700 hover:underline">{a.email}</a>
                </td>
                <td className="hidden px-4 py-3 text-slate-600 sm:table-cell">{a.job.title}</td>
                <td className="hidden px-4 py-3 text-slate-600 md:table-cell">{a.phone ?? "—"}</td>
                <td className="hidden max-w-xs px-4 py-3 text-slate-600 lg:table-cell">
                  <span className="line-clamp-2">{a.coverLetter ?? "—"}</span>
                </td>
                <td className="px-4 py-3 text-xs text-slate-500">
                  {new Date(a.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {apps.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                  No applications yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
