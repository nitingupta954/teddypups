import Link from "next/link";
import familyPhotos from "@/data/family-photos.json";
import { PupBuddy } from "@/components/pup/PupBuddy";
import type { Media } from "@/lib/puppies";
import { PhotoWall } from "./PhotoWall";
import { Scene } from "./Scene";

// Captioned snaps go up on the wall first; the viewer can page through all of them.
const photos = (familyPhotos as Media[]).toSorted((a, b) => Number(!a.caption) - Number(!b.caption));

/** "Happy families & puppies": a testimonial, then a house front papered with family polaroids. */
export function Dusk() {
  return (
    <Scene tone="dark" sky={["#a65a30", "#4d2b19"]} className="tp-dusk" aria-labelledby="dusk-title">
      <div className="tp-dusk__sky gutter">
        <div>
          <h2 id="dusk-title" className="font-plush text-huge">
            Happy families &amp; puppies
          </h2>
          <p className="text-lede mt-5 max-w-[50ch] text-[var(--ink-soft)]">
            We are truly honored to see our puppies become cherished members of loving families. These heartwarming
            moments have been shared by our valued clients who welcomed a Teddy Pup into their homes and hearts.
          </p>
        </div>
        <figure className="tp-dusk__note">
          <blockquote className="font-plush-text">
            “TeddyPups truly made our dream a reality. They supported us at every step of the import journey. Our
            Maltipoo arrived healthy, cheerful, and absolutely perfect. Having 24/7 support throughout the process gave
            us complete peace of mind.”
          </blockquote>
          <figcaption className="font-scrawl">Sarah M., Dubai, UAE</figcaption>
        </figure>
      </div>

      <PhotoWall photos={photos}>
        <div className="tp-facade__ground">
          <span aria-hidden className="tp-facade__door" />
          <span aria-hidden className="tp-lamp">
            <span className="tp-lamp__light" />
          </span>
          <Link className="btn btn-primary tp-facade__cta" href="/happy-families">
            See every happy family
          </Link>
          <div className="tp-dusk__teddy tp-stop">
            <PupBuddy pose="sit" />
          </div>
        </div>
      </PhotoWall>
    </Scene>
  );
}
