// Business details shown across the site. Values mirror the reference site.
const WHATSAPP_NUMBER = "919898124987";
const WHATSAPP_TEXT = "Hi Insta Biz Web, I'd like to discuss a project.";

export const site = {
  name: "TeddyPups U.A.E.",
  shortName: "TeddyPups",
  tagline: "every puppy is family",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  description:
    "Premium teacup and designer puppies in Dubai. Meet your new best friend in our Dubai showroom, or order a rare miniature breed from trusted breeders worldwide.",
  whatsappHref: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_TEXT)}`,
  phoneDisplay: "+971 50 000 0000",
  phoneHref: "tel:+971500000000",
  email: "info@instabizweb.com",
  address: "Downtown Dubai, United Arab Emirates",
  socials: [
    { label: "Instagram", href: "https://www.instabizweb.com/" },
    { label: "TikTok", href: "https://www.instabizweb.com/" },
    { label: "Facebook", href: "https://www.instabizweb.com/" },
  ],
} as const;

export const mainNav = [
  { href: "/", label: "Home" },
  { href: "/puppies", label: "Puppies" },
  { href: "/happy-families", label: "Happy families" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Visit & contact" },
] as const;

export const footerNav = [
  { href: "/puppies", label: "Available puppies" },
  { href: "/gone-home", label: "Gone home" },
  { href: "/happy-families", label: "Happy families" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/how-it-works#delivery", label: "Delivery & collection" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Visit & contact" },
] as const;
