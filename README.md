# TeddyPups U.A.E. — website clone

A full-stack clone of [puppy.instabizweb.com](https://puppy.instabizweb.com/) (a Dubai teacup-puppy shop), built for the Blutec AI full-stack technical round.

- **Live:** https://teddypups-clone-swart.vercel.app
- **Stack:** Next.js 16 (App Router, Cache Components, Server Actions) · React 19 · TypeScript · Tailwind CSS v4 · Motion · Lenis · Zod · Neon Postgres · Vitest

## What's in it

| Route | What it does |
| --- | --- |
| `/` | Illustrated home page: hero puppy line-up, "Meet the pups" doors, two ways to buy, journey chat, trust passport, happy-families wall, FAQ teaser, closing CTA |
| `/puppies` | All available puppies with filters (where / breed / boy or girl) kept in the URL, animated re-ordering, "gone home" strip |
| `/puppies/[slug]` | 42 statically generated puppy pages: photo + video gallery with lightbox, facts card, checklist, journey steps, enquiry form, previous/next pup |
| `/gone-home` | Puppies that already found families |
| `/happy-families` | Photo wall of 64 family photos |
| `/how-it-works` | The adoption process, imported vs Dubai paths, delivery & collection |
| `/faq` | Searchable FAQ notes (+ FAQPage JSON-LD) |
| `/contact` | Showroom details and a general enquiry form |
| `/admin` | Password-protected list of enquiries (not linked from the site) |

**Backend.** Enquiry forms post to a Server Action (`src/app/actions/enquiry.ts`) that validates with Zod, drops bots via a honeypot field, and stores the enquiry in Postgres. `/admin` reads them back behind HTTP Basic auth: `src/proxy.ts` sends the browser's login prompt, and the page itself re-checks the credentials before touching the database.

**SEO.** Per-page metadata and Open Graph images, `sitemap.xml`, `robots.txt`, BreadcrumbList and FAQPage JSON-LD.

## Project structure

```
src/
  app/                 routes (one folder per page), server action, sitemap/robots, admin
  components/
    site/              header, mobile menu, footer, mobile WhatsApp bar, smooth scroll
    home/ puppies/ pages/   page-specific sections
    pup/               "Teddy" mascot (SVG poses)
    EnquiryForm.tsx, PuppyImage.tsx, RevealScope.tsx, icons.tsx
  data/                content as JSON (puppies, family photos, FAQs, journey steps)
  lib/                 puppies (types, filters, helpers), enquiry schema, db, site config, admin auth
  styles/              page-area CSS (home, puppies, pages); tokens + shared pieces in app/globals.css
db/schema.sql          enquiries table
scripts/               extract-content.py (content import), migrate.mjs
tests/                 Vitest unit tests
public/media           puppy photos and videos
```

## Running locally

```bash
npm ci
cp .env.example .env.local   # all optional for local development
npm run dev                  # http://localhost:3000
```

Without `DATABASE_URL`, enquiries are logged to the terminal in development (production refuses to run without it, so no enquiry is silently lost). Without `ADMIN_PASSWORD`, `/admin` is disabled.

| Script | |
| --- | --- |
| `npm run dev` / `build` / `start` | Next.js |
| `npm run lint` · `npm run typecheck` · `npm test` | ESLint · `tsc --noEmit` · Vitest |
| `npm run db:migrate` | Create the `enquiries` table in `DATABASE_URL` |

## Deploying (Vercel + Neon)

1. Push this repository to GitHub and import it in Vercel (framework preset: Next.js).
2. In the Vercel project, add a **Neon** Postgres database from *Storage → Marketplace*; it sets `DATABASE_URL`.
3. Add `ADMIN_PASSWORD` (and optionally `ADMIN_USER`) and `NEXT_PUBLIC_SITE_URL=https://<your-domain>`.
4. Run the migration once: `vercel env pull .env.local && npm run db:migrate`.
5. Redeploy. CI (`.github/workflows/ci.yml`) runs lint, type-check, tests and a production build on every push.

## Testing

- **Unit tests (Vitest, `npm test`):**
  - puppy filtering and display helpers;
  - enquiry validation (valid, invalid and missing fields, unknown puppy);
  - admin auth, including `proxy.ts` rejecting requests without credentials.
- **Static checks:** `npm run lint`, `npm run typecheck`, and `npm run build`, which prerenders all 57 pages and fails on Cache Components mistakes.
- **Visual comparison:**
  - Every page was screenshotted with headless Chrome at 1440 px and 390 px and compared side by side with the reference.
  - Page heights match exactly for Home (desktop), FAQ, Happy families, How it works, puppy detail and Contact. Listing and Gone home are within 0.5–1.1 %.
- **Manual and scripted checks:**
  - Filters via deep links.
  - Keyboard use of the gallery, lightbox, FAQ and menu.
  - Unknown puppy URLs return a real 404.
  - `/admin` returns 401 without credentials.
  - Enquiry form: field errors, success state, and production refusing to accept enquiries without a database.

## Known differences from the reference

- **Teddy doesn't walk.** On the original, the mascot walks between resting spots as you scroll and reacts to clicks. Here he sits still at each spot in a fixed pose, and phones hide the extra copies.
- **Photo viewers are simpler.** They load one image directly instead of swapping a blurred image for a sharp one.
- **Local puppies' "the way home" steps are our own copy.** The reference currently has no local puppy listed, so its wording couldn't be checked.
- **Content isn't editable.** Content lives in JSON, not a CMS; the reference's separate admin backend is out of scope.

## How the content was sourced

The reference site is a Next.js app, so every page ships its data in the React Server Components payload. `scripts/extract-content.py` reads saved copies of the pages and writes the puppies, family photos, FAQs and journey steps to `src/data/*.json`; images and videos were downloaded to `public/media` with their original paths. Text, photos and illustrations belong to the reference site and are used here only to reproduce it for this assignment.
