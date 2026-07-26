import Link from "next/link";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth-guard";
import { getSavedCalculations, getApplications } from "@/lib/data-access";
import { deleteSavedCalculation } from "@/lib/actions";
import DeleteButton from "../admin/DeleteButton";

export const metadata = { title: "Your dashboard · KuberaNow" };

const CALC_LABELS: Record<string, string> = {
  sip: "SIP",
  fd: "FD",
  emi: "EMI",
  tax: "Tax",
  swp: "SWP",
};

export default async function DashboardPage() {
  const user = await requireUser();

  // Admins and editors belong in the admin console — send them there.
  if (user.role !== "reader") {
    redirect("/admin");
  }

  const [calcs, apps] = await Promise.all([
    getSavedCalculations(user.id),
    getApplications(user.id),
  ]);

  return (
    <main className="bg-background-color mx-auto w-full max-w-5xl flex-1 px-4 py-10">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Your dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">
            Welcome back, {user.name ?? user.email}.
          </p>
        </div>
      </div>

      {/* Saved calculations */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold text-slate-900">Saved calculations</h2>
        {calcs.length === 0 ? (
          <div className="mt-3 rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
            No saved calculations yet.{" "}
            <Link href="/tools/sip" className="text-blue-700 hover:underline">Try a calculator →</Link>
          </div>
        ) : (
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {calcs.map((c) => (
              <div key={c.id} className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700 uppercase">
                    {CALC_LABELS[c.type] ?? c.type}
                  </span>
                  <span className="text-xs text-slate-400">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {c.label && <p className="mt-2 text-sm font-medium text-slate-900">{c.label}</p>}
                <pre className="mt-2 overflow-x-auto rounded bg-slate-50 p-2 text-xs text-slate-600">
                  {JSON.stringify({ inputs: c.inputs, result: c.result }, null, 2)}
                </pre>
                <div className="mt-3">
                  <DeleteButton id={c.id} action={deleteSavedCalculation} />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Applications */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold text-slate-900">Your job applications</h2>
        {apps.length === 0 ? (
          <div className="mt-3 rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
            No applications yet.{" "}
            <Link href="/career" className="text-blue-700 hover:underline">Browse openings →</Link>
          </div>
        ) : (
          <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Role</th>
                  <th className="px-4 py-3 text-left font-semibold">Applied on</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {apps.map((a) => (
                  <tr key={a.id}>
                    <td className="px-4 py-3 font-medium text-slate-900">{a.jobTitle}</td>
                    <td className="px-4 py-3 text-slate-600">{new Date(a.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
