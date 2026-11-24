# AI workflow and prompts

This file records how AI tools were used to build the clone, including the exact prompts, as the assignment asks.

## Tools

| Tool | Used for |
| --- | --- |
| **Claude Code** (CLI, model Claude Opus 5.5) | Planning, reverse-engineering the reference site, writing code, reviewing, testing |
| Claude Code **subagents** in separate **git worktrees** | Building the three page groups in parallel without touching each other's files |
| Headless Chrome via **puppeteer-core** | Full-page screenshots of the reference and the clone at 1440 px and 390 px, compared side by side |
| Next.js 16 docs bundled in `node_modules/next/dist/docs` | Checking current APIs (Cache Components, Proxy, Server Actions) instead of relying on memory |

## Process

1. **Recon.** Downloaded every page in the reference `sitemap.xml`, took full-page screenshots, and found it is itself a Next.js 16 + Tailwind v4 + Motion + Lenis app. The page data ships in the RSC payload, so `scripts/extract-content.py` turns it into `src/data/*.json`. The compiled CSS was split by component (`tp-hero`, `tp-door`, …) to use as a reference for exact values.
2. **Foundation (main agent).** Scaffold, design tokens, fonts, header/menu/footer/mobile bar, the Teddy mascot poses, `PuppyImage`, `RevealScope`, the typed data layer, and the backend (Zod-validated Server Action → Postgres, `/admin` with Basic auth, tests, CI).
3. **Pages (three parallel subagents).** Home; Puppies + detail + Gone home; Happy families + How it works + FAQ + Contact. Each worked in its own worktree and only touched its own folders. Each compared its screenshots with the reference until they matched, and had to pass `tsc`, ESLint and `next build`.
4. **Integration (main agent).**
   - Rebased each branch onto `main` and fixed the shared-component bugs the agents reported (a StrictMode issue in `RevealScope`, the ear-twitch transform).
   - Merged CSS that two agents had ported separately into `styles/shared.css`. A layered and an unlayered copy of `.tp-polaroid__photo` were cropping the Happy-families photos.
   - Re-checked page heights against the reference: Home, Happy families, How it works and FAQ now match to the pixel on desktop.

## Prompts

### 1. Initial prompt (to Claude Code)

> /home/…/Downloads/Gmail - Technical Round Assignment – Full Stack Developer – Blutec AI.pdf we have to do this assignment make this end to end , use best practices and plugins where required

Follow-ups:

> https://puppy.instabizweb.com/ now check its live

(The reference site was briefly unreachable, NXDOMAIN, when work started.)

> is all done ?

Decisions given when Claude Code asked: keep everything local so the candidate pushes and deploys from his own GitHub/Vercel accounts, and author commits as the candidate.

### 2. Subagent briefs

The main agent wrote one brief per page group. They share this preamble (paths shortened):

