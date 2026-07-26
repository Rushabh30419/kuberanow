"use client";

import { useRef, useState, useTransition, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FileText,
  Upload,
  X,
  Loader2,
} from "lucide-react";
import { applyForJob } from "@/lib/actions";

type JobSummary = {
  id: string;
  title: string;
  location: string;
  type: string;
  mode: string;
};

type Props = {
  job: JobSummary;
};

const ALLOWED_EXT = ["pdf", "doc", "docx"];
const ALLOWED_MIME = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const MAX_BYTES = 5 * 1024 * 1024;
const INPUT_ID = "apply-resume-input";

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

function getExt(name: string) {
  const i = name.lastIndexOf(".");
  return i >= 0 ? name.slice(i + 1).toLowerCase() : "";
}

export default function ApplyForm({ job }: Props) {
  const router = useRouter();
  const { data: session } = useSession();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [resume, setResume] = useState<File | null>(null);
  const [resumeError, setResumeError] = useState<string | null>(null);
  // The single, persistent file input lives in the DOM at all times so that
  // its `files` list is included in the surrounding form's submit payload.
  // A ref lets the "Remove" button clear it without re-rendering the input.
  const inputRef = useRef<HTMLInputElement>(null);

  const onResumeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setResumeError(null);
    const file = e.target.files?.[0] ?? null;
    if (!file) {
      setResume(null);
      return;
    }
    const ext = getExt(file.name);
    if (!ALLOWED_EXT.includes(ext) && !ALLOWED_MIME.includes(file.type)) {
      setResume(null);
      setResumeError("Resume must be a PDF, DOC, or DOCX file.");
      // Clear the input so the same file can be re-selected.
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    if (file.size > MAX_BYTES) {
      setResume(null);
      setResumeError("Resume must be 5 MB or smaller.");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    setResume(file);
  };

  const clearResume = () => {
    setResume(null);
    setResumeError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  if (success) {
    return (
      <div className="border-border-soft bg-surface shadow-content-panel w-full max-w-2xl rounded-lg border p-6 md:p-10">
        <div className="flex flex-col items-center text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-emerald-50">
            <CheckCircle2 className="size-8 text-emerald-600" />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-career-heading">Application submitted</h2>
          <p className="mt-2 max-w-md text-sm text-slate-600">
            Thanks for applying to <strong>{job.title}</strong>. Our team will review your
            application and reach out to you at the email you provided.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <Link
              href="/career"
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <ArrowLeft className="size-4" /> Back to careers
            </Link>
            {session?.user ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
              >
                View my applications <ArrowRight className="size-4" />
              </Link>
            ) : (
              <Link
                href="/login?callbackUrl=/career"
                className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
              >
                Sign in to track status <ArrowRight className="size-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      action={(fd) => {
        setError(null);
        // Make sure the chosen file is part of the payload even if React
        // state is out of sync with the input element. The persistent input
        // is below and lives inside this form, so its `files` are already
        // included in `fd` automatically.
        fd.set("jobId", job.id);
        start(async () => {
          const res = await applyForJob(fd);
          if (res.ok) {
            setSuccess(true);
            router.refresh();
          } else {
            setError(res.error ?? "Submission failed.");
          }
        });
      }}
      className="border-border-soft bg-surface shadow-content-panel w-full max-w-2xl rounded-lg border p-5 md:p-8"
    >
      <div className="border-career-stroke mb-6 flex items-start justify-between gap-3 border-b-2 pb-4">
        <div>
          <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
            Apply for
          </p>
          <h1 className="mt-1 text-xl font-bold text-career-heading md:text-2xl">
            {job.title}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {job.location} · {job.type} · {job.mode}
          </p>
        </div>
        <Link
          href={`/career/${job.id}`}
          className="text-xs font-semibold text-slate-500 hover:text-primary"
        >
          View role details
        </Link>
      </div>

      <div className="grid gap-5">
        <Field label="Full name" required>
          <input
            name="name"
            required
            defaultValue={session?.user?.name ?? ""}
            placeholder="e.g. Aarav Sharma"
            className={inputClass}
          />
        </Field>

        <Field label="Email" required>
          <input
            type="email"
            name="email"
            required
            defaultValue={session?.user?.email ?? ""}
            placeholder="you@example.com"
            className={inputClass}
          />
        </Field>

        <Field label="Phone" hint="Optional — include the country code for best results.">
          <input
            type="tel"
            name="phone"
            placeholder="+91 98765 43210"
            className={inputClass}
          />
        </Field>

        <Field label="Cover note" hint="Optional — a few lines about why you&apos;re a good fit.">
          <textarea
            name="coverLetter"
            rows={4}
            placeholder="Tell us about your background, what excites you about this role, and any relevant experience."
            className={inputClass}
          />
        </Field>

        <Field
          label="Resume / CV"
          hint="PDF, DOC, or DOCX. Up to 5 MB. Optional but recommended."
        >
          <ResumePicker
            inputId={INPUT_ID}
            inputRef={inputRef}
            file={resume}
            error={resumeError}
            onChange={onResumeChange}
            onClear={clearResume}
          />
        </Field>
      </div>

      {error && (
        <div
          role="alert"
          className="mt-5 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="bg-primary hover:bg-dark-navy1 inline-flex items-center gap-1.5 rounded-md px-5 py-2.5 text-sm font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Submitting…
            </>
          ) : (
            <>
              Submit application <ArrowRight className="size-4" />
            </>
          )}
        </button>
        <Link
          href={`/career/${job.id}`}
          className="text-sm font-semibold text-slate-500 hover:text-primary"
        >
          Cancel
        </Link>
        {!session && (
          <p className="ml-auto text-xs text-slate-500">
            Already have an account?{" "}
            <Link
              href={`/login?callbackUrl=/career/${job.id}/apply`}
              className="text-blue-700 hover:underline"
            >
              Sign in
            </Link>{" "}
            to track this application.
          </p>
        )}
      </div>
    </form>
  );
}

const inputClass =
  "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm leading-5 text-slate-800 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-slate-400";

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline justify-between">
        <span className="text-xs font-semibold text-slate-700">
          {label}
          {required && <span className="ml-0.5 text-red-600">*</span>}
        </span>
        {hint && (
          <span
            className="text-[10px] text-slate-400"
            dangerouslySetInnerHTML={{ __html: hint }}
          />
        )}
      </span>
      {children}
    </label>
  );
}

