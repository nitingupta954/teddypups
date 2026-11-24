"use client";

import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { Scene } from "./Scene";
import { DESKTOP, REDUCED_MOTION, useMedia } from "./useMedia";

type Props = {
  head: ReactNode;
  /** The door `<li>`s, rendered on the server. */
  children: ReactNode;
  /** Teddy, rendered on the server (his SVG poses are too heavy to ship to the client). */
  teddy: ReactNode;
};

/**
 * Desktop: the section pins for a while and vertical scroll walks the row of
 * doors past Teddy, who trots on the spot; each door swings open as it passes
 * him. Mobile and reduced motion: a plain grid whose doors open on scroll-in (CSS).
 */
export function MeetHall({ head, children, teddy }: Props) {
  const desktop = useMedia(DESKTOP);
  const reduced = useMedia(REDUCED_MOTION);
  const pinned = desktop && !reduced;
  const range = useRef<HTMLDivElement>(null);
  const hall = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLOListElement>(null);
  /** How far the track sticks out past the viewport, i.e. how far it has to travel. */
  const [overflow, setOverflow] = useState(0);

  const { scrollYProgress } = useScroll({ target: range, offset: ["start start", "end end"] });
  const eased = useSpring(scrollYProgress, { stiffness: 170, damping: 32, mass: 0.35 });
  const x = useTransform(eased, [0, 1], [0, -overflow]);

  // Size the doors to the viewport height, then measure the track.
  useLayoutEffect(() => {
    const t = track.current;
    const h = hall.current;
    if (!t || !h) return;
    const stage = h.parentElement!;
    const measure = () => {
      if (pinned) {
        const head = stage.querySelector<HTMLElement>(".tp-meet__head");
        const plates = t.querySelectorAll<HTMLElement>(".tp-door__plate");
        const plate = Math.max(64, ...Array.from(plates, (p) => p.offsetHeight));
        const floor = h.querySelector<HTMLElement>(".tp-meet__floor")?.offsetHeight ?? 0;
        const room = stage.clientHeight - (head ? head.offsetTop + head.offsetHeight : 0) - floor - plate - 40;
        const width = Math.max(128, Math.min(256, innerWidth * 0.15, room / 1.3));
        h.style.setProperty("--door-w", `${Math.round(width)}px`);
      } else {
        h.style.removeProperty("--door-w");
      }
      setOverflow(Math.max(0, t.scrollWidth - innerWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(t);
    ro.observe(stage);
    return () => ro.disconnect();
  }, [pinned]);

  // Slide the floor boards with the track and open each door as it reaches Teddy.
  useLayoutEffect(() => {
    const t = track.current;
    const h = hall.current;
    if (!t || !h) return;
    const doors = Array.from(t.children) as HTMLElement[];
    if (!pinned) {
      doors.forEach((d) => (d.dataset.open = "true"));
      return;
    }
    const update = (dx: number) => {
      h.style.setProperty("--floor-x", `${dx.toFixed(1)}px`);
      const line = innerWidth * 0.36;
      for (const door of doors) door.dataset.open = String(door.offsetLeft + dx < line);
    };
    update(x.get());
    return x.on("change", update);
  }, [pinned, x]);

  return (
    <Scene
      tone="light"
      sky={["#fff1d8", "#fbe3b4"]}
      className="tp-meet"
      data-pinned={pinned || undefined}
      aria-labelledby="meet-title"
    >
      <div ref={range} style={pinned ? { height: `calc(100vh + ${Math.round(overflow * 0.8)}px)` } : undefined}>
        <div className="tp-meet__stage">
          {head}
          <div ref={hall} className="tp-meet__hall">
            <motion.ol
              ref={track}
              className="tp-meet__track"
              style={pinned ? { x } : undefined}
              aria-label="Puppies looking for a family"
            >
              {children}
            </motion.ol>
            <div aria-hidden className="tp-meet__floor" />
            {teddy}
          </div>
        </div>
      </div>
    </Scene>
  );
}
