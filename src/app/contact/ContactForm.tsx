"use client";

import { useState, useTransition } from "react";
import { submitContact } from "@/lib/actions";

export default function ContactForm() {
  const [pending, start] = useTransition();
  const [ok, setOk] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <article className="border-career-stroke bg-surface shadow-contact-card rounded-md border p-3 lg:rounded-lg lg:p-5">
      <div className="flex items-center gap-3">
        <GradientEnvelope />
        <h2 className="text-career-heading text-base font-bold lg:text-xl">
          Send us a message
        </h2>
      </div>

      {ok && (
        <div className="mt-4 rounded border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-800">
          Thanks — your message has been received. We&apos;ll respond within 48 business hours.
        </div>
      )}
      {error && (
        <div className="mt-4 rounded border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <form
        action={(fd) =>
          start(async () => {
            setError(null);
            setOk(false);
            const res = await submitContact(fd);
            if (res.ok) {
              setOk(true);
              (document.getElementById("contact-form") as HTMLFormElement | null)?.reset();
            } else {
              setError(res.error ?? "Something went wrong.");
            }
          })
        }
        id="contact-form"
        className="mt-4 grid gap-4 sm:grid-cols-2"
      >
        <Field label="Your name" name="name" required />
        <Field label="Email" name="email" type="email" required />
        <div className="sm:col-span-2">
          <Field label="Subject" name="subject" required />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-semibold text-career-dark">
            Message
          </label>
          <textarea
            name="message"
            required
            rows={4}
            className="border-career-stroke focus:border-primary w-full rounded border bg-white px-3 py-2 text-sm outline-none transition"
            placeholder="How can we help?"
          />
        </div>
        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={pending}
            className="bg-primary hover:bg-dark-navy1 rounded-md px-5 py-2.5 text-sm font-semibold text-white transition disabled:opacity-60"
          >
            {pending ? "Sending…" : "Send message"}
          </button>
        </div>
      </form>
    </article>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-career-dark">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        className="border-career-stroke focus:border-primary w-full rounded border bg-white px-3 py-2 text-sm outline-none transition"
      />
    </div>
  );
}

function GradientEnvelope() {
  return (
    <span className="flex size-8 items-center justify-center rounded-md bg-gradient-to-br from-blue-600 to-cyan-500 text-white">
      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7l9 6 9-6" />
      </svg>
    </span>
  );
}
