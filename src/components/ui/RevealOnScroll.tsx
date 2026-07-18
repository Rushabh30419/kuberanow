"use client";

import { useRef, type ReactNode } from "react";
import { gsap, registerGsapPlugins, useGSAP } from "@/lib/gsap";

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li" | "span";
};

/**
 * Reveal-on-scroll wrapper using GSAP (matches the original site's
 * `data-reveal-item` behaviour: y 32 -> 0, opacity 0 -> 1).
 */
export function RevealOnScroll({ children, className, delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      registerGsapPlugins();
      gsap.fromTo(
        ref.current,
        { y: 32, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          delay,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        }
      );
    },
    { scope: ref, dependencies: [delay] }
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
