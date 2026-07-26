"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
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
  };
};

export default function JobForm({ job }: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

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
      className="space-y-5"
    >
      {job && <input type="hidden" name="id" value={job.id} />}

      <Field label="Title">
        <input name="title" defaultValue={job?.title} required className={inputClass} />
      </Field>

      <Field label="Description">
        <textarea name="description" defaultValue={job?.description} rows={3} className={inputClass} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Experience"><input name="experience" defaultValue={job?.experience} className={inputClass} /></Field>
        <Field label="Salary"><input name="salary" defaultValue={job?.salary} className={inputClass} /></Field>
        <Field label="Location"><input name="location" defaultValue={job?.location} className={inputClass} /></Field>
        <Field label="Type"><input name="type" defaultValue={job?.type ?? "Full-time"} className={inputClass} /></Field>
        <Field label="Mode"><input name="mode" defaultValue={job?.mode ?? "On-site"} className={inputClass} /></Field>
        <label className="flex items-center gap-2 self-end pb-2 text-sm text-slate-700">
          <input type="checkbox" name="active" defaultChecked={job?.active ?? true} className="size-4 rounded border-slate-300" />
          Active (visible on site)
        </label>
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">{error}</div>}

      <div className="flex gap-2">
        <Button type="submit" disabled={pending} icon={Save}>
          {pending ? "Saving…" : job ? "Save changes" : "Create job"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/jobs")}>Cancel</Button>
      </div>
    </form>
  );
}
