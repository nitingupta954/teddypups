import type { Metadata } from "next";
import { PupBuddy } from "@/components/pup/PupBuddy";
import { GoneStrip } from "@/components/puppies/GoneStrip";
import { PuppyBrowser } from "@/components/puppies/PuppyBrowser";
import { toCard } from "@/components/puppies/PupSketch";
import { RevealScope } from "@/components/RevealScope";
import { availablePuppies } from "@/lib/puppies";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Available puppies",
  description:
    "Teacup and teddy bear puppies available now in Dubai and imported from trusted breeders — every listing shows real photos of the puppy.",
  alternates: { canonical: "/puppies" },
};

export default function PuppiesPage() {
  return (
    // Pages clear the fixed site header themselves.
    <div className="pt-[var(--header-h)]">
      <section aria-labelledby="pups-title" className="tp-sketchbook">
        <div className="gutter mx-auto max-w-[110rem] pb-24 pt-10 md:pt-16">
          <RevealScope className="tp-sketchbook__head">
            <div className="tp-sketchbook__words">
              <p className="font-scrawl text-lg text-toffee-ink" data-reveal>
                from Teddy&apos;s sketchbook
              </p>
              <h1 id="pups-title" className="font-plush text-giant tp-sketchbook__title" data-reveal>
                Available puppies
                <svg aria-hidden viewBox="0 0 400 24" preserveAspectRatio="none" className="tp-sketchbook__underline">
                  <path d="M4 15c40-9 70 5 112-2s70-9 112 0 74 8 116-1 38-4 52 1" pathLength={1} />
                </svg>
              </h1>
              <p className="tp-sketchbook__lede text-lede mt-6 max-md:text-[1.0625rem] max-w-[46ch] text-cocoa-soft" data-reveal>
                Every listing shows real photos of the actual puppy. Open a profile to see them all, then ask us about them on
                WhatsApp.
              </p>
            </div>
            <div className="tp-sketchbook__self" data-reveal>
              <PupBuddy pose="sitLeft" label="Teddy, the TeddyPups puppy" />
              <span className="font-scrawl tp-sketchbook__caption">self-portrait</span>
            </div>
          </RevealScope>

          <div className="mt-12">
            <PuppyBrowser puppies={availablePuppies.map(toCard)} whatsappHref={site.whatsappHref} />
          </div>
        </div>
      </section>
      <GoneStrip />
    </div>
  );
}
