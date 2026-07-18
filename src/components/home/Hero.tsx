"use client";

import { useRef } from "react";
import {
  gsap,
  registerGsapPlugins,
  useGSAP,
  useReducedMotionFallback,
} from "@/lib/gsap";

type Bar = { label: string; from: string; to: string; height: number };

const BARS: Bar[] = [
  { label: "India Demat Accounts", from: "4.1 Cr", to: "17.1 Cr", height: 85 },
  { label: "Gujarat Demat", from: "62 L", to: "2.6 Cr", height: 72 },
  { label: "IPO Subscribers", from: "15 L", to: "80 L", height: 95 },
  { label: "GSDP", from: "₹22L Cr", to: "₹22L Cr", height: 68 },
];

export function Hero() {
  const root = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotionFallback();

  useGSAP(
    () => {
      if (!root.current) return;
      registerGsapPlugins();

      const q = (sel: string) =>
        root.current!.querySelector<HTMLElement>(sel);
      const qAll = (sel: string) =>
        root.current!.querySelectorAll<HTMLElement>(sel);

      const map = q("[data-hero-map]");
      const pulse = q("[data-hero-pulse]");
      const label = q("[data-hero-gandhinagar-label]");
      const bars = qAll("[data-hero-bar]");
      const card = q("[data-hero-card]");
      const arrow = q("[data-hero-arrow]");
      const tail = q("[data-hero-tail]");
      const line = q("[data-hero-line]");
      const glow = q("[data-hero-glow]");

      // Reduced motion: show everything statically
      if (reduce) {
        gsap.set(map, { x: 0, scale: 2, opacity: 1 });
        gsap.set(pulse, { scale: 1, opacity: 1 });
        if (label) gsap.set(label, { opacity: 1 });
        gsap.set(bars, { scaleY: 1 });
        gsap.set(card, { x: 0, opacity: 1 });
        if (line) gsap.set(line, { strokeDashoffset: 0 });
        return;
      }

      gsap.set(map, { transformOrigin: "30% 60%" });

      // Position the pulse dot exactly on Gandhinagar. The dot lives in the
      // outer illustration, but Gandhinagar's coords are relative to the map
      // SVG's viewBox — and the map is offset + scaled 2× at its final state.
      // We snap the map to its final transform, measure the rendered marker
      // via getBoundingClientRect (which folds in the scale), convert to a
      // percentage of the illustration, then reset for the entrance animation.
      const positionPulse = () => {
        if (!root.current || !pulse || !map) return;
        const gandhinagar = root.current.querySelector<SVGCircleElement>(
          "[data-hero-gandhinagar-marker]"
        );
        if (!gandhinagar) return;
        // Snap to final state to measure the resting position.
        gsap.set(map, { x: 0, scale: 2 });
        const rootRect = root.current.getBoundingClientRect();
        const markerRect = gandhinagar.getBoundingClientRect();
        if (!rootRect.width || !rootRect.height) return;
        const cx = markerRect.left + markerRect.width / 2 - rootRect.left;
        const cy = markerRect.top + markerRect.height / 2 - rootRect.top;
        gsap.set(pulse, {
          left: `${(cx / rootRect.width) * 100}%`,
          top: `${(cy / rootRect.height) * 100}%`,
        });
      };
      positionPulse();
      // Re-measure after fonts/layout settle (Noto Sans loads async).
      const rafId = requestAnimationFrame(positionPulse);
      const loadId = window.setTimeout(positionPulse, 600);
      window.addEventListener("resize", positionPulse);

      const reset = () => {
        gsap.set(map, { x: -120, scale: 1.3, opacity: 0 });
        gsap.set(pulse, { scale: 0, opacity: 0 });
        if (label) gsap.set(label, { opacity: 0 });
        gsap.set(bars, { scaleY: 0, transformOrigin: "bottom center" });
        gsap.set(card, { x: 140, opacity: 0 });
        gsap.set(arrow, {
          opacity: 0,
          motionPath: { path: "#hero-j-path", align: "#hero-j-path", alignOrigin: [0.5, 0.5], start: 0, end: 0 },
        });
        gsap.set(tail, { opacity: 0 });
        if (line) gsap.set(line, { strokeDashoffset: 400 });
        gsap.set(glow, { opacity: 0 });
      };
      reset();

      const tl = gsap.timeline({
        repeat: -1,
        repeatDelay: 1.2,
        defaults: { ease: "power3.out" },
        onRepeat: reset,
      });

      tl.to(map, { x: 0, scale: 2, opacity: 1, duration: 1.1, ease: "back.out(1.4)" })
        .to(pulse, { scale: 1, opacity: 1, duration: 0.5 }, "-=0.3");
      if (label) tl.to(label, { opacity: 1, duration: 0.5 }, "-=0.5");
      tl.to(pulse, { scale: 1.35, opacity: 0, duration: 1.2, repeat: 2, yoyo: true, ease: "sine.inOut" }, "-=0.2")
        .to(bars, { scaleY: 1, duration: 0.7, stagger: 0.12, ease: "back.out(1.6)" }, "-=1.4")
        .to(glow, { opacity: 1, duration: 0.5 }, "-=0.6")
        .to(card, { x: 0, opacity: 1, duration: 0.9, ease: "power4.out" }, "-=0.5")
        .to(line, { strokeDashoffset: 0, duration: 1.4, ease: "power2.inOut" }, "-=0.8")
        .set(arrow, { opacity: 1 })
        .set(tail, { opacity: 0.35 })
        .to(arrow, {
          motionPath: { path: "#hero-j-path", align: "#hero-j-path", alignOrigin: [0.5, 0.5], autoRotate: true, start: 0, end: 1 },
          duration: 1.8,
          ease: "power1.inOut",
        })
        .to(tail, {
          motionPath: { path: "#hero-j-path", align: "#hero-j-path", alignOrigin: [0.5, 0.5], start: 0, end: 0.85 },
          duration: 1.8,
          ease: "power1.inOut",
        }, "<")
        .to([arrow, tail], { opacity: 0, duration: 0.35, ease: "power2.in" });

      return () => {
        window.removeEventListener("resize", positionPulse);
        cancelAnimationFrame(rafId);
        window.clearTimeout(loadId);
        tl.kill();
        gsap.killTweensOf([map, pulse, label, ...bars, card, arrow, tail, line, glow].filter(Boolean));
      };
    },
    { scope: root, dependencies: [reduce] }
  );

  return (
    <section id="hero" className="bg-kn-deep relative overflow-hidden lg:min-h-svh">
      <div className="relative mx-auto flex max-w-7xl flex-col px-4 py-10 pt-0! sm:px-4 md:py-20 lg:min-h-svh lg:justify-center lg:px-8 lg:py-12 lg:pt-20">
        <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-medium tracking-widest text-blue-800">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-600" />
          KuberaNow
        </div>

        <p className="text-amber-800 text-sm font-medium tracking-[0.2em] uppercase">
          New Era of Wealth Creation
        </p>

        <h1 className="mt-4 max-w-3xl text-4xl leading-[1.1] font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
          The silent financial revolution is{" "}
          <span className="bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent">
            Gujarati
          </span>
        </h1>

        <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-600 lg:text-lg">
          Look at the data, and the story is undeniable: India&apos;s retail
          investing landscape has undergone a permanent, structural shift.
          Between 2020 and 2026, a post-COVID surge added over 13 crore new demat
          accounts nationally, transforming financial market participation from
          a niche pursuit into a mainstream cultural phenomenon.
        </p>

        <div className="mt-12 grid items-center gap-10 lg:grid-cols-2">
          {/* Animated illustration */}
          <div
            ref={root}
            className={`relative mx-auto aspect-4/3 w-full max-w-2xl overflow-hidden ${
              reduce ? "[&_[data-hero-card]]:!opacity-100 [&_[data-hero-map]]:!opacity-100" : ""
            }`}
            aria-hidden
          >
            {/* Dashed growth line */}
            <svg className="absolute inset-0 h-full w-full opacity-30" viewBox="0 0 400 300">
              <path
                data-hero-line="true"
                d="M20 220 C80 200, 120 180, 160 190 S240 120, 320 80 L380 60"
                fill="none"
                stroke="url(#lineGrad)"
                strokeWidth="2"
                strokeDasharray="400"
                strokeDashoffset="400"
              />
              <defs>
                <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.8" />
                </linearGradient>
              </defs>
            </svg>

            {/* Faint bar-chart backdrop */}
            <svg className="absolute bottom-0 left-0 w-full opacity-20" viewBox="0 0 400 80" preserveAspectRatio="none">
              <path
                d="M0 80 L0 55 L20 55 L20 40 L35 40 L35 50 L50 50 L50 25 L65 25 L65 45 L80 45 L80 30 L100 30 L100 50 L115 50 L115 20 L130 20 L130 55 L150 55 L150 35 L170 35 L170 50 L190 50 L190 15 L210 15 L210 45 L230 45 L230 30 L250 30 L250 55 L270 55 L270 40 L290 40 L290 55 L310 55 L310 25 L330 25 L330 50 L350 50 L350 35 L370 35 L370 55 L400 55 L400 80 Z"
                fill="#cbd5e1"
              />
            </svg>

            {/* Glow */}
            <div data-hero-glow="true" className="absolute bottom-[18%] left-1/2 h-8 w-[70%] -translate-x-1/2 rounded-full bg-blue-400/20 blur-2xl" />

            {/* Gujarat map */}
            <div data-hero-map="true" className="absolute top-[18%] left-[10%] w-[30%] max-w-36">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="144 144 512 512" className="w-full drop-shadow-[0_0_15px_rgba(96,165,250,0.25)]">
                <defs>
                  <linearGradient id="gujaratLightBlue" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#bfdbfe" />
                    <stop offset="50%" stopColor="#93c5fd" />
                    <stop offset="100%" stopColor="#60a5fa" />
                  </linearGradient>
                </defs>
                <path
                  d="m630.76 360.99c-0.6-0.95-1.33-2.1-2.18-3.55l-4.87-8.34c-0.19-0.38-0.43-0.91-0.71-1.55-2.14-4.79-4.3-9.11-6.94-9.3-2.27-0.16-4.06 0.56-5.5 1.12-0.8 0.32-1.53 0.61-2.04 0.61-0.31 0-1.22-0.02-1.9-4.87-0.53-3.78-3.57-5.41-6.26-6.86l-1.06-0.57c-1.63-0.92-3.25-1.94-4.89-2.96-2.68-1.68-5.46-3.43-8.33-4.75-1.63-0.75-3.54-1.25-5.54-1.77-5.08-1.32-9.88-2.54-9.88-7.84 0-0.3 0.09-0.98 0.16-1.85 0.51-4.81 0.61-7.12-0.16-8.08-0.24-0.3-0.57-0.49-0.95-0.53-1.95-0.19-3.77 0.89-5.33 1.84-0.93 0.56-1.89 1.15-2.46 1.15-0.36 0-0.7-0.46-1.06-1.57-2.48-4.64-5.23-8.8-9.2-13.9-2.14-2.75-1.08-3.92 0.84-6.05 1.02-1.13 2.19-2.41 2.79-4.1 1.05-2.96-0.23-5.4-1.39-7.56-0.29-0.54-0.57-1.08-0.82-1.62-0.99-2.22-1.92-3.69-3.27-3.69-1.33 0-2.05 1.39-2.86 3.01-0.68 1.34-1.46 2.87-2.57 3.76-0.16 0.14-0.35 0.2-0.54 0.2-1.24 0-3.81-1.76-8.97-10.17l-0.19-0.32c-3.05-4.95 0.11-9.45 2.64-13.07 1.71-2.44 3.19-4.54 1.47-6-2.27-1.93-3.85-1.99-4.79-2.03-0.07 0-0.22-0.01-0.24 0.03-0.23-0.61-0.23-3.16-0.23-4.43 0-0.62-0.21-2.64-3-2.64-1.16 0-2.5 0.35-3.59 0.63-0.39 0.1-0.74 0.2-1.02 0.25-5.64 1.12-5.85 4.54-6.02 7.05-0.13 2.09-0.28 3.21-1.86 3.82-1.79 0-12-4.07-17.02-6.23-1.53-1.63-7.16-6.39-9.73-6.39-1.36 0-2.99 1.25-4.73 2.58-0.76 0.58-1.94 1.48-2.6 1.79-0.01-0.38 0-0.77 0.01-1.15 0.04-1.78 0.11-4.21-2.53-5.32-1.36-0.57-1.8-1.52-2.31-2.62-0.54-1.17-1.16-2.5-2.91-3.17-1.92-0.74-4.5-0.8-7-0.84-3.3-0.06-6.72-0.13-7.81-1.79-0.27-0.41-0.5-0.83-0.69-1.22-0.82-1.59-1.68-3.45-5.02-2.86-1.43 0.26-2.79 1.72-4.25 3.27-0.8 0.84-2.18 2.21-2.52 2.13-0.7-1.6-1.7-3.45-3.59-3.45-0.82 0-1.54 0.36-2.23 0.71-0.91 0.46-1.75 0.84-2.6 0.36-0.33-0.18-0.49-0.35-0.67-0.56-0.51-0.56-1.05-1.02-2.46-1.02-2.7 0-4.5 0.75-6.09 1.4-2.4 0.98-4.31 1.39-7.55-0.41-4.16-2.3-8.59-2.93-12.9-1.83-1.56 0.39-3.12 0.97-4.61 1.52-2.76 1.02-5.38 1.98-8.07 1.98-0.89 0-1.72-0.1-2.43-0.29l-15.56-5.98-0.15 1.38c-0.16 1.54-0.96 2.88-2.43 4.1-4.56 3.79-3.82 7.2-3.18 10.2 0.68 3.12 1.25 5.82-3.96 9.43-3.7 2.57-4.55 4.34-5.54 6.38-0.54 1.13-1.15 2.41-2.39 4.09-1.64 2.23-4.43 3.51-7.65 3.51-2.79 0-5.45-1.02-7.13-2.72-1.04-1.05-2.02-3.82-2.89-6.26-1.41-3.95-2.51-7.08-4.65-7.08-0.29 0-0.57 0.06-0.85 0.18-4.19 1.85-8.51 3.23-12.69 4.55-6.3 2-12.82 4.08-19.15 7.84l-0.23 0.14-0.14 0.23c-2.83 4.86-8.45 7.77-15.04 7.77-6.13 0-11.84-2.46-15.26-6.56-2.37-2.84-5.74-4.23-10.3-4.23-3.61 0-7.5 0.85-11.27 1.66-4.75 1.04-9.31 1.92-12.21 1.16-0.91-0.23-1.84-0.35-2.76-0.35-2.37 0-4.41 0.73-6.37 1.45-2.87 1.04-5.52 1.73-8.03 0.22-2.48-1.49-5.3-0.98-7.35-0.29-0.71 0.24-1.4 0.48-1.91 0.48s-1.27-0.02-2.13-3.46l-0.2-0.81-0.8 0.02c-2.07 0-2.55 3.23-3.31 11.79-0.32 3.56-0.68 7.59-1.25 8.8-2.19 4.63-4.03 5.27-5.69 5.27-1.18 0-2.52-0.37-4.07-0.8-2.09-0.57-4.45-1.23-7.3-1.23-0.97 0-1.95 0.08-2.91 0.23-13.2 2.13-18.03 18.08-21.23 28.64l-0.87 2.84 0.55 0.45c0.87 0.71 1.84 1.35 2.88 1.91 1.41 0.76 3.02 1.16 4.67 1.16 4.53 0 8.07-2.84 8.61-6.91 0.49-3.7 2.08-5.15 3.92-6.83 1.54-1.42 3.29-3.02 4.3-6.05 0.16-0.5 0.32-1.2 0.48-2.02 0.44-2.21 1.11-5.54 2.79-5.62-0.13 0.87-0.61 2.54-0.93 3.62-0.5 1.75-0.95 3.26-0.95 4.15v0.92l0.91 0.13c2.51 0.36 5.78-0.55 9.22-1.53 2.11-0.6 4.27-1.21 6.21-1.48-2.64 2.33-8.82 6.7-11.15 8.34-1.63 1.15-1.99 1.41-2.17 1.58-11.54 11.53-6.86 17.34-0.95 24.67 1.99 2.47 4.26 5.27 6.19 8.63 0.83 1.45-0.05 2.38-2.33 3.93-1.16 0.79-2.07 1.4-2.02 2.43 0.02 0.4 0.2 0.97 1 1.4 4.44 2.46 7.87 5.46 11.51 8.65 2.3 2.02 4.68 4.11 7.33 6.02 10 7.23 27.29 16.3 41.6 19.13 1.49 0.29 3.24 0.79 5.09 1.32 3.74 1.05 7.97 2.26 11.72 2.26 1.74 0 3.23-0.26 4.53-0.77 3.36-1.35 5.92-3.23 8.38-5.06 3.23-2.38 6.27-4.63 11.19-5.78 0.83-0.37 2.54-0.69 4.34-1.04 5.27-1.02 11.82-2.27 12.07-6.62 0.32-5.41 1.98-12.39 3.31-12.39 0.2 0 0.65 0.29 1.23 1.08 0.4 0.54 0.81 1.04 1.24 1.5-0.05-0.01-0.09-0.02-0.13-0.02-1.1-0.11-1.79 0.12-2.3 0.65-0.75 0.77-0.71 1.91-0.68 2.92l0.02 0.63c0 0.5 0.04 1 0.09 1.5 0.05 0.61 0.11 1.23 0.06 1.88l-0.04 0.51c-0.13 1.36-0.36 3.65 2.13 4.47 2.48 0.81 4.94 0.46 8.06-1.28l0.54-0.31v-6.49l-1.42 0.51c-0.56 0.2-0.4 0.31-1.12-0.47-0.36-0.39-0.69-0.84-1.02-1.31-0.07-0.1-0.14-0.2-0.21-0.3 3.65 1.82 7.93 2.03 12.34 2.03l1.85-0.01c-0.29 0.48-0.71 0.99-1.1 1.48-0.59 0.74-1.21 1.5-1.56 2.29-0.75 1.69-0.85 3.26-0.95 4.76-0.05 0.95-0.12 1.85-0.33 2.79-0.21 0.95-0.48 0.95-0.84 0.95-0.35 0-0.73-0.07-1.14-0.14-1.15-0.18-2.46-0.29-3.51 0.09-2.77 0.98-3.85 4.08-4.9 7.05-0.66 1.9-1.35 3.86-2.41 4.92-1.71 1.7-3.12 4.03-4.62 6.5-2.97 4.86-6.01 9.87-11.16 9.15-6.47-0.94-8.2 0.76-10.9 3.45-1 0.98-2.13 2.11-3.73 3.38-4.09 3.22-5.21 4.13-9.47 1.58-0.61-0.36-1.21-0.54-1.8-0.54-1.9 0-3.11 1.79-4.27 3.5-1.56 2.29-3.22 4.49-6.09 3.29-1.31-0.54-2.6-0.82-3.95-0.82-3.07 0-5.85 1.39-8.79 2.85-2.2 1.1-4.47 2.24-7.02 2.88l-0.27 0.11c-1.84 1.06-4.81 2.29-7.1 2.29-1.26 0-2.12-0.37-2.64-1.09-0.99-1.39-0.45-2.85 0.53-5.12 0.65-1.51 1.32-3.09 1.32-4.79v-1.37l-1.32 0.35c-0.6 0.15-0.99 0.61-1.45 1.16-0.48 0.56-1.02 1.21-1.71 1.39-0.36 0.1-1.14 0.2-2.23 0.2-2.06 0-3.71-0.36-4.29-0.72-0.09-0.7 0.1-2.77 0.2-3.8 0.07-0.75 0.13-1.4 0.13-1.71l0.01-1.07h-1.05c-0.79 0-1.45 0.33-6.01 7.05l-0.43 0.62c-3.4 4.91 1.77 12.41 5.55 17.87 1.04 1.5 1.95 2.81 2.51 3.84 3.89 6.95 9.59 12.47 15.1 17.8 2.93 2.82 5.96 5.76 8.68 8.89l31.46 31.15 46.6 42.39c9.61 8.75 18.63 12.81 28.38 12.81 1.24 0 2.52-0.06 3.8-0.2l0.64-0.06 0.23-0.58c0.12-0.29 0.23-0.61 0.36-0.95 0.51-1.43 1.22-3.39 2.37-3.77 1.16-0.37 1.64 0.23 2.49 1.55 0.46 0.71 0.94 1.43 1.64 1.91l0.41 0.28 0.47-0.14c5.97-1.75 12.08-4.52 18.55-7.44 5.2-2.34 10.56-4.76 16.43-6.95l0.25-0.14c1.27-0.94 2.27-1.84 3.15-2.66 2.44-2.21 3.93-3.52 8.24-2.86 4.19 0.69 10.22-2.84 16.01-6.21 3.53-2.06 6.86-4.02 9.41-4.78 6.32-1.95 10.67-3.91 9-11.47-0.5-2.2 5.79-11.95 8.47-16.11 0.9-1.39 1.63-2.54 2.08-3.27 4.89-8.29 3.28-12.26 1.05-17.73-0.82-2.03-1.75-4.3-2.52-7.16l0.67-2.64c2.54-10.05 4.57-18 9.41-27.7 1.66-3.34 0.87-5.89 0.11-8.35-0.66-2.11-1.29-4.11-0.47-6.82 0.13 0.68 0.23 1.46 0.36 2.15 0.79 5.08 1.85 12.04 6 12.04 0.5 0 1.05-0.11 1.58-0.34 1.54-0.63 2.92-1.54 4.26-2.4 2.14-1.39 4.16-2.69 6.45-2.69 1.07 0 2.14 0.28 3.29 0.86 1.47 0.72 3.07 1.09 4.89 1.09 1.44 0 2.85-0.21 4.23-0.42 0.43-0.08 0.87-0.14 1.31-0.2-0.32 0.48-0.64 0.94-0.96 1.16-1.49 1.08-3.59 1.13-5.81 1.16-2.88 0.06-6.13 0.13-8.72 2.52-2.57 2.39-7.09 15.28-5.17 20.16 0.73 1.84 2.33 2.6 4.35 2.09 1.32-0.34 3.26-1.37 5.3-2.46 1.49-0.8 3.22-1.72 4.54-2.24-0.47 0.98-1.08 2.2-1.42 2.88-0.28 0.54-0.5 0.98-0.62 1.24-0.92 1.92-1.33 3.82-1.73 5.69-0.53 2.46-1.02 4.78-2.68 7.09-0.7 0.95-1.99 1.83-2.93 2.47-1.25 0.84-2.08 1.42-1.77 2.4 0.3 0.98 1.47 0.98 2.1 0.98 0.54 0 1.31-0.05 2.34-0.14 5.34-0.5 9.35 0.6 13.92 1.95-0.13 0.05-0.24 0.09-0.36 0.14-1.62 0.61-2.27 0.86-2.63 1.18-1.49 1.34-2.16 3.12-2.8 4.86-0.4 1.03-0.76 2.02-1.3 2.89l-0.23 0.39 0.13 0.45c0.09 0.32 0.36 0.88 0.68 1.52 0.35 0.69 1.27 2.5 1.16 2.94-3.31 2.08-4.82 3.03-5.16 4.58-0.32 1.48 0.6 2.88 2.27 5.42l0.28 0.42c0.71 1.09 1.29 1.89 1.75 2.5 0.41 0.57 0.84 1.15 0.88 1.23-0.07 0.16-0.53 0.63-0.98 1.08-0.38 0.37-0.84 0.83-1.39 1.4-2.33 2.47-3.21 4.37-2.79 5.93 0.56 2.05 3.06 2.79 5.7 3.55 2.7 0.8 5.48 1.61 6.19 3.61 1.05 2.98 1.95 4.63 3.71 7.42 1.13 1.8 0.67 3.2 0.14 4.82-0.74 2.26-1.67 5.08 3.21 8 1.52 0.92-0.37 7.75-1.5 11.82-0.91 3.32-1.79 6.44-1.87 8.58-0.11 2.95-0.51 5.82-1.23 8.79l-0.13 0.54 0.37 0.42c0.3 0.34 0.81 0.71 1.39 1.13 0.41 0.28 1.09 0.77 1.23 0.97l0.34 0.52c0.36 0.52 0.77 1.13 1.03 1.66 0.26 0.57 0.23 1.08 0.2 1.79-0.02 0.23-0.02 0.48-0.02 0.72 0 1.11-0.43 1.34-2.23 1.86-0.28 0.08-0.57 0.16-0.87 0.26l-0.71 0.23c-1.05 0.39-1.09 0.43-2.46-0.29l-1.07-0.55-0.77 2.06c-0.8 2.15-1.61 4.34-2.37 6.61-0.63 1.54-1.35 3.05-2.06 4.57-0.69 1.48-1.39 2.95-2.01 4.44l-1.13 2.71 17.94-9.44 0.29-0.23c0.67-0.74 1.29-1.6 1.93-2.47 1.27-1.75 2.61-3.58 4.36-4.35 2.05-0.92 3.74-1.39 4.99-1.39 1.25 0 2.42 0.36 2.42 2.88 0 0.64-0.14 1.32-0.29 2.03-0.2 1.02-0.43 2.08-0.29 3.23 0.26 2.23 0.65 4.38 2.53 6.24l4.71 4.9 0.59-1.55 0.04-0.16c0.67-1.06 0.98-2.03 1.25-2.88 0.51-1.61 0.78-2.42 3.06-2.89 1.26-0.28 2.5-0.28 3.82-0.31 1.65-0.03 3.35-0.06 5.09-0.58 1.46-0.45 2.43-1.21 2.86-2.27 0.82-1.97-0.46-4.35-1.57-6.47-0.63-1.16-1.27-2.37-1.36-3.15-0.14-1.37 0.61-2.13 1.94-3.39 0.38-0.34 0.75-0.69 1.11-1.08 1.65-1.77 1.98-3.71 2.3-5.58 0.15-0.88 0.3-1.8 0.6-2.69l0.09-0.26-0.05-0.26c-0.27-1.4-0.93-2.84-1.57-4.26-0.87-1.92-1.78-3.91-1.54-5.44 0.1-0.64 0.28-0.64 0.54-0.64 1.33 0 4.12 1.68 6.82 3.29 4.27 2.55 9.11 5.44 13.27 5.44 2.46 0 4.4-1.02 5.77-3.02 1.27-1.84 1.19-3.46 1.13-4.63-0.06-1.37-0.09-1.84 3.45-2.15 2.48-0.23 4.24-1.24 5.22-3.02 2.95-5.32-2.39-15.89-5.26-21.55l-0.7-1.42c-1.38-2.79-4.01-4.26-6.55-5.68-1.48-0.83-2.87-1.6-3.95-2.6-0.82-0.75-1.75-1.39-2.5-1.89 0.5-0.02 1.18-0.03 2.08-0.03 6.18 0 6.86-1.06 7.06-5.63l0.02-1.29c0.18-0.28 1.27-0.77 2.06-1.14 2.48-1.15 5.89-2.74 6.62-6.24 0.5-2.34 0-4.32-0.43-6.06-0.31-1.23-0.6-2.42-0.54-3.63 1.36 0.09 2.72 0.4 4.13 0.71 3.13 0.71 6.62 1.18 9.61 0.06 0.16-0.06 16.13-7.42 15.41-11.29-0.31-1.68-2.61-1.68-3.37-1.68-1.02 0-2.32 0.13-3.91 0.37-4.83 0.74-6.62 0.71-11.04-0.16-2.13-0.36-4.23 1.02-6.44 2.54-2.22 1.52-4.53 3.09-7.06 3.09-2.16 0-4.07-0.8-4.86-2.05-0.58-0.91-0.57-2.06 0.05-3.4 0.58-1.26 0.88-2.18 1.1-2.84 0.49-1.5 0.54-1.69 3.34-3.16 1.38-0.72 2.95-1.75 3.01-3.2 0.05-1.45-1.34-2.32-2.68-3.18-0.93-0.6-1.98-1.26-2.31-1.97-1.71-3.6 2.06-5.97 6.76-8.45 0.47-0.26 0.91-0.5 1.15-0.65l10.13-3.49 5.68-13.3 0.08-0.42c0-4.4-2.05-7.3-4.04-10.12-1.4-1.98-2.73-3.87-3.2-6.16-0.58-2.79-0.34-3.81-0.03-4.2 0.43-0.52 2-0.5 4.15-0.35 1.1 0.08 2.32 0.16 3.64 0.16h0.77l0.23-0.72c0.44-1.32 0.88-1.5 1.87-1.88 0.75-0.29 1.68-0.65 2.74-1.55 1.02-0.87 1.5-1.71 1.49-2.58-0.02-1.22-0.98-2-1.82-2.68-0.52-0.42-1.11-0.9-1.2-1.3l-0.2-0.81-0.87 0.01c-1.65 0-3.21 0.23-4.71 0.46-1.22 0.18-2.37 0.36-3.65 0.42-1.25 0-3.02-1.16-3.44-2.26-0.19-0.49-0.09-0.86 0.36-1.26 1.89-1.69 3.53-1.75 5.41-1.8 2.57-0.07 5.5-0.16 8.37-4.96 1.77-2.95 3.38-3.12 5.61-3.34 1.68-0.16 3.58-0.36 5.65-1.83 1.84-1.32 3-4.02 3.93-6.18l0.33-0.77c3.09-6.96 3.09-7.66-0.04-12.58z"
                  fill="url(#gujaratLightBlue)"
                  stroke="#93c5fd"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <g>
                  <line x1="500" y1="348" x2="500" y2="326" stroke="#1e3a8a" strokeWidth="1.5" opacity="0.8" />
                  <circle data-hero-gandhinagar-marker="true" cx="500" cy="348" r="5" fill="#1e3a8a" />
                  <circle cx="500" cy="348" r="2.2" fill="#ffffff" />
                </g>
                <text
                  data-hero-gandhinagar-label="true"
                  x="500"
                  y="318"
                  textAnchor="middle"
                  fill="#1e3a8a"
                  fontSize="16"
                  fontWeight="600"
                  letterSpacing="0.04em"
                  opacity="0"
                >
                  Gandhinagar
                </text>
              </svg>
            </div>

            {/* Pulsing dot — positioned on Gandhinagar by JS (see positionPulse) */}
            <div
              data-hero-pulse="true"
              className="pointer-events-none absolute h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-500/70 bg-blue-500/20"
            />

            {/* Rising bars (with labels) */}
            <div className="absolute bottom-[22%] left-[48%] flex h-[38%] items-end gap-2">
              {BARS.map((b, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div
                    data-hero-bar="true"
                    className="w-7 rounded-t-sm bg-gradient-to-t from-blue-600 to-cyan-400 shadow-[0_0_16px_rgba(59,130,246,0.15)]"
                    style={{ height: b.height }}
                  />
                  <span className="text-[7px] text-slate-500">{i + 1}</span>
                </div>
              ))}
            </div>

            {/* Floating glass card */}
            <div
              data-hero-card="true"
              className="absolute top-[28%] right-[2%] w-[54%] rounded-2xl border border-slate-200 bg-white/80 p-2.5 shadow-[0_8px_32px_rgba(9,30,66,0.08)] backdrop-blur-xl sm:p-4"
            >
              <p className="text-[9px] leading-tight font-medium tracking-widest text-blue-700 uppercase whitespace-nowrap sm:text-xs">
                New Demat Accounts
              </p>
              <p className="from-blue-700 to-indigo-900 mt-1 bg-gradient-to-r bg-clip-text text-2xl font-bold text-transparent sm:text-4xl">
                13+ Cr
              </p>
              <p className="mt-1 text-[10px] leading-snug text-slate-600 sm:text-xs">
                Added nationally since 2020
              </p>
              <div className="from-transparent via-blue-200 to-transparent mt-2 h-px w-full bg-gradient-to-r" />
              <p className="mt-2 text-[9px] text-amber-800 sm:text-[11px]">
                Gujarat · 15% share
              </p>
            </div>

            {/* Animated J-path arrow */}
            <svg className="pointer-events-none absolute h-full w-full overflow-visible">
              <defs>
                <linearGradient id="arrowGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#22d3ee" />
                </linearGradient>
                <filter id="arrowGlow">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <path
                id="hero-j-path"
                d="M 108 118 C 150 210, 230 230, 310 72"
                fill="none"
                stroke="rgba(59,130,246,0.08)"
                strokeWidth="1.5"
                strokeDasharray="4 6"
              />
              <g data-hero-tail="true" filter="url(#arrowGlow)">
                <line x1="-12" y1="0" x2="0" y2="0" stroke="url(#arrowGrad)" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
              </g>
              <g data-hero-arrow="true" filter="url(#arrowGlow)">
                <polygon points="0,-6 14,0 0,6" fill="url(#arrowGrad)" />
              </g>
            </svg>

            {/* Faint back bars */}
            <div className="absolute bottom-[16%] left-[48%] flex gap-2 opacity-20 blur-sm">
              <div className="w-7 rounded-t-sm bg-blue-400" style={{ height: 21.25 }} />
              <div className="w-7 rounded-t-sm bg-blue-400" style={{ height: 18 }} />
              <div className="w-7 rounded-t-sm bg-blue-400" style={{ height: 23.75 }} />
              <div className="w-7 rounded-t-sm bg-blue-400" style={{ height: 17 }} />
            </div>
          </div>

          {/* Right-side stat cards */}
          <div className="space-y-6 px-4 lg:px-0">
            <div
              data-reveal-item
              className="rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-sm backdrop-blur-sm"
            >
              <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase">
                The numbers speak
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                4.2× growth in demat accounts
              </p>
              <p className="mt-1 text-sm text-slate-600">
                From ~4.1 Cr nationally to ~17.1 Cr by 2026
              </p>
            </div>

            <div
              data-reveal-item
              className="rounded-2xl border border-amber-200 bg-amber-50/50 p-6 shadow-sm"
            >
              <p className="text-xs font-semibold tracking-widest text-amber-800 uppercase">
                Gujarat leads
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                2.6 Cr demat accounts
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Up from ~62 Lakh pre-2020 — outpacing the national curve
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
