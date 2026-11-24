import type { MetadataRoute } from "next";
import { puppies } from "@/lib/puppies";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/puppies", "/gone-home", "/happy-families", "/how-it-works", "/faq", "/contact"];
  return [
    ...pages.map((p) => ({ url: `${site.url}${p}` })),
    ...puppies.map((p) => ({ url: `${site.url}/puppies/${p.slug}`, images: [`${site.url}${p.media[0].poster?.url ?? p.media[0].url}`] })),
  ];
}
