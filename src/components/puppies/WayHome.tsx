import type { Puppy } from "@/lib/puppies";

type Step = { title: string; text: string };

const WELCOME: Step = { title: "Welcome home", text: "We help your new puppy settle in and ensure a smooth transition into your home." };

const JOURNEYS: Record<Puppy["origin"]["slug"], { heading: string; steps: Step[] }> = {
  imported: {
    heading: "Coming home from abroad",
    steps: [
      { title: "Reserve your puppy", text: "Tell us which puppy has captured your heart." },
      { title: "Personalized consultation", text: "We finalize details with you and share updates on your puppy's journey." },
      { title: "Import and arrival", text: "We manage health checks, travel arrangements, and documentation." },
      WELCOME,
    ],
  },
  local: {
    heading: "Coming home from our showroom",
    steps: [
      { title: "Choose your puppy", text: "Tell us which puppy has captured your heart, or ask us anything." },
      { title: "Meet before you choose", text: "Spend time bonding in our Downtown Dubai showroom." },
      { title: "Pick-up or delivery", text: "Collect your puppy from us, or we deliver safely to your home within Dubai." },
      WELCOME,
    ],
  },
};

/** ③ "the way home": how this pup gets to you, which depends on whether it's in Dubai or imported. */
export function WayHome({ puppy }: { puppy: Puppy }) {
  const { heading, steps } = JOURNEYS[puppy.origin.slug];
  const id = `home-steps-${puppy.slug}`;
  return (
    <section aria-labelledby={id} className="mt-20">
      <p className="tp-chapter">
        <span aria-hidden className="tp-chapter__n font-plush">
          3
        </span>
        <span className="font-scrawl">the way home</span>
      </p>
      <h2 id={id} className="font-plush text-big mt-3">
        {heading}
      </h2>
      <ol className="tp-trail tp-trail--row mt-10">
        {steps.map((step, i) => (
          <li key={step.title}>
            <span aria-hidden className="tp-trail__num font-plush">
              {i + 1}
            </span>
            <h3 className="font-plush-text text-xl font-bold leading-tight">{step.title}</h3>
            <p className="mt-2 max-w-[38ch] text-cocoa-soft">{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
