"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";

type Form = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const EMPTY: Form = { name: "", email: "", subject: "", message: "" };

export default function ContactPage() {
  const [form, setForm] = useState<Form>(EMPTY);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function update<K extends keyof Form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError("Please fill in your name, email and message.");
      return;
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
    if (!emailOk) {
      setError("Please enter a valid email address.");
      return;
    }
    // Simulated submit (no backend wired up in this clone)
    setSubmitted(true);
    setForm(EMPTY);
  }

  return (
    <>
      <PageHeader
        title="Contact Us"
        subtitle="Questions, feedback, story tips or partnership ideas — we'd love to hear from you."
        breadcrumb="Company"
      />
      <main className="bg-background-color mx-auto w-full max-w-5xl flex-1 px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* Form */}
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">
              Send us a message
            </h2>

            {submitted ? (
              <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-6 text-center">
                <div className="text-3xl">✅</div>
                <p className="mt-2 font-semibold text-green-800">
                  Thank you! Your message has been received.
                </p>
                <p className="mt-1 text-sm text-green-700">
                  Our team will get back to you within 1-2 business days.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 text-sm font-medium text-green-800 underline underline-offset-2"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    label="Name"
                    value={form.name}
                    onChange={(v) => update("name", v)}
                    placeholder="Your full name"
                    required
                  />
                  <Field
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={(v) => update("email", v)}
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <Field
                  label="Subject"
                  value={form.subject}
                  onChange={(v) => update("subject", v)}
                  placeholder="What is this about?"
                />
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={form.message}
                    onChange={(e) => update("message", e.target.value)}
                    placeholder="Write your message..."
                    rows={5}
                    required
                    className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  />
                </div>

                {error && (
                  <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full rounded-full bg-blue-700 px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02] sm:w-auto"
                >
                  Send message →
                </button>
              </form>
            )}
          </div>

          {/* Details */}
          <aside className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-semibold tracking-wider text-slate-500 uppercase">
                Editorial
              </h3>
              <p className="mt-2 text-sm text-slate-700">
                tips@kuberanow.com
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-semibold tracking-wider text-slate-500 uppercase">
                Advertising
              </h3>
              <p className="mt-2 text-sm text-slate-700">
                sales@kuberanow.com
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-semibold tracking-wider text-slate-500 uppercase">
                Office
              </h3>
              <p className="mt-2 text-sm text-slate-700">
                GIFT City, Gandhinagar
                <br />
                Gujarat 382355, India
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-blue-50 to-white p-6 shadow-sm">
              <h3 className="text-sm font-semibold tracking-wider text-blue-700 uppercase">
                Response time
              </h3>
              <p className="mt-2 text-sm text-slate-700">
                We typically reply within 1-2 business days.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
      />
    </div>
  );
}
