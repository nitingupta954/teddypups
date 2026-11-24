import type { Metadata } from "next";
import { Dusk } from "@/components/home/Dusk";
import { Hero } from "@/components/home/Hero";
import { HomeCta } from "@/components/home/HomeCta";
import { Journey } from "@/components/home/Journey";
import { Meet } from "@/components/home/Meet";
import { Night } from "@/components/home/Night";
import { Passport } from "@/components/home/Passport";
import { Paths } from "@/components/home/Paths";
import { showroomPhotos } from "@/components/home/showroom";
import { site } from "@/lib/site";

const title = `${site.name} — Premium teacup puppies in Dubai`;
const ogImage = showroomPhotos[0];

export const metadata: Metadata = {
  description: site.description,
  alternates: { canonical: "/" },
  // openGraph replaces the layout's object wholesale, so it repeats the site-wide fields.
  openGraph: {
    title,
    description: site.description,
    url: "/",
    siteName: site.name,
    type: "website",
    locale: "en_AE",
    images: [{ url: ogImage.url, width: ogImage.width, height: ogImage.height, alt: ogImage.alt }],
  },
};

/**
 * The home page is one long walk from morning to night: each scene carries on
 * the sky gradient of the one before it.
 */
export default function HomePage() {
  return (
    <div className="tp-home-page">
      <Hero />
      <Meet />
      <Paths />
      <Journey />
      <Passport />
      <Dusk />
      <Night />
      <HomeCta />
    </div>
  );
}
