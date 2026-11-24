import Link from "next/link";
import { PuppyImage } from "@/components/PuppyImage";
import { PupBuddy } from "@/components/pup/PupBuddy";
import { availablePuppies, cover } from "@/lib/puppies";
import { site } from "@/lib/site";
import { Scene } from "./Scene";

const waiting = availablePuppies[0];

/** "Ready to meet your new best friend?": a glowing front door that swings open on a pup as you arrive. */
export function HomeCta() {
  return (
    <Scene tone="dark" sky={["#2f1a10", "#24130b"]} className="tp-home" aria-labelledby="cta-title">
      <div className="gutter">
        <h2 id="cta-title" className="tp-home__title font-plush text-huge">
          Ready to meet your new best friend?
        </h2>
        <p className="tp-home__lede">
          Bring home a healthy, happy teacup or designer puppy with expert guidance every step of the way. We help you
          find the right match and ensure a smooth, safe delivery across the UAE.
        </p>
      </div>

      <div className="tp-house">
        <span aria-hidden className="tp-house__plant tp-house__plant--left" />
        <span aria-hidden className="tp-house__lamp" />
        <div className="tp-house__doorway">
          {waiting && (
            <span className="tp-house__inside">
              <PuppyImage media={cover(waiting)} alt={`${waiting.displayName}, waiting inside`} fill sizes="16rem" />
            </span>
          )}
          <span aria-hidden className="tp-house__door">
            <span className="tp-house__peep" />
            <span className="tp-house__knob" />
          </span>
        </div>
        <span aria-hidden className="tp-house__plant tp-house__plant--right" />
        <span aria-hidden className="tp-house__mat font-scrawl">
          welcome home
        </span>
        <div className="tp-house__teddy tp-stop">
          <PupBuddy pose="play" />
        </div>
      </div>

      <div className="tp-home__actions gutter">
        <a href={site.whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
          Enquire on WhatsApp
        </a>
        <Link className="btn btn-ghost" href="/contact">
          Visit &amp; contact
        </Link>
      </div>
    </Scene>
  );
}
