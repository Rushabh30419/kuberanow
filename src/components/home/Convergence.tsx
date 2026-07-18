"use client";

import { useRef, useState } from "react";
import { gsap, registerGsapPlugins, useGSAP, ScrollTrigger, useReducedMotionFallback } from "@/lib/gsap";

type Stat = {
  id: string;
  label: string;
  value: string;
  metric: string;
  heading: string;
  description: string;
};

const STATS: Stat[] = [
  {
    id: "demat-weight",
    label: "Demat Weight",
    value: "15%",
    metric: "5% population → 15% demat accounts",
    heading: "Population vs. Demat Weight",
    description:
      "Gujarat has only 5% of India's population but roughly 15% of India's demat accounts — the highest household financial market penetration of any large state.",
  },
  {
    id: "investors",
    label: "Active Investors",
    value: "2.6 Cr",
    metric: "2.6 Crore active investors",
    heading: "Gujarati Investors Today",
    description:
      "Over 2.6 crore Gujarati investors are actively navigating India's markets — a demographic shift from niche to mainstream participation.",
  },
  {
    id: "msmes",
    label: "MSMEs",
    value: "5 Lakh",
    metric: "5 Lakh MSMEs statewide",
    heading: "Building the Capital Base",
    description:
      "Five lakh MSMEs across Gujarat are building the state's capital base, powering entrepreneurship and regional wealth creation.",
  },
  {
    id: "startups",
    label: "Startups",
    value: "10,000",
    metric: "10,000 startups & growing",
    heading: "Complex Financial Landscape",
    description:
      "10,000 startups navigate an increasingly complex financial landscape — hungry for credible, regional-language business intelligence.",
  },
];

export function Convergence() {
  const section = useRef<HTMLDivElement>(null);
  const pinWrap = useRef<HTMLDivElement>(null);
  const slides = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const reduce = useReducedMotionFallback();

  useGSAP(
    () => {
      if (!section.current || !slides.current || !pinWrap.current) return;
      registerGsapPlugins();

      const slideEls = gsap.utils.toArray<HTMLElement>(
        slides.current.querySelectorAll("[data-stat-slide]")
      );
      const count = slideEls.length - 1;
      if (count < 1) return;

      const setActiveIdx = (i: number) =>
        setActive(Math.min(count, Math.max(0, Math.round(i))));

      // Reduced motion: no scroll-jacking; reveal each slide on scroll
      if (reduce) {
        slideEls.forEach((el) => {
          gsap.fromTo(
            el,
            { y: 32, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              scrollTrigger: { trigger: el, start: "top 85%" },
            }
          );
        });
        return;
      }

      const slideHeight = () => slideEls[0]?.offsetHeight ?? 420;

      gsap.set(slides.current, { y: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section.current,
          start: "center center",
          end: `+=${80 * slideEls.length}%`,
          pin: pinWrap.current,
          pinSpacing: true,
          anticipatePin: 1,
          scrub: 0.6,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const idx = Math.min(count, Math.round(self.progress * count));
            setActiveIdx(idx);
            const progressBar = section.current!.querySelector<HTMLElement>(
              "[data-progress-bar]"
            );
            if (progressBar) {
              progressBar.style.height = `${((idx + 1) / slideEls.length) * 100}%`;
            }
          },
        },
      });

      tl.to(slides.current, {
        y: () => -slideHeight() * count,
        ease: "none",
        duration: count,
      });

      const onResize = () => {
        const p = tl.progress();
        gsap.set(slides.current, { y: -slideHeight() * count * p });
        ScrollTrigger.refresh();
      };
      window.addEventListener("resize", onResize);

      return () => {
        window.removeEventListener("resize", onResize);
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    },
    { scope: section, dependencies: [reduce] }
  );

  return (
    <section id="convergence" ref={section} className="bg-kn-deep relative mt-20 lg:mt-0">
      <div ref={pinWrap} className="flex h-svh flex-col py-16 md:justify-center md:gap-8 lg:gap-10 lg:py-20">
        <div className="mx-auto mb-8 w-full max-w-7xl px-0 sm:px-4">
          <p className="text-blue-700 text-sm font-medium tracking-[0.2em] uppercase">
            The Great Convergence
          </p>
          <h2 className="mt-2 max-w-2xl text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl">
            Capital Meets Culture
          </h2>
          <p className="mt-3 max-w-xl text-slate-600">
            Gujarat is 5% of India&apos;s population but commands 15% of its demat
            accounts — a convergence of capital, culture, and unprecedented
            retail participation.
          </p>
        </div>

        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-start gap-8 px-4 sm:px-6 lg:grid-cols-[240px_1fr] lg:gap-12 lg:px-12">
          {/* Sticky progress nav */}
          <nav className="relative hidden lg:block">
            <div className="absolute top-0 left-0 h-full w-px bg-slate-300" />
            <div
              data-progress-bar
              className="from-blue-600 to-cyan-600 absolute top-0 left-0 w-px bg-gradient-to-b transition-all duration-300"
              style={{ height: `${((active + 1) / STATS.length) * 100}%` }}
            />
            <ul className="space-y-6 pl-6">
              {STATS.map((s, i) => (
                <li
                  key={s.id}
                  className={`transition-all duration-300 ${
                    i === active ? "text-slate-900" : "text-slate-400"
                  }`}
                >
                  <span className="text-xs font-medium tracking-wider uppercase">
                    {s.label}
                  </span>
                  <p
                    className={`text-lg font-bold ${
                      i === active ? "text-blue-700" : "text-slate-500"
                    }`}
                  >
                    {s.value}
                  </p>
                </li>
              ))}
            </ul>
          </nav>

          {/* Slides (translate up on scroll) */}
          <div className="relative overflow-hidden">
            <div ref={slides}>
              {STATS.map((s) => (
                <div
                  key={s.id}
                  data-stat-slide="true"
                  className="flex h-105 shrink-0 flex-col justify-start"
                >
                  <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white/90 to-white/60 p-6 shadow-lg backdrop-blur-md lg:p-10">
                    <span className="inline-block rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-700">
                      {s.metric}
                    </span>
                    <p className="from-blue-700 to-indigo-900 mt-6 bg-gradient-to-br bg-clip-text text-5xl font-bold text-transparent lg:text-7xl">
                      {s.value}
                    </p>
                    <h3 className="mt-4 text-xl font-semibold text-slate-900 lg:text-2xl">
                      {s.heading}
                    </h3>
                  </div>
                  <div className="mt-6 max-w-lg">
                    <p className="text-base leading-relaxed text-slate-600">
                      {s.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile dots */}
        <div className="mt-8 flex justify-center gap-2 lg:hidden">
          {STATS.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === active ? "w-8 bg-blue-600" : "w-1.5 bg-slate-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
