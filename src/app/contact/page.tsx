import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { EnquiryForm } from "@/components/EnquiryForm";
import { PawIcon } from "@/components/icons";
import { Skyline } from "@/components/pages/illustrations";
import { PupBuddy } from "@/components/pup/PupBuddy";
import { availablePuppies, enquiryLabel } from "@/lib/puppies";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Visit & contact",
  description: "Visit TeddyPups in Downtown Dubai or get in touch on WhatsApp, by phone or email.",
  alternates: { canonical: "/contact" },
};

const puppyOptions = availablePuppies.map((p) => ({ id: p.id, label: enquiryLabel(p) }));

// Same target as the reference site; swap in the showroom's Google Maps link when there is one.
const MAPS_HREF = "https://www.instabizweb.com/";

export default function ContactPage() {
  return (
    <div className="tp-page pt-[var(--header-h)]">
      <section
        data-tone="light"
        className="tp-scene"
        style={{ "--sky-top": "#fff9ee", "--sky-bottom": "#f9dca4" } as CSSProperties}
        aria-labelledby="contact-title"
      >
        <div className="gutter mx-auto max-w-[110rem] pt-10 pb-24 md:pt-16">
          <header className="grid gap-6 lg:grid-cols-12 lg:items-end">
            <h1 id="contact-title" className="font-plush text-giant max-w-[12ch] lg:col-span-7">
              Get in touch with us
            </h1>
            <p className="text-lede text-[var(--ink-soft)] lg:col-span-5 lg:pb-3">
              Have questions about our puppies or adoption process? Fill out the form, and our team will get back to you
              promptly. Whether ready to adopt or just seeking info, we&apos;d love to hear from you!
            </p>
          </header>

          <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-14">
            {/* The letter comes first in the DOM so it leads on mobile; on desktop it sits on the right. */}
            <div className="lg:col-span-7 lg:col-start-6 lg:row-start-1">
              <EnquiryForm variant="letter" puppies={puppyOptions} />
              <PupBuddy pose="sitLeft" className="-mt-3 mr-6 ml-auto w-36 md:w-40" />
            </div>

            <div className="lg:col-span-5 lg:row-start-1">
              <a href={site.whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp w-full sm:w-auto">
                WhatsApp {site.phoneDisplay}
              </a>
              <dl className="mt-10 space-y-6">
                <div>
                  <dt className="font-scrawl text-[var(--ink-soft)]">call us</dt>
                  <dd className="mt-1 text-lg font-semibold">
                    <a className="link-ink" href={site.phoneHref}>
                      {site.phoneDisplay}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="font-scrawl text-[var(--ink-soft)]">email</dt>
                  <dd className="mt-1 text-lg font-semibold break-all">
                    <a className="link-ink" href={`mailto:${site.email}`}>
                      {site.email}
                    </a>
                  </dd>
                </div>
              </dl>

              <section aria-labelledby="visit-title" className="tp-shopfront mt-12">
                <Skyline className="absolute right-0 -bottom-1 w-3/4 text-toffee/30" />
                <div className="tp-visit relative p-7 pt-6">
                  <div>
                    <h2 id="visit-title" className="font-plush text-[2rem] leading-tight">
                      Visit us in Downtown Dubai
                    </h2>
                    <p className="mt-3 max-w-[38ch] text-cocoa-soft">
                      Step into our Downtown Dubai showroom and experience the joy of choosing your puppy face-to-face.
                    </p>
                    <address className="mt-4 flex items-center gap-2 font-semibold not-italic">
                      <PawIcon className="size-5 shrink-0 text-toffee-deep" />
                      {site.address}
                    </address>
                    <a href={MAPS_HREF} target="_blank" rel="noopener noreferrer" className="btn btn-ghost mt-6 bg-milk!">
                      Open in Google Maps
                    </a>
                  </div>
                  <figure className="tp-visit__photo">
                    <Image
                      src="/media/skvodl2NZiKq/cefab5eee9/27b888_323008bb0f6a41d4bde2a0da7206cd98f003.jpg"
                      alt="The apricot teddy bear puppy from our showroom, held up to say hello"
                      fill
                      sizes="(min-width: 640px) 11rem, 90vw"
                      style={{ objectFit: "cover", objectPosition: "45.3% 44.4%", backgroundColor: "#685848" }}
                    />
                  </figure>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