> You are building the **[PAGES]** of a faithful clone of https://puppy.instabizweb.com/ ("TeddyPups U.A.E.", a Dubai teacup-puppy shop). This is a technical hiring assignment: "match design, layout, responsiveness and functionality as closely as possible", built with best practices. The candidate must be able to explain the code, so write clean, idiomatic, well-structured source (no minified copies, no dumping the original's compiled CSS wholesale).
>
> **Your worktree.** Run `npm ci` first. Stack: Next.js 16.4 App Router with `cacheComponents: true` (read AGENTS.md; APIs differ from your training data, docs are in node_modules/next/dist/docs/), React 19, Tailwind v4, `motion`, TypeScript strict.
>
> **Your scope (only touch these):** [routes], `src/components/[area]/**`, `src/styles/[area].css`. Do NOT edit shared files. If you truly need a shared change, describe it in your final report instead.
>
> **Already built (reuse, don't duplicate):** globals.css tokens and shared classes; `PupBuddy` (Teddy mascot poses); `icons.tsx`; `PuppyImage` (focal point + blur placeholder); `RevealScope`; `EnquiryForm` + its server action; `lib/puppies.ts` helpers; `lib/site.ts`; `data/*.json`; media in `public/media`.
>
> **Reference material:** full-page screenshots and slices, server-rendered HTML, decoded RSC payloads, the original's CSS split per component, and compiled JS chunks. The live site is reachable; puppeteer-core is installed for your own screenshots and interaction states.
>
> **Engineering expectations:** server components by default, `"use client"` only for interactive leaves; respect `prefers-reduced-motion`; accessible (labels, real buttons, dialogs with Escape and focus handling, alt text); responsive at 390/768/1024/1440 with no horizontal scroll; no new dependencies; verify with `tsc`, ESLint, your own screenshots compared with the reference, and `next build`; commit in logical commits.
>
> **Final report:** branch, files, what's implemented, known differences (be honest), anything that needs a shared-file change.

Section lists given to each agent:

- **Home**:
  1. Hero with the arched puppy line-up over the quilt.
  2. "Meet the pups" doors that open on scroll (pinned on desktop, a grid on mobile).
  3. "Two ways to meet your puppy": signpost, showroom, Korea → Dubai flight.
  4. "Your puppy journey" steps with the WhatsApp-style phone chat.
  5. "Why families trust TeddyPups" passport.
  6. Dusk skyline, testimonial, and the house photo wall with 8 polaroids.
  7. Night "Questions, answered".
  8. The "Ready to meet your new best friend?" glowing door.
- **Puppies**:
  1. `/puppies` with the sketchbook header, filters kept in the URL, animated sketch cards, empty state and the "Already gone home" strip.
  2. `/puppies/[slug]`: static params for all 42, metadata, `notFound`, BreadcrumbList JSON-LD, gallery and lightbox, sticky info tag, checklist, "the way home" steps (imported vs local), enquiry letter, previous/next.
  3. `/gone-home` tickets.
- **Content pages**:
  1. `/happy-families`: 64 taped polaroids and a viewer.
  2. `/how-it-works`, including the `#delivery` section.
  3. `/faq`: searchable notes plus FAQPage JSON-LD.
  4. `/contact`: visit details and the enquiry form with a puppy picker.

### 3. Follow-up messages to subagents

> Your 4 commits are merged into `main` … Follow-up task: close the contact-page gap. … add an optional `variant?: "form" | "letter"` prop (default `"form"` must render exactly as today …). The `"letter"` variant reproduces the original contact page: the fill-in-the-blanks letter ("my name is ___, and you can reach me on ___ …") using the same field names so the same server action and zod errors apply, "Post my letter" button, and the fold-and-post-box sent animation … respect reduced motion, keep errors accessible …

> main now has `src/styles/shared.css` (`.tp-polaroid*`, `.tp-tape*`, `.tp-stamp*`, `.tp-entry*`, `.tp-flight*`) and globals.css has `text-giant`, `text-huge`, `text-lede`, `measure`, `.tp-scene`. Do NOT redefine these in puppies.css …

## What was decided by hand (and why)

- **Same stack as the reference** (Next.js 16, Tailwind v4, Motion, Lenis), so animations and layout can match exactly. Only Zod (validation) and the Neon driver were added.
- **Content as typed JSON, not a CMS.** The reference uses a separate admin backend. For a clone, static JSON lets every page prerender. Enquiries are the only data the site writes, so they're the only thing in the database.
- **Server Action plus a Postgres table** for enquiries, with a honeypot and Zod errors shown inline. Production refuses to run without a database, so no enquiry is silently dropped.
- **`/admin` behind HTTP Basic auth.** `proxy.ts` shows the login prompt, and the page re-checks credentials before reading data, because the Next.js docs say Proxy alone isn't an authorization layer. Tests cover requests without credentials.
- **The walking mascot was simplified** to static poses at each resting spot (see README, "Known differences").
