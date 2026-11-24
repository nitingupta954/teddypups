"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, MotionConfig, motion, type Variants } from "motion/react";
import { PuppyImage } from "@/components/PuppyImage";
import type { Media } from "@/lib/puppies";

type Props = {
  photos: Media[];
  /** Photo on screen, or null when the viewer is closed. */
  index: number | null;
  /** +1 when moving forward, -1 when moving back; picks the slide direction. */
  direction: number;
  onNavigate: (index: number, direction: number) => void;
  onClose: () => void;
};

const slide: Variants = {
  enter: (dir: number) => ({ opacity: 0, x: 70 * dir, rotate: 5 * dir, scale: 0.92 }),
  center: { opacity: 1, x: 0, rotate: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 26 } },
  exit: (dir: number) => ({ opacity: 0, x: -70 * dir, rotate: -5 * dir, scale: 0.92, transition: { duration: 0.22 } }),
};

const SWIPE_PX = 80;

/**
 * Full-screen photo viewer on a native modal <dialog>: the browser handles the
 * focus trap, Escape to close and focus return. Arrow keys and swipes page through.
 */
export function PhotoViewer({ photos, index, direction, onNavigate, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const count = photos.length;
  const wrap = (i: number) => (i + count) % count;

  // Keep the dialog's open state in sync with `index`.
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (index !== null && !dialog.open) dialog.showModal();
    if (index === null && dialog.open) dialog.close();
  }, [index]);

  const photo = index === null ? null : photos[index];
  const go = (step: 1 | -1) => index !== null && onNavigate(wrap(index + step), step);

  return (
    <dialog
      ref={ref}
      aria-label="Photo viewer"
      className="m-0 h-dvh max-h-none w-screen max-w-none bg-cocoa/95 p-0 text-milk backdrop:bg-cocoa/70"
      data-lenis-prevent
      onClose={onClose}
      // A click on the dialog itself (not its content) is a click on the backdrop.
      onClick={(e) => e.target === e.currentTarget && e.currentTarget.close()}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(1);
        if (e.key === "ArrowLeft") go(-1);
      }}
    >
      {photo && index !== null && (
        <MotionConfig reducedMotion="user">
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between gap-4 px-4 py-3">
              <p className="font-scrawl text-lg" aria-live="polite">
                {index + 1} / {count}
                {photo.caption && ` — ${photo.caption}`}
              </p>
              <button type="button" onClick={() => ref.current?.close()} className="h-11 rounded-full bg-milk px-5 font-semibold text-cocoa">
                Close
              </button>
            </div>

            <div className="relative flex-1 overflow-hidden">
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={photo.id}
                  custom={direction}
                  variants={slide}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute inset-0 touch-pan-y"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.6}
                  onDragEnd={(_, { offset }) => {
                    if (offset.x < -SWIPE_PX) go(1);
                    else if (offset.x > SWIPE_PX) go(-1);
                  }}
                >
                  <PuppyImage
                    media={photo}
                    fill
                    sizes="100vw"
                    draggable={false}
                    style={{ objectFit: "contain", objectPosition: "50% 50%", backgroundColor: "transparent" }}
                  />
                </motion.div>
              </AnimatePresence>
              {/* Warm the cache for both neighbours so paging feels instant. */}
              <span aria-hidden className="sr-only">
                {[...new Set([wrap(index - 1), wrap(index + 1)])].map((i) => (
                  <PuppyImage key={photos[i].id} media={photos[i]} alt="" fill sizes="100vw" loading="eager" />
                ))}
              </span>
            </div>

            <div className="flex justify-center gap-3 pt-3 pb-[calc(1rem+env(safe-area-inset-bottom))]">
              <button type="button" onClick={() => go(-1)} className="h-12 rounded-full border-2 border-milk px-6 font-semibold">
                Previous
              </button>
              <button type="button" onClick={() => go(1)} className="h-12 rounded-full bg-honey px-6 font-semibold text-cocoa">
                Next
              </button>
            </div>
          </div>
        </MotionConfig>
      )}
    </dialog>
  );
}
