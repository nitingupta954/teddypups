import type { CSSProperties } from "react";
import { PuppyImage } from "@/components/PuppyImage";
import type { Media } from "@/lib/puppies";

// Tilt, tape position and tape colour cycle so neighbouring prints never match.
const TILTS = [-2.2, 1.6, -0.9, 2.4, -1.5, 0.8, -2.6, 1.2];
const TAPES = ["center", "left", "right", "corners", "center", "right", "left", "center"] as const;
const TAPE_COLOURS = ["#f6d79a", "#f9cdbf", "#cfe5f6", "#f6d79a", "#e9dcc4"];

type Props = {
  media: Media;
  /** Position on the wall; drives the tilt/tape pattern. */
  order: number;
  sizes: string;
  preload?: boolean;
};

/** A taped-up instant photo with an optional handwritten caption. */
export function Polaroid({ media, order, sizes, preload = false }: Props) {
  const tape = TAPES[order % TAPES.length];
  const style = {
    "--tilt": `${TILTS[order % TILTS.length]}deg`,
    "--tape": TAPE_COLOURS[order % TAPE_COLOURS.length],
  } as CSSProperties;

  return (
    <span className="tp-polaroid" style={style}>
      {tape === "corners" ? (
        <>
          <span aria-hidden className="tp-tape tp-tape--tl" />
          <span aria-hidden className="tp-tape tp-tape--tr" />
        </>
      ) : (
        <span aria-hidden className={`tp-tape tp-tape--${tape}`} />
      )}
      <span className="tp-polaroid__photo">
        <PuppyImage media={media} sizes={sizes} preload={preload} style={{ width: "100%", height: "auto" }} />
      </span>
      <span className="tp-polaroid__caption font-scrawl">{media.caption}</span>
    </span>
  );
}
