"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function PupJourney({ label }: { label?: string }) {
  const containerRef = useRef<HTMLDivElement>(null!);
  const puppyRef = useRef<HTMLElement>(null!);

  // ---------- cursor-tracking state ----------
  const mouseRef = useRef({ x: 0, y: 0 });
  const prevXRef = useRef(0);
  // -------------------------------------------

  useEffect(() => {
    // Ensure the SVG element is available after first paint.
    const id = setTimeout(() => {
      const svg = containerRef.current!.querySelector<SVGElement>("svg")!;
      puppyRef.current = svg!.firstElementChild as HTMLElement; // the <circle> body
    }, 100);

    return () => {
      clearTimeout(id);
    };
  }, [label]);

  // -------------------------------------------------------------------------
  // Build the master scroll-driven timeline (same as before).
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (!puppyRef.current) return;

    const puppy = puppyRef.current;

    const homeTl = gsap.timeline({
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "+=1600",
        scrub: 1,
        onEnter: () => {
          gsap.set(puppy, { y: 30, opacity: 0 });
        },
      },
    });

    homeTl.to(puppy, {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: "power2.out",
    });

    homeTl.to(puppy, { y: "+=80", duration: 1, ease: "power1.out" });
    homeTl.to(puppy, { x: "-=120", duration: 2, ease: "power2.inOut" });
    homeTl.to(puppy, { y: "+=60", duration: 1, ease: "power1.out" });
    homeTl.to(puppy, { y: "-=20", duration: 1, ease: "power1.inOut" });
    homeTl.to(puppy, { y: "-=30", duration: 0.8, ease: "power1.out" });
    homeTl.to(puppy, { x: "+=50", duration: 1, ease: "power1.out" });
    homeTl.to(puppy, { y: "+=55", duration: 1, ease: "power1.out" });
    homeTl.to(puppy, { y: "+=45", duration: 1, ease: "power1.out" });
    homeTl.to(puppy, { y: "+=55", duration: 1, ease: "power1.out" });
    homeTl.to(puppy, {
      y: "+=120",
      rotate: "-=15",
      opacity: 0.2,
      ease: "power1.in",
      onComplete: () => {
        console.log("🐶 puppy is now sleeping");
      },
    });
    homeTl.to(puppy, { duration: 0.1 }); // keep static after journey
  }, [label]);

  // -------------------------------------------------------------------------
  // Cursor‑tracking effect – makes the puppy "follow" the mouse.
  // -------------------------------------------------------------------------
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      // store latest mouse position
      mouseRef.current = { x: e.clientX, y: e.clientY };

      // simple damping so the movement feels smooth, not jittery
      const targetX = mouseRef.current.x;
      const targetY = mouseRef.current.y;
      const puppy = puppyRef.current!;
      // move the puppy toward the cursor (0.15 factor = lag)
      gsap.to(puppy, {
        x: targetX,
        y: targetY,
        duration: 0.15,
        ease: "power2.out",
      });

      // optional: make the puppy "walk" direction based on horizontal cursor movement
      const deltaX = targetX - prevXRef.current;
      prevXRef.current = targetX;
      // rotate a few degrees in the direction of mouse movement
      const rotate = deltaX * 0.05; // modest tilt
      gsap.set(puppy, { rotate });
    };

    window.addEventListener("mousemove", handleMove);
    // clean up on unmount or re‑render
    return () => {
      window.removeEventListener("mousemove", handleMove);
    };
  }, [label]);

  return (
    <div
      id="puppy-mascot"
      className="pup-buddy fixed bottom-4 left-4 z-50"
      aria-label={label ? `Teddy the puppy mascot ${label}` : undefined}
      ref={containerRef}
    >
      {/* Simple placeholder puppy – circle body, triangle ears, dot eyes */}
      <svg
        width={80}
        height={80}
        viewBox="0 0 80 80"
        aria-hidden="true"
      >
        <circle cx="40" cy="40" r="35" fill="#e4a352" />
        <path
          d="M20 25 Q40 10 60 25"
          stroke="#2a170e"
          fill="none"
        />
        <circle cx="28" cy="30" r="4" fill="#2a170e" />
        <circle cx="52" cy="30" r="4" fill="#2a170e" />
      </svg>
    </div>
  );
}