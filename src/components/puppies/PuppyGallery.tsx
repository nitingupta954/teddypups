"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from "motion/react";
import { PuppyImage } from "@/components/PuppyImage";
import type { Media } from "@/lib/puppies";

const SIZES = "(min-width: 1024px) 55vw, 92vw";

type Props = { name: string; media: Media[] };

/**
 * Photo/video viewer for a puppy: page-turn transitions, prev/next, a counter, thumbnails,
 * and a full-screen lightbox (native <dialog>: focus trap, Escape and focus return for free)
 * with swipe. Left/right arrow keys work anywhere inside the gallery.
 */
export function PuppyGallery({ name, media }: Props) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [lightbox, setLightbox] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const count = media.length;
  const current = media[index];
  const describe = (i: number) => `${name}, ${media[i].kind === "video" ? "video" : "photo"} ${i + 1} of ${count}`;

  const go = (to: number) => {
    setDirection(to > index ? 1 : -1);
    setIndex(((to % count) + count) % count);
  };
  const open = () => {
    dialog.current?.showModal();
    setLightbox(true);
  };
  const onClose = () => {
    setLightbox(false);
    // The button that opened the lightbox may have been swapped for another photo's: refocus the current one.
    stage.current?.querySelector<HTMLButtonElement>("button[aria-label^='Open']")?.focus();
  };
  const onKeyDown = (e: KeyboardEvent) => {
    // Leave arrow keys to a focused video's own controls.
    if (count < 2 || e.target instanceof HTMLVideoElement) return;
    if (e.key === "ArrowRight") go(index + 1);
    if (e.key === "ArrowLeft") go(index - 1);
  };

  return (
    <MotionConfig reducedMotion="user">
      <div onKeyDown={onKeyDown}>
        <div ref={stage} className="tp-storypage relative aspect-[4/5] md:aspect-[5/6]">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.button
              key={current.id}
              type="button"
              className="absolute inset-0 block size-full"
              aria-label={`Open ${describe(index)} full screen`}
              onClick={open}
              custom={direction}
              // Page turn: the new photo wipes in from the side it came from.
              initial={{
                clipPath: direction > 0 ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)",
                rotateY: -14 * direction,
                transformPerspective: 1400,
              }}
              animate={{ clipPath: "inset(0% 0% 0% 0%)", rotateY: 0 }}
              exit={{ opacity: 0.4, scale: 0.97 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: direction > 0 ? "0% 50%" : "100% 50%" }}
            >
              {current.kind === "video" ? (
                <video
                  src={current.url}
                  poster={current.poster?.url}
                  className="size-full object-cover"
                  muted
                  loop
                  playsInline
                  autoPlay={!reduceMotion}
                  aria-label={current.alt}
                />
              ) : (
                <PuppyImage media={current} fill sizes={SIZES} preload={index === 0} />
              )}
            </motion.button>
          </AnimatePresence>

          {count > 1 && (
            <div className="absolute inset-x-4 bottom-4 flex justify-between">
              <ArrowButton label="Previous photo" onClick={() => go(index - 1)}>
                ‹
              </ArrowButton>
              <span className="self-center rounded-full bg-cocoa/80 px-3 py-1 text-sm font-semibold text-milk">
                {index + 1} / {count}
              </span>
              <ArrowButton label="Next photo" onClick={() => go(index + 1)}>
                ›
              </ArrowButton>
            </div>
          )}
        </div>

        {count > 1 && (
          <ul className="mt-3 flex gap-3 overflow-x-auto px-1 pb-2 pt-2 [scrollbar-width:thin]" aria-label={`All photos of ${name}`}>
            {media.map((m, i) => (
              <li key={m.id} className="shrink-0">
                <button
                  type="button"
                  onClick={() => go(i)}
                  aria-label={describe(i)}
                  aria-current={i === index}
                  className={`relative block h-24 w-20 overflow-hidden rounded-[0.9rem] border-[3px] transition-transform duration-300 md:h-28 md:w-24 ${
                    i === index ? "-translate-y-1 -rotate-3 border-toffee-deep" : "border-cocoa/30 hover:-rotate-2 hover:border-cocoa"
                  }`}
                >
                  <PuppyImage media={m} fill sizes="96px" alt="" />
                  {m.kind === "video" && (
                    <span aria-hidden className="absolute inset-0 grid place-items-center bg-cocoa/30 text-lg text-milk">
                      ▶
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}

        <dialog
          ref={dialog}
          aria-label={`${name} photos`}
          className="m-0 h-dvh max-h-none w-screen max-w-none bg-cocoa/95 p-0 text-milk backdrop:bg-cocoa/70"
          onClose={onClose}
          // A click on the backdrop (the dialog itself, not its content) closes it.
          onClick={(e) => e.target === dialog.current && dialog.current.close()}
          data-lenis-prevent
        >
          {lightbox && (
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between gap-4 px-4 py-3">
                <p className="font-scrawl text-lg" aria-live="polite">
                  {describe(index)}
                </p>
                {/* The content mounts after showModal(), so focus is placed here explicitly. */}
                <button type="button" autoFocus onClick={() => dialog.current?.close()} className="h-11 rounded-full bg-milk px-5 font-semibold text-cocoa">
                  Close
                </button>
              </div>
              <div className="relative flex-1 touch-pan-y">
                <motion.div
                  key={current.id}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  // Swipe/drag sideways to change photo; it springs back if the drag is short.
                  drag={count > 1 ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.6}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -80) go(index + 1);
                    else if (info.offset.x > 80) go(index - 1);
                  }}
                >
                  {current.kind === "video" ? (
                    <video src={current.url} poster={current.poster?.url} controls autoPlay playsInline className="size-full object-contain" />
                  ) : (
                    <PuppyImage media={current} fill sizes="100vw" style={{ objectFit: "contain", objectPosition: "50% 50%", backgroundColor: "transparent" }} />
                  )}
                </motion.div>
              </div>
              {count > 1 && (
                <div className="flex justify-center gap-3 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3">
                  <button type="button" onClick={() => go(index - 1)} className="h-12 rounded-full border-2 border-milk px-6 font-semibold">
                    Previous
                  </button>
                  <button type="button" onClick={() => go(index + 1)} className="h-12 rounded-full bg-honey px-6 font-semibold text-cocoa">
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </dialog>
      </div>
    </MotionConfig>
  );
}

function ArrowButton({ label, onClick, children }: { label: string; onClick: () => void; children: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid size-12 place-items-center rounded-full border-2 border-cocoa bg-milk/95 text-xl font-bold"
    >
      {children}
    </button>
  );
}
