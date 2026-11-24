"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import { PuppyImage } from "@/components/PuppyImage";
import { RevealScope } from "@/components/RevealScope";
import type { Media } from "@/lib/puppies";
import { PhotoViewer } from "./PhotoViewer";

const ON_WALL = 8;
const SIZES = "(min-width: 1024px) 18vw, (min-width: 640px) 28vw, 42vw";
// Each print gets its own slight tilt, tape and drop-in delay, so the wall looks hand-pinned.
const TILTS = [-2.2, 1.6, -0.9, 2.4, -1.5, 0.8, -2.6, 1.2];
const TAPES = ["center", "left", "right", "corners", "center", "right", "left", "center"];
const TAPE_COLOURS = ["#f6d79a", "#f9cdbf", "#cfe5f6", "#f6d79a", "#e9dcc4"];
const DROP_ORDER = [3, 0, 5, 1, 6, 2, 7, 4];

/** The house-front photo wall. Each print opens the full family album in a viewer. */
export function PhotoWall({ photos, children }: { photos: Media[]; children: ReactNode }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="tp-photowall">
      <RevealScope className="tp-photowall__wall">
        <ul className="tp-photowall__prints" aria-label="Photos from TeddyPups families">
          {photos.slice(0, ON_WALL).map((photo, i) => (
            <li key={photo.id} data-reveal style={{ "--d": `${DROP_ORDER[i] * 110}ms` } as CSSProperties}>
              <button
                type="button"
                className="tp-photowall__print"
                onClick={() => setOpen(i)}
                aria-label={`Open photo ${i + 1} of ${photos.length}${photo.caption ? `: ${photo.caption}` : ""}`}
              >
                <span
                  className="tp-polaroid"
                  style={
                    {
                      "--tilt": `${TILTS[i % TILTS.length]}deg`,
                      "--tape": TAPE_COLOURS[i % TAPE_COLOURS.length],
                    } as CSSProperties
                  }
                >
                  {TAPES[i % TAPES.length] === "corners" ? (
                    <>
                      <span aria-hidden className="tp-tape tp-tape--tl" />
                      <span aria-hidden className="tp-tape tp-tape--tr" />
                    </>
                  ) : (
                    <span aria-hidden className={`tp-tape tp-tape--${TAPES[i % TAPES.length]}`} />
                  )}
                  <span className="tp-polaroid__photo">
                    <PuppyImage media={photo} fill sizes={SIZES} />
                  </span>
                  <span className="tp-polaroid__caption font-scrawl">{photo.caption}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
        {children}
      </RevealScope>
      <div aria-hidden className="tp-street__pavement" />
      <PhotoViewer photos={photos} index={open} onChange={setOpen} />
    </div>
  );
}
