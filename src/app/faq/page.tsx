import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { NoticeBoard } from "@/components/pages/faq/NoticeBoard";
import faqs from "@/data/faqs.json";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Questions & answers",
  description:
    "Answers about TeddyPups puppies: health checks and vaccinations, meeting local puppies, imported teacup breeds and delivery.",
  alternates: { canonical: "/faq" },
};

// Lets search engines show the questions as rich results.
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
};

export default function FaqPage() {
  return (
    <div className="tp-page pt-[var(--header-h)]">
      <script
        type="application/ld+json"
        // Escape "<" so the JSON can never close the script tag early.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }}
      />
      <section
        data-tone="dark"
        className="tp-scene tp-faqroom overflow-hidden"
        style={{ "--sky-top": "#a95e32", "--sky-bottom": "#331c11" } as CSSProperties}
        aria-labelledby="faq-title"
      >
        <div className="gutter relative mx-auto max-w-[110rem] pt-10 pb-24 md:pt-16">
          <header className="max-w-4xl">
            <h1 id="faq-title" className="font-plush text-giant">
              Questions &amp; answers
            </h1>
            <p className="text-lede mt-6 max-w-[52ch] text-[var(--ink-soft)]">
              Can&apos;t find what you&apos;re looking for? Message us on WhatsApp — our team is available 24/7.
            </p>
          </header>
          <div className="mt-12 md:mt-16">
            <NoticeBoard faqs={faqs} askHref={site.whatsappHref} />
          </div>
        </div>
      </section>
    </div>
  );
}
