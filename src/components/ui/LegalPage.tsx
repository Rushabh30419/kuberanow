import type { ReactNode } from "react";
import { PageHeader } from "./PageHeader";

type Section = { heading: string; body: ReactNode };

type Props = {
  title: string;
  updated: string;
  sections: Section[];
};

export function LegalPage({ title, updated, sections }: Props) {
  return (
    <>
      <PageHeader title={title} breadcrumb="Company" />
      <main className="bg-background-color mx-auto w-full max-w-3xl flex-1 px-4 py-12">
        <p className="text-xs font-medium text-slate-500">
          Last updated: {updated}
        </p>

        <div className="mt-8 space-y-8">
          {sections.map((s) => (
            <section key={s.heading}>
              <h2 className="text-xl font-semibold text-slate-900">
                {s.heading}
              </h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-600">
                {s.body}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-12 border-t border-slate-200 pt-6 text-xs text-slate-500">
          © 2026 K Globes Digital Media Private Limited. All Rights Reserved.
        </div>
      </main>
    </>
  );
}
