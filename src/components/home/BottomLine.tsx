"use client";

import { useRef } from "react";
import { useScrollReveal, useReducedMotionFallback } from "@/lib/gsap";

export function BottomLine() {
  const root = useRef<HTMLElement>(null);
  useScrollReveal(root, useReducedMotionFallback());

  return (
    <section
      id="bottom-line"
      ref={root}
      className="bg-kn-deep relative overflow-hidden py-14 lg:py-26"
    >
      <div className="relative mx-auto max-w-4xl px-0 text-center sm:px-6 lg:px-12">
        <h2
          data-reveal-heading="true"
          className="mt-6 text-3xl leading-tight font-bold text-slate-900 sm:text-4xl lg:text-5xl"
        >
          The capital is there. The audience is searching. The timing is{" "}
          <span className="from-amber-600 to-amber-800 bg-gradient-to-r bg-clip-text text-transparent">
            mathematically absolute.
          </span>
        </h2>

        <p
          data-reveal-item="true"
          className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-slate-600 lg:text-lg"
        >
          We are not simply launching a business digital TV — we are building the
          definitive home for Gujarati prosperity. KuberaNow arrives at the
          perfect inflection point.
        </p>

        <p
          data-reveal-item="true"
          className="mt-8 w-full border-t border-slate-200 pt-8 text-xs leading-relaxed text-slate-600 italic lg:text-sm"
        >
          Source &amp; methodology: Public data references from NSDL, CDSL, NSE,
          Government of Gujarat, Startup India/DPIIT and Udyam/MSME, combined with
          KuberaNow internal market research and estimates.
        </p>

        <footer className="mt-10 text-xs text-slate-500">
          © 2026 KuberaNow
        </footer>
      </div>
    </section>
  );
}
