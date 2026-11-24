"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, type ReactNode } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { PupBuddy } from "@/components/pup/PupBuddy";
import { RevealScope } from "@/components/RevealScope";
import { breedsIn, filterPuppies, type Puppy, type PuppyFilters } from "@/lib/puppies";
import { PupSketch } from "./PupSketch";

const KEYS = ["origin", "breed", "gender", "collection"] as const;
type Key = (typeof KEYS)[number];

/** `puppies` should be trimmed with `toCard` to keep the client payload small. */
type Props = { puppies: Puppy[]; whatsappHref: string };

/**
 * Filterable grid of available puppies. Filters live in the URL (?origin=imported&breed=maltipoo…)
 * so they survive reloads and can be deep-linked. Reading search params makes this subtree
 * client-rendered, so the Suspense fallback server-renders the unfiltered list.
 */
export function PuppyBrowser(props: Props) {
  return (
    <Suspense fallback={<Browser {...props} filters={{}} />}>
      <UrlBrowser {...props} />
    </Suspense>
  );
}

function UrlBrowser(props: Props) {
  const params = useSearchParams();
  const pathname = usePathname();
  const filters: PuppyFilters = Object.fromEntries(KEYS.map((k) => [k, params.get(k) ?? undefined]));

  // Next.js keeps useSearchParams in sync with history.replaceState, without a server round trip.
  const replace = (next: URLSearchParams) => {
    const query = next.toString();
    window.history.replaceState(null, "", query ? `${pathname}?${query}` : pathname);
  };
  const toggle = (key: Key, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (filters[key] === value) next.delete(key);
    else next.set(key, value);
    replace(next);
  };

  return <Browser {...props} filters={filters} onToggle={toggle} onClear={() => replace(new URLSearchParams())} />;
}

type BrowserProps = Props & {
  filters: PuppyFilters;
  onToggle?: (key: Key, value: string) => void;
  onClear?: () => void;
};

function Browser({ puppies, whatsappHref, filters, onToggle, onClear }: BrowserProps) {
  const shown = filterPuppies(puppies, filters);
  const filtered = KEYS.some((k) => filters[k]);
  const breeds = breedsIn(puppies);
  const hasLocal = puppies.some((p) => p.origin.slug === "local");
  const hasKorean = puppies.some((p) => p.collections.some((c) => c.slug === "korean-teacup"));

  const chip = (key: Key, value: string, label: string) => (
    <Chip key={value} pressed={filters[key] === value} onClick={() => onToggle?.(key, value)}>
      {label}
    </Chip>
  );

  return (
    <MotionConfig reducedMotion="user">
      <div role="group" aria-label="Filter puppies" className="tp-sketchpad flex flex-col gap-4">
        <ChipRow label="where">
          <Chip pressed={!filters.origin && !filters.collection} onClick={onClear}>
            Everywhere
          </Chip>
          {hasLocal && chip("origin", "local", "In Dubai")}
          {chip("origin", "imported", "Imported")}
          {hasKorean && chip("collection", "korean-teacup", "Korean Teacup")}
        </ChipRow>
        <ChipRow label="breed">{breeds.map((b) => chip("breed", b.slug, b.name))}</ChipRow>
        <ChipRow label="boy or girl">
          {chip("gender", "male", "Boys")}
          {chip("gender", "female", "Girls")}
          {filtered && (
            <button type="button" onClick={onClear} className="link-ink ml-auto text-[0.95rem] font-semibold">
              Clear filters
            </button>
          )}
        </ChipRow>
      </div>

      <p className="font-scrawl mt-10 text-lg text-cocoa-soft" aria-live="polite">
        {shown.length === 1 ? "1 puppy" : `${shown.length} puppies`} {filtered ? "match" : "looking for a home"}
      </p>

      {shown.length > 0 ? (
        // Its own RevealScope: this subtree hydrates after the rest of the page (it's behind Suspense).
        <RevealScope>
          <motion.ul layout className="tp-sketches mt-8">
            {/* initial={false}: cards present on first render neither fade in nor ship hidden in the SSR HTML */}
            <AnimatePresence initial={false} mode="popLayout">
              {shown.map((pup, i) => (
                <motion.li
                  key={pup.id}
                  layout
                  initial={{ opacity: 0, scale: 0.86 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.86, transition: { duration: 0.2 } }}
                  transition={{ type: "spring", stiffness: 260, damping: 26 }}
                >
                  <PupSketch pup={pup} index={i} preload={i < 3} />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        </RevealScope>
      ) : (
        <div className="tp-sketchpad mt-10 grid items-center gap-6 md:grid-cols-[auto_1fr] md:gap-10">
          <PupBuddy pose="sit" className="mx-auto w-44 md:w-52" label="Teddy, tilting his head" />
          <div>
            <p className="font-plush text-big">No puppies match just now.</p>
            <p className="mt-3 max-w-[48ch] text-cocoa-soft">
              Tell us what you&apos;re hoping for and we&apos;ll let you know what&apos;s in our showroom or what we can bring in for you.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
                Ask on WhatsApp
              </a>
              <button type="button" onClick={onClear} className="btn btn-ghost">
                Show all puppies
              </button>
            </div>
          </div>
        </div>
      )}
    </MotionConfig>
  );
}

function ChipRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="font-scrawl mr-1 w-full shrink-0 text-cocoa-soft sm:w-28">{label}</span>
      {children}
    </div>
  );
}

function Chip({ pressed, onClick, children }: { pressed: boolean; onClick?: () => void; children: ReactNode }) {
  return (
    <button type="button" aria-pressed={pressed} onClick={onClick} className="tp-sticker-chip">
      {children}
    </button>
  );
}
