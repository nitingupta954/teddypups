"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Lenis smooth scrolling (skipped for reduced-motion users); scroll to top on route change. */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ autoRaf: true, anchors: { offset: -96 } });
    return () => lenis.destroy();
  }, []);

  useEffect(() => {
    if (!location.hash) scrollTo(0, 0);
  }, [pathname]);

  return null;
}
