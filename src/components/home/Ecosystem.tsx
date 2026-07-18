"use client";

import { useRef, useState } from "react";
import { gsap, registerGsapPlugins, useGSAP, useReducedMotionFallback } from "@/lib/gsap";

type Card = {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  accent: string; // tailwind gradient
};

const CARDS: Card[] = [
  {
    id: "digital-tv",
    icon: "TV",
    title: "Digital TV",
    subtitle: "KuberaNow Digital TV",
    description:
      "High-quality news, business insight, and market analysis delivered website-first, plus apps and newsletters.",
    accent: "from-blue-500/20 to-cyan-500/10",
  },
];

const PILLARS = [
  { label: "Digital TV" },
  { label: "Apps & Newsletters" },
  { label: "Regional Intelligence" },
];

export function Ecosystem() {
  const section = useRef<HTMLElement>(null);
  const stack = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const reduce = useReducedMotionFallback();

  useGSAP(
    () => {
      if (!section.current || !stack.current) return;
      registerGsapPlugins();

      const cards = gsap.utils.toArray<HTMLElement>(
        stack.current.querySelectorAll("[data-stack-card]")
      );
      if (!cards.length) return;

      // Reduced motion fallback
      if (reduce) {
        gsap.set(cards, { y: 0, opacity: 1 });
        return;
      }

      gsap.set(cards, { transformOrigin: "center top" });
      gsap.set(cards.slice(1), { yPercent: 105, opacity: 0 });

      // If there's only one card (as in the original), there's no stacking
      // animation — just a reveal. We still keep the structure for parity.
      if (cards.length < 2) {
        gsap.from(cards[0], {
          y: 60,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: section.current, start: "top 70%" },
        });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: `+=${100 * cards.length}%`,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const idx = Math.min(
              cards.length - 1,
              Math.floor(self.progress * cards.length)
            );
            setActive(idx);
          },
        },
      });

      cards.forEach((card, i) => {
        if (i === 0) return;
        const prev = cards[i - 1];
        tl.to(
          card,
          { yPercent: 0, opacity: 1, duration: 1, ease: "power2.out" },
          i
        ).to(
          prev,
          {
            scale: 0.92 - 0.02 * i,
            rotationX: 4 + i,
            opacity: 0.55,
            duration: 1,
            ease: "power2.inOut",
          },
          i
        );
      });

      const onResize = () => ScrollTrigger.refresh();
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
    <section
      id="ecosystem"
      ref={section}
      className="bg-kn-deep relative px-4! pt-6 sm:px-4! sm:pt-16"
    >
      <div className="mx-auto max-w-7xl">
        <h2 className="max-w-3xl text-3xl leading-tight font-bold text-slate-900 sm:text-4xl lg:text-5xl">
          Filling the Vacuum
        </h2>
        <p className="mt-5 max-w-3xl text-base leading-relaxed text-slate-700 lg:text-lg">
          KuberaNow arrives at the perfect inflection point to bridge the gap
          between sophisticated financial intelligence and regional language
          accessibility.
        </p>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600 lg:text-lg">
          Our vision is simple yet bold: To become Gujarat&apos;s most trusted and
          influential business media platform. By delivering credible journalism,
          technology-driven experiences, and integrated communication, we empower
          the entrepreneurs, investors, and wealth creators of the region.
        </p>
      </div>

      <div className="flex min-h-0 items-center py-10 lg:min-h-[60vh]">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_380px]">
          {/* Stack of cards */}
          <div ref={stack} className="mx-auto grid w-full max-w-lg">
            {CARDS.map((c) => (
              <div
                key={c.id}
                data-stack-card="true"
                className={`relative col-start-1 row-start-1 rounded-3xl border border-slate-200 bg-gradient-to-br ${c.accent} p-5 shadow-lg shadow-indigo-900/5 backdrop-blur-xl will-change-transform sm:p-8`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900/10 text-base font-bold text-slate-800 sm:h-14 sm:w-14 sm:text-lg">
                  {c.icon}
                </div>
                <p className="mt-4 text-xs font-semibold tracking-widest text-slate-600 uppercase sm:mt-6">
                  {c.subtitle}
                </p>
                <h3 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
                  {c.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-700 sm:mt-4 sm:text-base">
                  {c.description}
                </p>
                <div className="absolute right-4 bottom-4 text-4xl font-black text-slate-900/5 sm:right-6 sm:bottom-6 sm:text-6xl">
                  01
                </div>
              </div>
            ))}
          </div>

          {/* Side aside (desktop) */}
          <aside className="hidden lg:block">
            <ul className="space-y-3">
              {PILLARS.map((p, i) => (
                <li
                  key={p.label}
                  className={`rounded-xl border px-4 py-3 transition-all duration-300 ${
                    i === active
                      ? "border-blue-500 bg-blue-50 font-bold text-blue-900"
                      : "border-slate-200 text-slate-600"
                  }`}
                >
                  <span className="text-sm font-medium">{p.label}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50/50 p-5 shadow-xs">
              <p className="text-sm font-semibold text-amber-800">
                Credible journalism · Technology-driven · Integrated communication
              </p>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Empowering the entrepreneurs, investors, and wealth creators of
                the region.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