function ResumePicker({
  inputId,
  inputRef,
  file,
  error,
  onChange,
  onClear,
}: {
  inputId: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  file: File | null;
  error: string | null;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
}) {
  return (
    <div>
      {/* The input is always rendered once and lives inside the surrounding
          form, so its `files` are part of the submit payload. */}
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        name="resume"
        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={onChange}
        className="sr-only"
      />

      {file ? (
        <div className="flex items-center gap-3 rounded-md border border-emerald-200 bg-emerald-50/40 p-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-emerald-100">
            <FileText className="size-4 text-emerald-700" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="line-clamp-1 text-sm font-semibold text-slate-800">{file.name}</p>
            <p className="text-[11px] text-slate-500">
              {formatBytes(file.size)} · {file.type || getExt(file.name).toUpperCase() || "file"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            <X className="size-3" /> Remove
          </button>
        </div>
      ) : (
        <label
          htmlFor={inputId}
          className={`flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-md border-2 border-dashed px-4 py-6 text-center transition-colors ${
            error
              ? "border-red-300 bg-red-50/40 text-red-700"
              : "border-slate-300 bg-slate-50 text-slate-600 hover:border-primary hover:bg-blue-50/30 hover:text-primary"
          }`}
        >
          <Upload className="size-5" />
          <span className="text-sm font-semibold">Click to upload your resume</span>
          <span className="text-[11px] text-slate-500">PDF, DOC, or DOCX · up to 5 MB</span>
        </label>
      )}

      {error && (
        <p className="mt-1.5 text-xs text-red-700" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
