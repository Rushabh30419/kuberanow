"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { useGSAP } from "@gsap/react";
import { useEffect, useRef, useState, type RefObject } from "react";

let registered = false;

/**
 * SSR-safe reduced-motion hook. Mirrors framer-motion's useReducedMotion
 * without pulling framer-motion into every component.
 */
export function useReducedMotionFallback(): boolean {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduce(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduce;
}

/**
 * Registers the GSAP plugins once on the client. Mirrors the original site's
 * `registerGsapPlugins` helper which registers ScrollTrigger + MotionPathPlugin.
 */
export function registerGsapPlugins() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, useGSAP);
  registered = true;
}

export { gsap, ScrollTrigger, MotionPathPlugin, useGSAP };

/**
 * useScrollReveal — matches the original's behaviour:
 *  - [data-reveal-heading]: yPercent 110 -> 0, duration .9, ease power3.out
 *  - [data-reveal-item]:    y 32 -> 0, duration .7, delay .08*index
 *  - [data-zoom-on-scroll]: scale 1 -> 1.06 scrubbed across viewport
 */
export function useScrollReveal(
  scope: RefObject<HTMLElement | null>,
  disabled = false
) {
  registerGsapPlugins();

  useGSAP(
    () => {
      if (disabled || !scope.current) return;

      const headings = scope.current.querySelectorAll<HTMLElement>(
        "[data-reveal-heading]"
      );
      const items = scope.current.querySelectorAll<HTMLElement>(
        "[data-reveal-item]"
      );
      const zoomers = scope.current.querySelectorAll<HTMLElement>(
        "[data-zoom-on-scroll]"
      );

      headings.forEach((el) => {
        gsap.fromTo(
          el,
          { yPercent: 110, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" },
          }
        );
      });

      items.forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 32, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            delay: 0.08 * i,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
          }
        );
      });

      zoomers.forEach((el) => {
        gsap.fromTo(
          el,
          { scale: 1 },
          {
            scale: 1.06,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });

      return () => {
        gsap.killTweensOf([...headings, ...items, ...zoomers]);
      };
    },
    { scope, dependencies: [disabled] }
  );
}

/**
 * A convenient ref helper that returns both the ref and the scope object.
 */
export function useGsapScope<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  return ref;
}
