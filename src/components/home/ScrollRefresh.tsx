"use client";

import { useEffect } from "react";
import { ScrollTrigger, registerGsapPlugins } from "@/lib/gsap";

/**
 * ScrollTrigger pin animations are positioned based on element offsets
 * measured at mount. If fonts, images or layout shift afterward, the pin
 * positions become stale and sections overlap. This component forces a
 * `ScrollTrigger.refresh()` on load and after the web fonts swap in, which
 * keeps the Hero → Convergence boundary (and all other pinned sections)
 * positioned correctly.
 */
export function ScrollRefresh() {
  useEffect(() => {
    registerGsapPlugins();
    // Refresh once everything has painted.
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());

    // Refresh again after webfonts settle (Noto Sans loads async).
    const fontTimeout = window.setTimeout(() => ScrollTrigger.refresh(), 800);

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(fontTimeout);
      window.removeEventListener("load", onLoad);
    };
  }, []);

  return null;
}
