"use client";

import { AnimatePresence, motion, type Variants } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { PuppyImage } from "@/components/PuppyImage";
import type { Media } from "@/lib/puppies";

type Props = {
  photos: Media[];
  /** Photo on show, or null when closed. */
  index: number | null;
  onChange: (index: number | null) => void;
};

// Photos slide and tilt in from the side you're heading to.
const slide: Variants = {
  enter: (dir: number) => ({ opacity: 0, x: 70 * dir, rotate: 5 * dir, scale: 0.92 }),
  center: { opacity: 1, x: 0, rotate: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 26 } },
  exit: (dir: number) => ({ opacity: 0, x: -70 * dir, rotate: -5 * dir, scale: 0.92, transition: { duration: 0.22 } }),
};

/** Full-screen photo viewer on a native modal <dialog>: arrow keys, swipe, Previous/Next, Esc or Close. */
export function PhotoViewer({ photos, index, onChange }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [dir, setDir] = useState(1);
  const photo = index === null ? null : photos[index];

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (index !== null && !d.open) d.showModal();
    if (index === null && d.open) d.close();
  }, [index]);

  const go = (step: 1 | -1) => {
    if (index === null) return;
    setDir(step);
    onChange((index + step + photos.length) % photos.length);
  };

  return (
    <dialog
      ref={dialog}
      aria-label="Photo viewer"
      className="m-0 h-dvh max-h-none w-screen max-w-none bg-cocoa/95 p-0 text-milk backdrop:bg-cocoa/70"
      data-lenis-prevent
      onClose={() => onChange(null)}
      onClick={(e) => e.target === dialog.current && dialog.current.close()}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(1);
        if (e.key === "ArrowLeft") go(-1);
      }}
    >
      {photo && index !== null && (
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between gap-4 px-4 py-3">
            <p className="font-scrawl text-lg" aria-live="polite">
              {index + 1} / {photos.length}
              {photo.caption && ` — ${photo.caption}`}
            </p>
            <button
              type="button"
              onClick={() => dialog.current?.close()}
              className="h-11 rounded-full bg-milk px-5 font-semibold text-cocoa"
            >
              Close
            </button>
          </div>

          <div className="relative flex-1 overflow-hidden">
            <AnimatePresence initial={false} custom={dir}>
              <motion.div
                key={photo.id}
                custom={dir}
                variants={slide}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0 touch-pan-y"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.6}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -80) go(1);
                  else if (info.offset.x > 80) go(-1);
                }}
              >
                <PuppyImage
                  media={photo}
                  fill
                  sizes="100vw"
                  style={{ objectFit: "contain", backgroundColor: "transparent" }}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-center gap-3 pt-3 pb-[calc(1rem+env(safe-area-inset-bottom))]">
            <button
              type="button"
              onClick={() => go(-1)}
              className="h-12 rounded-full border-2 border-milk px-6 font-semibold"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="h-12 rounded-full bg-honey px-6 font-semibold text-cocoa"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </dialog>
  );
}
