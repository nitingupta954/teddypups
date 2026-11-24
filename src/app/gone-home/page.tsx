import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { PupBuddy } from "@/components/pup/PupBuddy";
import { PuppyImage } from "@/components/PuppyImage";
import { RevealScope } from "@/components/RevealScope";
import { cover, goneHomePuppies, type Puppy } from "@/lib/puppies";

export const metadata: Metadata = {
  title: "Gone home",
  description: "TeddyPups puppies who have already joined their families.",
  alternates: { canonical: "/gone-home" },
};

/** Tickets lean a little, in a repeating left/right pattern. */
const TILTS = [-1.4, 1.1, -0.6, 1.6, -1.1, 0.8];

export default function GoneHomePage() {
  return (
    <div className="gutter mx-auto max-w-[110rem] pb-24 pt-[calc(var(--header-h)+2.5rem)] md:pt-[calc(var(--header-h)+4rem)]">
      <header className="tp-boothhead">
        <div className="max-w-3xl">
          <h1 className="font-plush text-giant">
            Gone home
            <svg viewBox="0 0 48 44" className="ml-3 inline-block w-[0.45em] -translate-y-[0.15em] text-toffee" aria-hidden>
              <path
                d="M24 40C10 30 4 22 4 14.5 4 8.7 8.6 4 14.3 4c4.1 0 7.6 2.4 9.7 6 2.1-3.6 5.6-6 9.7-6C39.4 4 44 8.7 44 14.5 44 22 38 30 24 40z"
                fill="none"
                stroke="currentColor"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </h1>
          <p className="text-lede mt-6 text-cocoa-soft">
            Every puppy here has already joined a loving family. Looking for one just like them? Tell us — we&apos;ll help you find
            your match.
          </p>
          <Link className="btn btn-primary mt-8" href="/puppies">
            See available puppies
          </Link>
        </div>
        {/* Teddy behind the ticket booth */}
        <div aria-hidden className="tp-booth">
          <PupBuddy pose="booth" className="tp-booth__teddy" />
          <div className="tp-booth__counter">
            <span className="font-plush">tickets home</span>
          </div>
        </div>
      </header>

      <RevealScope>
        <ul className="tp-tickets" aria-label="Puppies who have gone home">
          {goneHomePuppies.map((p, i) => (
            <Ticket key={p.id} puppy={p} i={i % TILTS.length} />
          ))}
        </ul>
      </RevealScope>
    </div>
  );
}

function Ticket({ puppy, i }: { puppy: Puppy; i: number }) {
  // "Pomeranian, boy" for named pups; just "Boy" when the breed is already the name.
  const meta = puppy.name ? `${puppy.breed}, ${puppy.genderLabel.toLowerCase()}` : puppy.genderLabel;
  return (
    <li className="tp-ticket" data-reveal style={{ "--tilt": `${TILTS[i]}deg`, "--i": i } as CSSProperties}>
      <Link className="tp-ticket__link" href={`/puppies/${puppy.slug}`}>
        <span className="tp-ticket__main">
          <span className="tp-ticket__photo">
            <PuppyImage media={cover(puppy)} fill sizes="7rem" />
          </span>
          <span className="tp-ticket__body">
            <span className="font-scrawl tp-ticket__kicker">one ticket home</span>
            <span className="font-plush tp-ticket__name">{puppy.displayName}</span>
            <span className="tp-ticket__meta">{meta}</span>
            <span className="tp-ticket__route">
              <span>{puppy.origin.slug === "local" ? "Dubai showroom" : "TeddyPups"}</span>
              <svg viewBox="0 0 60 12" aria-hidden>
                <path d="M2 6h46" />
                <path d="M44 2l6 4-6 4" />
              </svg>
              <span>home ♥</span>
            </span>
          </span>
        </span>
        <span aria-hidden className="tp-ticket__stub">
          <span className="font-plush">admit one</span>
        </span>
      </Link>
    </li>
  );
}
