import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { EnquiryForm } from "@/components/EnquiryForm";
import { CheckIcon, PawIcon } from "@/components/icons";
import { PupBuddy } from "@/components/pup/PupBuddy";
import { PuppyGallery } from "@/components/puppies/PuppyGallery";
import { StoryRibbon } from "@/components/puppies/StoryRibbon";
import { WayHome } from "@/components/puppies/WayHome";
import { PuppyImage } from "@/components/PuppyImage";
import { RevealScope } from "@/components/RevealScope";
import { cover, enquiryLabel, getNeighbours, getPuppy, hasVideo, puppies, whereLabel, type Puppy } from "@/lib/puppies";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return puppies.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/puppies/[slug]">): Promise<Metadata> {
  const puppy = getPuppy((await params).slug);
  if (!puppy) notFound();
  const title = puppy.name ? `${puppy.name}, ${puppy.breed} puppy` : `${puppy.displayName} puppy (${puppy.genderLabel.toLowerCase()})`;
  const description = `Meet ${puppy.name || `this ${puppy.displayName}`}: ${puppy.breed}, ${puppy.genderLabel.toLowerCase()}, ${puppy.age} old, ${
    puppy.origin.slug === "local" ? "in Dubai" : "imported"
  }. Real photos${hasVideo(puppy) ? " and video" : ""} from ${site.name}.`;
  const image = cover(puppy);
  const images = [{ url: image.url, width: image.width, height: image.height, alt: image.alt }];
  return {
    title,
    description,
    alternates: { canonical: `/puppies/${puppy.slug}` },
    openGraph: { title, description, images },
    twitter: { title, description, images },
  };
}

const PROMISES = ["Vaccinated", "Dewormed", "Verified health certificate from licensed vets", "Thoroughly checked before joining your family"];

/**
 * Every pup is prerendered and the whole page depends on the slug, so params are read up front
 * (not behind a Suspense skeleton) and `instant = false` acknowledges that.
 * With Partial Prefetching, an unlisted slug would otherwise get the route's shell straight away,
 * committing a 200 before notFound() runs; ensureStatic = "navigation" makes that first request
 * wait for the full render, so unknown slugs answer with a real 404.
 */
export const instant = false;
export const ensureStatic = "navigation";

