"use client";

import { useState } from "react";

export type Job = {
  title: string;
  experience: string;
  salary: string;
  location: string;
  type: string;
  mode: string;
};

const ICONS = {
  briefcase: (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path strokeLinecap="round" d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2" />
    </svg>
  ),
  rupee: (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 4h12M6 8h12M9 4c0 6 3 8 6 8M9 12l5 8" />
    </svg>
  ),
  pin: (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s-7-6.5-7-12a7 7 0 0114 0c0 5.5-7 12-7 12z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  ),
};

export function CareerBoard({ jobs }: { jobs: Job[] }) {
  const [query, setQuery] = useState("");

  const filtered = jobs.filter((j) =>
    j.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      {/* Heading + search */}
      <div className="border-career-stroke flex flex-col gap-4 border-b-2 pb-2 lg:flex-row lg:items-start lg:justify-between">
        <div className="relative flex h-8.25 shrink-0 items-center">
          <span className="bg-primary shadow-[2px_0px_0px_0px_var(--color-career-accent)] absolute left-0 h-5.5 w-1 rounded-xs" />
          <h3 className="text-career-heading pl-3 text-lg leading-7 font-bold md:text-2xl">
            Careers
          </h3>
        </div>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="border-career-input-border bg-surface flex h-10.5 w-full shrink-0 items-center gap-2 rounded-md border py-1 pr-1 pl-2 lg:ml-auto lg:max-w-80"
        >
          <svg className="text-career-muted size-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path strokeLinecap="round" d="M21 21l-4-4" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search opportunities"
            aria-label="Search opportunities"
            className="placeholder:text-career-muted text-career-dark flex-1 text-sm leading-4.5 bg-transparent focus:outline-none"
          />
          <button
            type="submit"
            className="bg-career-search shrink-0 rounded px-3 py-[9px] text-xs leading-4 font-semibold text-white transition-opacity hover:opacity-90"
          >
            Search
          </button>
        </form>
      </div>

      {/* Job grid */}
      <div className="grid grid-cols-1 justify-items-center gap-4 xs:grid-cols-2 md:gap-5 lg:grid-cols-3">
        {filtered.map((j) => (
          <article
            key={j.title}
            className="job-card border-career-stroke hover:shadow-job-card-hover flex h-fit w-full cursor-pointer flex-col rounded-lg border p-4 transition-shadow md:max-w-72.5"
          >
            <div className="border-career-stroke flex w-full flex-col gap-1 border-b pb-1">
              <h3 className="text-career-dark flex min-h-11 items-center text-lg leading-5.5 font-bold text-pretty">
                {j.title}
              </h3>
            </div>
            <div className="flex w-full flex-col gap-4 pt-3">
              <div className="flex w-full flex-col gap-3">
                <div className="flex items-center gap-2">
                  {ICONS.briefcase}
                  <p className="text-career-dark text-sm leading-4.5">{j.experience}</p>
                </div>
                <div className="flex items-center gap-2">
                  {ICONS.rupee}
                  <p className="text-career-dark text-sm leading-4.5">{j.salary}</p>
                </div>
                <div className="flex items-center gap-2">
                  {ICONS.pin}
                  <p className="text-career-dark text-sm leading-4.5">{j.location}</p>
                </div>
              </div>
              <div className="flex w-full items-start justify-between gap-2">
                <div className="flex flex-col gap-1.5">
                  <span className="border-career-stroke bg-career-tint text-career-dark inline-flex items-center justify-center rounded-[36px] border px-2.5 py-1 text-xs leading-4 font-semibold">
                    {j.type}
                  </span>
                  <span className="border-career-stroke bg-career-tint text-career-dark inline-flex items-center justify-center rounded-[36px] border px-2.5 py-1 text-xs leading-4 font-semibold">
                    {j.mode}
                  </span>
                </div>
                <a
                  href={`mailto:info@kuberanow.com?subject=Application: ${encodeURIComponent(j.title)}`}
                  className="text-primary inline-flex shrink-0 cursor-pointer items-center gap-1 rounded text-sm leading-4.5 font-semibold hover:underline"
                >
                  Apply
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-career-muted py-8 text-center text-sm">
          No openings match &quot;{query}&quot;. Try a different keyword.
        </p>
      )}
    </>
  );
}
