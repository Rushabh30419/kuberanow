"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { upsertJob } from "@/lib/actions";

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

      <div>
        <label className="mb-1.5 block text-xs font-semibold text-slate-700">Title</label>
        <input
          name="title"
          defaultValue={job?.title}
          required
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold text-slate-700">Description</label>
        <textarea
          name="description"
          defaultValue={job?.description}
          rows={3}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-700">Experience</label>
          <input
            name="experience"
            defaultValue={job?.experience}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-700">Salary</label>
          <input
            name="salary"
            defaultValue={job?.salary}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-700">Location</label>
          <input
            name="location"
            defaultValue={job?.location}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-700">Type</label>
          <input
            name="type"
            defaultValue={job?.type ?? "Full-time"}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-700">Mode</label>
          <input
            name="mode"
            defaultValue={job?.mode ?? "On-site"}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              name="active"
              defaultChecked={job?.active ?? true}
              className="size-4 rounded border-slate-300"
            />
            Active (visible on site)
          </label>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-blue-700 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
        >
          {pending ? "Saving…" : job ? "Save changes" : "Create job"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/jobs")}
          className="rounded-lg border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-700 hover:border-slate-400"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