export default async function PuppyPage({ params }: PageProps<"/puppies/[slug]">) {
  const puppy = getPuppy((await params).slug);
  if (!puppy) notFound();

  const available = puppy.status === "available";
  const list = available ? { href: "/puppies", label: "Available puppies" } : { href: "/gone-home", label: "Gone home" };
  const enquireId = `enquire-${puppy.slug}`;
  const { previous, next } = getNeighbours(puppy);

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Puppies", item: `${site.url}/puppies` },
      { "@type": "ListItem", position: 2, name: puppy.displayName, item: `${site.url}/puppies/${puppy.slug}` },
    ],
  };

  return (
    <article
      className="tp-storybook mt-[var(--header-h)]"
      // The page is tinted with the cover photo's dominant colour.
      style={{ background: `linear-gradient(180deg, color-mix(in oklab, ${cover(puppy).color} 24%, var(--color-milk)) 0, var(--color-milk) 85%)` }}
    >
      <script
        type="application/ld+json"
        // JSON-LD from our own data; "<" is escaped so it can't close the script tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs).replace(/</g, "\\u003c") }}
      />
      <StoryRibbon />

      <div className="gutter mx-auto max-w-[110rem] pb-20 pt-8 md:pt-12">
        <nav aria-label="Breadcrumb" className="text-[0.95rem] font-semibold text-cocoa-soft">
          <Link className="link-ink" href={list.href}>
            {list.label}
          </Link>
          <span aria-hidden> / </span>
          <span aria-current="page">{puppy.displayName}</span>
        </nav>

        <Chapter n={1}>{available ? "hello, it's me" : "the day they went home"}</Chapter>
        <div className="mt-4 grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-7">
            <PuppyGallery name={puppy.displayName} media={puppy.media} />
          </div>
          <RevealScope className="min-w-0 lg:col-span-5">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+5.5rem)]">
              <NameTag puppy={puppy} enquireId={enquireId} />
              <div className="tp-paper mt-8 -rotate-1">
                <Chapter n={2}>what comes with {puppy.name || `this ${puppy.displayName}`}</Chapter>
                <h2 className="font-plush mt-1 text-[1.9rem]">Every Teddy Pup comes</h2>
                <ul className="mt-4 space-y-2.5">
                  {PROMISES.map((item) => (
                    <li key={item} className="flex items-start gap-3 font-semibold">
                      <CheckIcon className="mt-0.5 size-6 shrink-0 text-toffee-deep" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </RevealScope>
        </div>

        {available && <WayHome puppy={puppy} />}

        <section id={enquireId} aria-labelledby={`${enquireId}-title`} className="tp-letter mt-20 grid gap-10 lg:grid-cols-12">
          <span aria-hidden className="tp-letter__stamp">
            <PawIcon className="size-9" />
          </span>
          <div className="lg:col-span-4">
            <Chapter n={available ? 4 : 3}>dear TeddyPups…</Chapter>
            <h2 id={`${enquireId}-title`} className="font-plush text-big mt-2">
              {available ? `Ask about ${puppy.name || "this puppy"}` : "Looking for a puppy like this?"}
            </h2>
            <p className="mt-4 text-cocoa-soft">
              Leave your details and our team will get back to you promptly — or message us on WhatsApp for the quickest reply.
            </p>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <EnquiryForm puppy={{ id: puppy.id, label: enquiryLabel(puppy) }} />
          </div>
        </section>

        <nav aria-label="More puppies" className="mt-16 grid gap-4 sm:grid-cols-2">
          <NeighbourLink puppy={previous} label="Previous pup" />
          <NeighbourLink puppy={next} label="Next pup" />
        </nav>
      </div>
    </article>
  );
}

function Chapter({ n, children }: { n: number; children: ReactNode }) {
  return (
    <p className="tp-chapter">
      <span aria-hidden className="tp-chapter__n font-plush">
        {n}
      </span>
      <span className="font-scrawl">{children}</span>
    </p>
  );
}

/** The swinging name tag: status, name and the key facts, with Teddy peeking over the top. */
function NameTag({ puppy, enquireId }: { puppy: Puppy; enquireId: string }) {
  const available = puppy.status === "available";
  const facts = [
    ["Breed", puppy.breed],
    ["Boy or girl", puppy.genderLabel],
    ["Age", puppy.age],
    ["Where", whereLabel(puppy)],
  ];
  return (
    <div className="tp-tag tp-board mt-16 !rounded-[2.2rem_2.2rem_2.2rem_0.6rem] !p-7 md:!p-9 lg:mt-20" data-reveal>
      <span aria-hidden className="tp-tag__ring" />
      <PupBuddy pose="peek" className="absolute -top-[4.8rem] right-6 w-[9.5rem]" />
      {available ? (
        <span className="chip">
          <PawIcon className="size-4 text-toffee" />
          Available
        </span>
      ) : (
        <span className="inline-grid -rotate-6 place-items-center rounded-full border-[3px] border-current px-3 py-1 font-scrawl text-sm uppercase tracking-wide text-toffee-deep">
          Gone home ♥
        </span>
      )}
      <h1 className="font-plush mt-4 text-[clamp(2.6rem,5vw,4.6rem)]">{puppy.displayName}</h1>
      {puppy.name && <p className="mt-2 text-lg font-semibold text-cocoa-soft">{puppy.breed}</p>}
      <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-4">
        {facts.map(([term, value]) => (
          <div key={term}>
            <dt className="font-scrawl text-sm text-cocoa-soft">{term}</dt>
            <dd className="mt-0.5 text-[1.05rem] font-semibold">{value}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-8 flex flex-col gap-3">
        <a href={site.whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
          {available ? `Ask about ${puppy.name || "this puppy"} on WhatsApp` : "Ask about a puppy like this"}
        </a>
        <a href={`#${enquireId}`} className="btn btn-ghost">
          Send an enquiry
        </a>
      </div>
    </div>
  );
}

function NeighbourLink({ puppy, label }: { puppy: Puppy; label: string }) {
  return (
    <Link
      href={`/puppies/${puppy.slug}`}
      className="group flex items-center gap-5 rounded-[2rem] border-[3px] border-cocoa bg-milk p-4 transition-transform duration-500 hover:-rotate-1 sm:last:flex-row-reverse sm:last:text-right"
    >
      <span className="relative h-24 w-20 shrink-0 overflow-hidden rounded-[999px_999px_0.6rem_0.6rem] border-[3px] border-cocoa bg-honey-soft">
        <PuppyImage media={cover(puppy)} fill sizes="80px" />
      </span>
      <span>
        <span className="font-scrawl block text-sm text-cocoa-soft">{label}</span>
        <span className="font-plush text-[1.6rem]">{puppy.displayName}</span>
      </span>
    </Link>
  );
}
