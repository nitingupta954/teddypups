import Link from "next/link";
import type { CSSProperties } from "react";
import { PawIcon } from "@/components/icons";
import { PuppyImage } from "@/components/PuppyImage";
import { cover, hasVideo, puppyFacts, type Puppy } from "@/lib/puppies";

const DOOR_COLOURS = ["#a24a1a", "#5a3a28", "#d4893f", "#b8644a", "#7a4a2e"];

/**
 * An arched wooden door with the pup's name plate above it. The leaf swings
 * open (CSS: on hover, on scroll-in, or when the pinned hall marks it open)
 * to show the pup's photo inside.
 */
export function Door({ pup, index }: { pup: Puppy; index: number }) {
  const meta = puppyFacts(pup).join(", ") + (hasVideo(pup) ? ", with video" : "");
  return (
    <li className="tp-door" data-open="true">
      <Link
        href={`/puppies/${pup.slug}`}
        className="tp-door__link"
        style={{ "--door": DOOR_COLOURS[index % DOOR_COLOURS.length] } as CSSProperties}
      >
        <span className="tp-door__plate">
          <span className="tp-door__name font-plush">{pup.displayName}</span>
          <span className="tp-door__meta">{meta}</span>
        </span>
        <span className="tp-door__frame">
          <span className="tp-door__room">
            <PuppyImage media={cover(pup)} fill sizes="(min-width: 1024px) 15rem, 44vw" />
          </span>
          <span aria-hidden className="tp-door__way">
            <span className="tp-door__leaf">
              <PawIcon className="tp-door__peephole" />
              <span className="tp-door__knob" />
            </span>
          </span>
          <span className="tp-door__tag font-scrawl">Available</span>
        </span>
      </Link>
    </li>
  );
}
