"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Briefcase, ListChecks, Save } from "lucide-react";
import { upsertJob } from "@/lib/actions";
import { Button, Field, inputClass } from "@/components/admin/ui";

type Props = {
  job?: {
    id: string;
    title: string;
    description: string;
    experience: string;
    salary: string;
    location: string;
    type: string;
    mode: string;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
};

const TYPE_OPTIONS = ["Full-time", "Part-time", "Contract", "Internship", "Freelance"] as const;
const MODE_OPTIONS = ["On-site", "Remote", "Hybrid"] as const;

export default function JobForm({ job }: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const initialType = TYPE_OPTIONS.includes(job?.type as (typeof TYPE_OPTIONS)[number])
    ? (job?.type as (typeof TYPE_OPTIONS)[number])
    : "Full-time";
  const initialMode = MODE_OPTIONS.includes(job?.mode as (typeof MODE_OPTIONS)[number])
    ? (job?.mode as (typeof MODE_OPTIONS)[number])
    : "On-site";

  return (
    <form
      action={(fd) =>
        start(async () => {
          setError(null);
          const res = await upsertJob(fd);
          if (res.ok) {
            router.push("/admin/jobs");
            router.refresh();
          } else {
            setError(res.error ?? "Save failed.");
          }
        })
      }
      className="space-y-6"
    >
      {job && <input type="hidden" name="id" value={job.id} />}

      {/* Basics */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <header className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Briefcase className="size-4 text-primary-navy" />
          <h2 className="text-sm font-semibold text-career-heading">Basics</h2>
        </header>
        <div className="grid gap-4">
          <Field label="Job title" hint="Shown on the careers page and the public listing.">
            <input
              name="title"
              defaultValue={job?.title}
              required
              maxLength={120}
              placeholder="e.g. Senior Equity Research Analyst"
              className={inputClass}
            />
          </Field>
          <Field label="Short description" hint="One or two sentences shown on the careers listing.">
            <textarea
              name="description"
              defaultValue={job?.description}
              required
              rows={3}
              placeholder="What the role is about, who it reports to, and what success looks like."
              className={inputClass}
            />
          </Field>
        </div>
      </section>

      {/* Details */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <header className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
          <ListChecks className="size-4 text-primary-navy" />
          <h2 className="text-sm font-semibold text-career-heading">Details</h2>
        </header>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Experience" hint="Free text — e.g. 3–5 years, Fresher, 7+ yrs.">
            <input name="experience" defaultValue={job?.experience} placeholder="3–5 years" className={inputClass} />
          </Field>
          <Field label="Salary" hint="Range, band, or 'Best in industry'. Optional.">
            <input name="salary" defaultValue={job?.salary} placeholder="₹12–18 LPA" className={inputClass} />
          </Field>
          <Field label="Location" hint="City, region, or 'Anywhere' for remote.">
            <input
              name="location"
              defaultValue={job?.location}
              required
              placeholder="Mumbai, India"
              className={inputClass}
            />
          </Field>
          <Field label="Type">
            <select name="type" defaultValue={initialType} className={inputClass}>
              {TYPE_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Mode">
            <select name="mode" defaultValue={initialMode} className={inputClass}>
              {MODE_OPTIONS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </Field>
          <label className="flex items-start gap-2 self-end pb-2 text-sm text-slate-700">
            <input
              type="checkbox"
              name="active"
              defaultChecked={job?.active ?? true}
              className="mt-0.5 size-4 rounded border-slate-300 text-primary-navy focus:ring-primary-navy"
            />
            <span>
              <span className="font-semibold text-slate-800">Active</span>
              <span className="block text-xs text-slate-500">
                Visible on the public careers page. Uncheck to hide without deleting.
              </span>
            </span>
          </label>
        </div>
      </section>

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <Button type="submit" disabled={pending} icon={Save}>
          {pending ? "Saving…" : job ? "Save changes" : "Create job"}
        </Button>
        <Link
          href="/admin/jobs"
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
        >
          <ArrowLeft className="size-4" />
          Cancel
        </Link>
        {job && (
          <p className="ml-auto text-xs text-slate-500">
            Created {new Date(job.createdAt).toLocaleDateString()}
            {job.updatedAt.getTime() !== job.createdAt.getTime() && (
              <> · Last edited {new Date(job.updatedAt).toLocaleDateString()}</>
            )}
          </p>
        )}
      </div>
    </form>
  );
}
