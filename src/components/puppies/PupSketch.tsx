import Link from "next/link";
import type { CSSProperties } from "react";
import { PAW_PATH } from "@/components/icons";
import { PuppyImage } from "@/components/PuppyImage";
import { cover, hasVideo, puppyFacts, type Puppy } from "@/lib/puppies";
import { makeSketch, svgMask, type Doodle } from "./sketch";

/**
 * A puppy with its gallery trimmed to what a card shows (the cover, plus one video if any),
 * to keep the payload small when a list is handed to a client component.
 */
export const toCard = (p: Puppy): Puppy => ({ ...p, media: [cover(p), ...p.media.filter((m) => m.kind === "video").slice(0, 1)] });

const STATUS = { available: "Available", "gone-home": "Gone home" } as const;

const SIZES = "(min-width: 1536px) 17rem, (min-width: 1024px) 22vw, (min-width: 640px) 30vw, 46vw";

function DoodleMark({ d }: { d: Doodle }) {
  const stroke = { fill: "none", stroke: d.ink, strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  return (
    <g transform={`translate(${d.x.toFixed(1)} ${d.y.toFixed(1)}) rotate(${d.rot.toFixed(0)}) scale(${d.size.toFixed(2)})`}>
      <g className="tp-sketch__doodle">
        {d.kind === "sparkle" && <path d="M0 -6c.6 3.6 2.4 5.4 6 6-3.6.6-5.4 2.4-6 6-.6-3.6-2.4-5.4-6-6 3.6-.6 5.4-2.4 6-6z" fill={d.ink} />}
        {d.kind === "heart" && (
          <path d="M0 5C-4.6 1.8-6.4-.8-6.4-3.2c0-1.9 1.5-3.3 3.3-3.3 1.3 0 2.4.7 3.1 1.9.7-1.2 1.8-1.9 3.1-1.9 1.8 0 3.3 1.4 3.3 3.3C6.4-.8 4.6 1.8 0 5z" {...stroke} />
        )}
        {d.kind === "dashes" && <path d="M-5 -5l4 2M-6 0h5M-5 5l4 -2" {...stroke} />}
        {d.kind === "swirl" && <path d="M0 0c1.6-.6 2.4 1.4.8 2.6-2 1.4-4.6-.4-4-3 .7-3 4.8-3.8 6.8-1.2 2.4 3-0.2 7.4-3.8 7.2" {...stroke} />}
        {d.kind === "dots" && (
          <g fill={d.ink}>
            <circle cx="-4" cy="1" r="1.2" />
            <circle cx="0" cy="-2" r="1.2" />
            <circle cx="4" cy="1" r="1.2" />
          </g>
        )}
        {d.kind === "paw" && <path d={PAW_PATH} transform="scale(.17) translate(-32 -34)" fill={d.ink} opacity={0.85} />}
      </g>
    </g>
  );
}

type Props = {
  pup: Puppy;
  /** Position in the grid; staggers the draw-in animation. */
  index?: number;
  /** Compact variant used in the "gone home" strip. */
  small?: boolean;
  preload?: boolean;
};

/** A puppy drawn into Teddy's sketchbook: wobbly photo, pencil ring, colour wash and doodles. */
export function PupSketch({ pup, index = 0, small = false, preload = false }: Props) {
  const s = makeSketch(pup.slug);
  const label = [pup.displayName, pup.name && pup.breed, pup.genderLabel.toLowerCase(), pup.age, STATUS[pup.status].toLowerCase()]
    .filter(Boolean)
    .join(", ");

  return (
    <Link
      href={`/puppies/${pup.slug}`}
      className={`tp-sketch${small ? " tp-sketch--small" : ""}`}
      data-reveal
      aria-label={label}
      style={{ "--tilt": `${s.tilt.toFixed(2)}deg`, "--d": `${(index % 8) * 70}ms`, "--wash": s.wash.color } as CSSProperties}
    >
      <span className="tp-sketch__frame">
        <svg aria-hidden viewBox="0 0 100 100" className="tp-sketch__wash" style={{ translate: `${s.wash.dx.toFixed(1)}% ${s.wash.dy.toFixed(1)}%` }}>
          <path d={s.wash.d} />
        </svg>
        <span className="tp-sketch__photo" style={{ maskImage: svgMask(s.mask), WebkitMaskImage: svgMask(s.mask) }}>
          <PuppyImage media={cover(pup)} fill sizes={small ? "8rem" : SIZES} preload={preload} alt="" />
        </span>
        <svg aria-hidden viewBox="0 0 100 100" className="tp-sketch__ink">
          <path d={s.outline} pathLength={1} className="tp-sketch__line" />
          <path d={s.retrace} pathLength={1} className="tp-sketch__line tp-sketch__line--retrace" />
          {s.doodles.map((d, i) => (
            <DoodleMark key={i} d={d} />
          ))}
        </svg>
        {small ? (
          <span className="tp-sketch__sticker tp-sketch__sticker--home font-scrawl">gone home ♥</span>
        ) : (
          <>
            <span className="tp-sketch__sticker font-scrawl">{STATUS[pup.status]}</span>
            {hasVideo(pup) && <span className="tp-sketch__video">▶ video</span>}
          </>
        )}
      </span>
      <span className="tp-sketch__name font-plush">{pup.displayName}</span>
      {!small && <span className="tp-sketch__meta">{puppyFacts(pup).join(" · ")}</span>}
    </Link>
  );
}
