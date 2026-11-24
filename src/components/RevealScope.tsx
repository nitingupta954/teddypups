"use client";

import { useEffect, useRef, type ComponentProps } from "react";

/**
 * Scroll-reveal for any descendant marked `data-reveal`.
 * Elements already on screen are revealed immediately; the rest get `data-armed`
 * (CSS hides them) and flip to `data-revealed` when they scroll into view.
 */
export function RevealScope({ children, ...props }: ComponentProps<"div">) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const reveal = (el: HTMLElement) => {
      el.dataset.revealed = "true";
      io.unobserve(el);
    };
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && reveal(e.target as HTMLElement)),
      { rootMargin: "0px 0px -6% 0px", threshold: 0.08 },
    );
    const arm = (el: HTMLElement) => {
      // Already armed by an earlier run of this effect (StrictMode remounts): just observe again.
      if (el.dataset.armed) return io.observe(el);
      const r = el.getBoundingClientRect();
      if (r.top < innerHeight && r.bottom > 0) el.dataset.revealed = "true";
      else {
        el.dataset.armed = "true";
        io.observe(el);
      }
    };
    const scan = () => root.querySelectorAll<HTMLElement>("[data-reveal]:not([data-revealed])").forEach(arm);
    scan();
    // Filtered lists add new cards after mount.
    const mo = new MutationObserver(scan);
    mo.observe(root, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return (
    <div ref={ref} {...props}>
      {children}
    </div>
  );
}
