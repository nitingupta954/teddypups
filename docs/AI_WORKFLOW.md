# AI Tools and Workflow

This document records how AI tools were used to build this project,
including the exact prompts used at each stage of development.

---

## AI Tool Used

**Primary tool:** Antigravity (AI coding assistant by Google DeepMind)

---

## Development Approach

Instead of asking the AI to generate the entire website in one go,
I divided the project into smaller, clearly scoped tasks.

This approach made it easier to:
- Review the generated code section by section
- Identify issues before they compounded
- Improve individual parts without breaking others

---

## Exact Prompts

### Prompt 1 — Project Foundation

> Build a full-stack clone of https://puppy.instabizweb.com/ for a
> technical hiring assignment.
>
> Match the design, layout, responsiveness, and functionality as closely
> as possible. The candidate must be able to explain the code, so write
> clean, idiomatic, well-structured TypeScript — no minified copies, no
> dumping compiled CSS wholesale.
>
> **Stack:** Next.js 16 App Router (`cacheComponents: true`), React 19,
> Tailwind CSS v4, Motion, Lenis, TypeScript strict mode.
>
> **Build the foundation first:**
> - Project scaffold, design tokens, global CSS variables, fonts
> - Header, mobile menu, footer, mobile WhatsApp bar
> - Smooth scroll wrapper (Lenis)
> - Teddy mascot component (`PupBuddy`) with SVG poses
> - `PuppyImage` — smart image wrapper with focal-point and blur placeholder
> - `RevealScope` — intersection-observer reveal animation wrapper
> - `EnquiryForm` with Zod validation and a Server Action that writes to Postgres
> - `/admin` page behind HTTP Basic auth (proxy + page-level double check)
> - Vitest unit tests for auth, validation, and data helpers
> - GitHub Actions CI: lint → typecheck → test → build

---

### Prompt 2 — Homepage

> **Scope:** `src/app/page.tsx`, `src/components/home/**`
>
> Build all 8 homepage sections:
> 1. Hero with the arched puppy line-up over the quilt background
> 2. "Meet the pups" doors that open on scroll — pinned on desktop, grid on mobile
> 3. "Two ways to meet your puppy" — signpost, showroom, Korea → Dubai flight path
> 4. "Your puppy journey" steps with a WhatsApp-style phone chat animation
> 5. "Why families trust TeddyPups" — passport card design
> 6. Dusk skyline scene, testimonial, and house photo wall with 8 polaroids
> 7. Night scene — "Questions, answered" FAQ teaser
> 8. "Ready to meet your new best friend?" — glowing door closing CTA
>
> **Engineering requirements:**
> - Server Components by default; `'use client'` only on interactive leaves
> - Respect `prefers-reduced-motion`
> - Fully accessible: labels, real `<button>` elements, alt text
> - Responsive at 390 / 768 / 1024 / 1440 px with no horizontal scroll
> - No new npm dependencies

---

### Prompt 3 — Puppy Pages

> **Scope:** `src/app/puppies/**`, `src/components/puppies/**`,
> `src/components/pup/**`
>
> Build:
>
> **`/puppies` — Listing page**
> - Sketchbook-style header
> - Filters (location / breed / sex) stored in the URL as search params
> - Animated sketch cards with Motion layout transitions
> - Empty state when no puppies match filters
> - "Already gone home" strip at the bottom
>
> **`/puppies/[slug]` — Detail page (42 static pages)**
> - `generateStaticParams` for all 42 puppies
> - Per-page metadata and Open Graph tags
> - `notFound()` for unknown slugs
> - BreadcrumbList JSON-LD structured data
> - Photo + video gallery with lightbox (keyboard accessible, Escape to close)
> - Sticky info tag and breed checklist
> - "The way home" adoption journey steps (imported path vs. local Dubai path)
> - Enquiry letter form
> - Previous / next puppy navigation
>
> **`/gone-home` — Tickets page**
> - Gallery of puppies that have already found families

---

### Prompt 4 — Refinement (Follow-up)

> Follow-up task: improve the contact page and enquiry form.
>
> Add an optional `variant?: "form" | "letter"` prop to `EnquiryForm`
> (default `"form"` must render exactly as it does today — no regressions).
>
> The `"letter"` variant must reproduce the original site's contact page:
> - A fill-in-the-blanks letter style: "My name is ___, you can reach me
>   on ___, I am interested in ___…"
> - Same Zod field names and validation so the same Server Action applies
> - "Post my letter" submit button
> - Fold-and-post-box animation on successful submission
> - Respect `prefers-reduced-motion`
> - All error states remain accessible (aria-live, inline messages)

---

## Code Review and Manual Corrections

I did not blindly accept AI-generated code.

After each prompt I:
1. **Read every generated file** and checked logic, not just output
2. **Ran the full check suite** — `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`
3. **Took screenshots** at 1440 px and 390 px and compared them side by side with the reference
4. **Manually corrected** issues the AI got wrong — particularly around Tailwind v4 syntax (the AI defaulted to v3 patterns), the Next.js 16 Cache Components API (not in training data), and Lenis scroll integration timing

For me, **AI was a development assistant, not a replacement for understanding the code.**

---

## Key Decisions Made by Hand

| Decision | Reason |
|---|---|
| Same stack as the reference (Next.js 16, Tailwind v4, Motion, Lenis) | Lets animations and layout match exactly without fighting the framework |
| Content as typed JSON, not a CMS | Static JSON allows every page to prerender at build time |
| Zod validation on the Server Action | Type-safe errors surfaced inline in the form, with honeypot bot protection |
| Double-layer admin auth (`proxy.ts` + page re-check) | Next.js docs state that the Proxy alone is not an authorization layer |
| Timing-safe string comparison in `admin-auth.ts` | Prevents timing attacks that reveal which credential half was wrong |
| Graceful DB degradation in development | Missing `DATABASE_URL` logs enquiries in dev; throws hard in production so nothing is silently lost |
