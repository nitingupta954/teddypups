import Link from "next/link";
import { PupBuddy } from "@/components/pup/PupBuddy";
import { availablePuppies, cover } from "@/lib/puppies";
import { site } from "@/lib/site";
import { HeroLineup, type Friend } from "./HeroLineup";
import { Scene } from "./Scene";

const friends: Friend[] = availablePuppies.map((p) => ({
  id: p.id,
  slug: p.slug,
  displayName: p.displayName,
  breed: p.breed,
  cover: cover(p),
}));

export function Hero() {
  return (
    <Scene tone="light" sky={["#fffdf8", "#fff1d8"]} className="tp-hero" aria-labelledby="hero-title">
      <span aria-hidden className="tp-hero__sun" />

      <div className="tp-hero__copy gutter">
        <p className="tp-hero__note font-scrawl">
          {site.tagline}
          <svg viewBox="0 0 220 24" preserveAspectRatio="none" className="tp-hero__squiggle" aria-hidden>
            <path
              d="M4 14c18-10 30 8 48-1s28-9 46 0 30 8 48-1 30-9 48 0 18 2 22 0"
              fill="none"
              stroke="currentColor"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </p>
        <h1 id="hero-title" className="tp-hero__title font-plush">
          <span className="block">Premium teacup</span>
          <span className="block">puppies in Dubai</span>
        </h1>
        <p className="tp-hero__lede">
          Meet your new best friend in our Dubai showroom, or order a rare miniature breed from trusted breeders
          worldwide.
        </p>
        <div className="tp-hero__actions">
          <Link className="btn btn-primary" href="/puppies">
            View available puppies
          </Link>
          <a href={site.whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
            Enquire on WhatsApp
          </a>
        </div>
      </div>

      <div className="tp-hero__stage">
        <HeroLineup friends={friends} />
        <div className="tp-hero__teddy">
          {/* idle off: the shared ear-twitch CSS knocks the peek pose's tilted ear out of place */}
          <PupBuddy pose="peek" idle={false} label="Teddy, the TeddyPups puppy, peeking over the quilt" />
        </div>
        <Quilt />
      </div>
    </Scene>
  );
}

/** The scalloped quilt the pups peek over. */
function Quilt() {
  return (
    <div aria-hidden className="tp-quilt">
      <svg className="tp-quilt__edge" width="100%" height="40" preserveAspectRatio="none">
        <defs>
          <pattern id="tp-scallop" width="76" height="40" patternUnits="userSpaceOnUse">
            <path d="M0 40V27A38 25 0 0 1 76 27V40Z" fill="var(--quilt)" />
            <path d="M0 27A38 25 0 0 1 76 27" fill="none" stroke="#2a170e" strokeWidth={3} />
            <path
              d="M11 33A27 19 0 0 1 65 33"
              fill="none"
              stroke="#2a170e"
              strokeWidth={1.6}
              strokeDasharray="3.5 5.5"
              strokeLinecap="round"
              opacity={0.42}
            />
          </pattern>
        </defs>
        <rect width="100%" height="40" fill="url(#tp-scallop)" />
      </svg>
    </div>
  );
}
