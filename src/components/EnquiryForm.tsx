"use client";

import { useActionState, useEffect, useId, useRef, useState, startTransition, type ComponentProps, type CSSProperties } from "react";
import { motion, useReducedMotion } from "motion/react";
import { PawIcon } from "@/components/icons";
import { submitEnquiry } from "@/app/actions/enquiry";
import type { EnquiryState } from "@/lib/enquiry";
import { site } from "@/lib/site";

type Option = { id: string; label: string };

type Props = {
  /** Enquiry about one specific pup (detail page). */
  puppy?: Option;
  /** Otherwise offer a "which puppy?" picker (contact page). */
  puppies?: Option[];
  /** Single-column layout for narrow containers. */
  compact?: boolean;
  /** "letter": the contact page's fill-in-the-blanks letter that gets posted. */
  variant?: "form" | "letter";
};

const inputClass =
  "mt-1.5 w-full rounded-2xl border-2 border-cocoa/60 bg-milk px-4 text-base outline-none transition-[border-color,box-shadow] focus:border-cocoa focus:shadow-[0_0_0_4px_rgb(242_190_107/0.6)] aria-[invalid=true]:border-[#b3261e]";

function Field({ label, error, hint, ...input }: ComponentProps<"input"> & { label: string; error?: string; hint?: string }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="block text-[0.95rem] font-semibold">
        {label}
        {input.required ? (
          <span className="text-toffee-ink"> *</span>
        ) : (
          <span className="font-normal text-cocoa-soft"> (optional)</span>
        )}
      </label>
      <input
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-err` : hint ? `${id}-hint` : undefined}
        className={`${inputClass} h-12`}
        {...input}
      />
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1 text-sm text-cocoa-soft">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-err`} className="mt-1 text-sm font-semibold text-[#b3261e]">
          {error}
        </p>
      )}
    </div>
  );
}

export function EnquiryForm({ variant = "form", ...props }: Props) {
  return variant === "letter" ? <EnquiryLetter puppies={props.puppies ?? []} /> : <EnquiryCard {...props} />;
}

function EnquiryCard({ puppy, puppies, compact = false }: Omit<Props, "variant">) {
  const [state, action, pending] = useActionState<EnquiryState, FormData>(submitEnquiry, { ok: false });
  const pickId = useId();
  const messageId = useId();

  if (state.ok) {
    return (
      <motion.div
        role="status"
        initial={{ rotateX: -80, opacity: 0, y: -10 }}
        animate={{ rotateX: 0, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 160, damping: 16 }}
        className="rounded-[2rem] border-[3px] border-cocoa bg-honey p-8 text-center"
      >
        <svg viewBox="0 0 120 84" className="mx-auto w-32" aria-hidden>
          <path d="M6 10h108v68H6z" fill="#fffdf8" stroke="#2a170e" strokeWidth="3" strokeLinejoin="round" />
          <path d="M6 10l54 40 54-40" fill="none" stroke="#2a170e" strokeWidth="3" strokeLinejoin="round" />
          <circle cx="94" cy="62" r="12" fill="#c2622b" stroke="#2a170e" strokeWidth="2.5" />
        </svg>
        <p className="font-plush mt-4 text-[2rem]">Message received!</p>
        <p className="mx-auto mt-2 max-w-[38ch] text-cocoa-soft">
          Thank you — our team will get back to you promptly. For the quickest reply, message us on WhatsApp.
        </p>
        <a href={site.whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp mt-6">
          WhatsApp us
        </a>
      </motion.div>
    );
  }

  return (
    <form
      noValidate
      className="space-y-5"
      // Submit via onSubmit (not the `action` prop) so React doesn't reset the
      // fields when the server sends back validation errors.
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        startTransition(() => action(data));
      }}
    >
      {state.message && (
        <p role="alert" className="rounded-2xl bg-blush px-4 py-3 font-semibold">
          {state.message}
        </p>
      )}
      <div className={compact ? "space-y-5" : "grid gap-5 sm:grid-cols-2"}>
        <Field label="Your name" name="name" autoComplete="name" required minLength={2} maxLength={80} error={state.errors?.name} />
        <Field
          label="Phone or WhatsApp"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          required
          error={state.errors?.phone}
          hint="With country code, e.g. +971 50 123 4567"
        />
        <Field label="Email" name="email" type="email" autoComplete="email" error={state.errors?.email} />
        <Field label="Your area" name="area" autoComplete="address-level2" maxLength={80} error={state.errors?.area} hint="e.g. Dubai Marina" />
      </div>

      {puppy ? (
        <input type="hidden" name="puppyId" value={puppy.id} />
      ) : (
        puppies && (
          <div>
            <label htmlFor={pickId} className="block text-[0.95rem] font-semibold">
              Puppy you&apos;re interested in <span className="font-normal text-cocoa-soft">(optional)</span>
            </label>
            <select id={pickId} name="puppyId" defaultValue="" className={`${inputClass} h-12`}>
              <option value="">Not sure yet</option>
              {puppies.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        )
      )}

      <div>
        <label htmlFor={messageId} className="block text-[0.95rem] font-semibold">
          Message <span className="font-normal text-cocoa-soft">(optional)</span>
        </label>
        <textarea
          id={messageId}
          name="message"
          rows={compact ? 3 : 4}
          maxLength={2000}
          aria-invalid={!!state.errors?.message}
          className={`${inputClass} py-3`}
          defaultValue={puppy ? `Hi! I'd love to know more about ${puppy.label}.` : ""}
        />
        {state.errors?.message && <p className="mt-1 text-sm font-semibold text-[#b3261e]">{state.errors.message}</p>}
      </div>

      {/* Honeypot for bots; hidden from people and assistive tech. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      <button type="submit" disabled={pending} className="btn btn-primary w-full disabled:opacity-70 sm:w-auto">
        {pending ? "Sending…" : "Send enquiry"}
      </button>
    </form>
  );
}

/* ---------- Letter variant ---------- */

/** writing → (folds into an envelope) sealing → (drops into the post box) posting → sent */
type Phase = "writing" | "sealing" | "posting" | "sent";

type BlankProps = ComponentProps<"input"> & { label: string; chars: number; error?: string; errorId: string };

/** An inline "___" blank in a sentence; its label lives in aria-label since there's no room for a visible one. */
function Blank({ label, chars, error, errorId, ...input }: BlankProps) {
  return (
    <span className="tp-blank" style={{ "--size": `${chars}ch` } as CSSProperties}>
      <input aria-label={label} aria-invalid={!!error || undefined} aria-describedby={error ? errorId : undefined} {...input} />
    </span>
  );
}

function EnquiryLetter({ puppies }: { puppies: Option[] }) {
  const [state, action, pending] = useActionState<EnquiryState, FormData>(submitEnquiry, { ok: false });
  const [phase, setPhase] = useState<Phase>("writing");
  // Height is pinned while the letter folds away so the page doesn't jump.
  const [pinnedHeight, setPinnedHeight] = useState<number>();
  const reduceMotion = useReducedMotion();
  const boxRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const sentRef = useRef<HTMLDivElement>(null);
  const uid = useId();
  const pickId = useId();
  const noteId = useId();
  const errors = state.errors ?? {};
  const errId = (field: string) => `${uid}-${field}-err`;

  // Play the posting animation once the server accepts the letter.
  useEffect(() => {
    if (!state.ok) return;
    const timers = reduceMotion
      ? [setTimeout(() => setPhase("sent"), 0)]
      : [
          setTimeout(() => {
            setPinnedHeight(boxRef.current?.offsetHeight);
            setPhase("sealing");
          }, 0),
          setTimeout(() => setPhase("posting"), 750),
          setTimeout(() => {
            setPinnedHeight(undefined);
            setPhase("sent");
          }, 1750),
        ];
    return () => timers.forEach(clearTimeout);
  }, [state.ok, reduceMotion]);

  // Move focus to the thank-you card so screen readers hear it.
  useEffect(() => {
    const card = sentRef.current;
    if (phase !== "sent" || !card) return;
    card.focus({ preventScroll: true });
    // The card is shorter than the letter, so it can end up under the fixed header; nudge it into view.
    const headerPx = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) * 16 || 76;
    // Measure the wrapper: the card itself is mid entrance animation (translated).
    const top = boxRef.current?.getBoundingClientRect().top ?? 0;
    if (top < headerPx + 8) scrollBy({ top: top - headerPx - 24, behavior: reduceMotion ? "auto" : "smooth" });
  }, [phase, reduceMotion]);

  // After a failed submit, focus the first blank that needs fixing.
  useEffect(() => {
    if (!state.ok && state.errors) formRef.current?.querySelector<HTMLElement>("[aria-invalid=true]")?.focus();
  }, [state]);

  const errorList = Object.entries(errors);

  return (
    <div ref={boxRef} className="tp-post" data-phase={phase} style={{ minHeight: pinnedHeight }}>
      {phase !== "sent" && (
        <form
          ref={formRef}
          noValidate
          className="tp-letterform"
          aria-hidden={phase !== "writing" || undefined}
          inert={phase !== "writing"}
          // Submit via onSubmit (not `action`) so React keeps what was typed when errors come back.
          onSubmit={(e) => {
            e.preventDefault();
            const data = new FormData(e.currentTarget);
            startTransition(() => action(data));
          }}
        >
          <span aria-hidden className="tp-letter__stamp">
            <PawIcon className="size-9" />
          </span>
          <p className="font-scrawl tp-letterform__greeting">Dear TeddyPups,</p>

          {state.message && !state.ok && (
            <div role="alert" className="tp-letterform__alert">
              <p className="font-semibold">{state.message}</p>
              {errorList.length > 0 && (
                <ul>
                  {errorList.map(([field, message]) => (
                    <li key={field} id={errId(field)}>
                      {message}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <p className="tp-letterform__line">
            my name is{" "}
            <Blank name="name" label="Your name (required)" chars={16} autoComplete="name" required minLength={2} maxLength={80} error={errors.name} errorId={errId("name")} />
            , and you can reach me on{" "}
            <Blank
              name="phone"
              label="Phone or WhatsApp number with country code (required)"
              chars={15}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              required
              placeholder="+971 50 123 4567"
              error={errors.phone}
              errorId={errId("phone")}
            />{" "}
            or by email at{" "}
            <Blank name="email" label="Email (optional)" chars={20} type="email" autoComplete="email" placeholder="optional" error={errors.email} errorId={errId("email")} />.
          </p>
          <p className="tp-letterform__line">
            I live in{" "}
            <Blank name="area" label="Your area (optional)" chars={13} autoComplete="address-level2" maxLength={80} placeholder="e.g. Dubai Marina" error={errors.area} errorId={errId("area")} />
            , and I&apos;m curious about{" "}
            <span className="tp-blank tp-blank--select">
              <label htmlFor={pickId} className="sr-only">
                Puppy you&apos;re interested in (optional)
              </label>
              <select
                id={pickId}
                name="puppyId"
                defaultValue=""
                aria-invalid={!!errors.puppyId || undefined}
                aria-describedby={errors.puppyId ? errId("puppyId") : undefined}
              >
                <option value="">any puppy (not sure yet)</option>
                {puppies.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
            </span>
            .
          </p>

          <label htmlFor={noteId} className="sr-only">
            Your message (optional)
          </label>
          <textarea
            id={noteId}
            name="message"
            rows={4}
            maxLength={2000}
            placeholder="Anything else you'd like to tell us…"
            className="tp-letterform__note"
            aria-invalid={!!errors.message || undefined}
            aria-describedby={errors.message ? errId("message") : undefined}
          />

          {/* Honeypot for bots; hidden from people and assistive tech. */}
          <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
            <label>
              Website
              <input name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
            </label>
          </div>

          <div className="tp-letterform__sign">
            <p className="font-scrawl">with love, a future puppy parent</p>
            <button type="submit" disabled={pending} className="btn btn-primary disabled:opacity-70">
              {pending ? "Sealing the envelope…" : "Post my letter"}
            </button>
          </div>
        </form>
      )}

      {(phase === "sealing" || phase === "posting") && (
        <div aria-hidden className="tp-post__scene">
          <svg viewBox="0 0 160 112" className="tp-post__envelope">
            <rect x="4" y="18" width="152" height="90" rx="6" fill="#fffdf8" stroke="#2a170e" strokeWidth="4" />
            <path d="M6 104 64 62M154 104 96 62" fill="none" stroke="#2a170e" strokeWidth="3" strokeLinecap="round" />
            <path className="tp-post__flap" d="M6 22 80 74 154 22" fill="#fbe3b4" stroke="#2a170e" strokeWidth="4" strokeLinejoin="round" />
            <circle cx="80" cy="72" r="11" fill="#a24a1a" stroke="#2a170e" strokeWidth="3" />
          </svg>
          <svg viewBox="0 0 200 260" className="tp-post__box">
            <rect x="86" y="170" width="28" height="86" fill="#5a3a28" stroke="#2a170e" strokeWidth="4" />
            <path d="M30 70a70 54 0 0 1 140 0v104H30z" fill="#c2622b" stroke="#2a170e" strokeWidth="5" strokeLinejoin="round" />
            <rect x="58" y="86" width="84" height="14" rx="7" fill="#2a170e" />
            <path d="M44 128h112" stroke="#2a170e" strokeWidth="3" strokeLinecap="round" opacity=".35" />
            <g className="tp-post__flag">
              <path d="M170 120V64" stroke="#2a170e" strokeWidth="5" strokeLinecap="round" />
              <path d="M170 64h22v16h-22" fill="#f2be6b" stroke="#2a170e" strokeWidth="4" strokeLinejoin="round" />
            </g>
          </svg>
        </div>
      )}

      {phase === "sent" && (
        <div ref={sentRef} tabIndex={-1} role="status" className="tp-post__sent">
          <svg viewBox="0 0 200 150" aria-hidden className="tp-post__box tp-post__box--sent">
            <rect x="86" y="96" width="28" height="52" fill="#5a3a28" stroke="#2a170e" strokeWidth="4" />
            <path d="M30 50a70 44 0 0 1 140 0v52H30z" fill="#c2622b" stroke="#2a170e" strokeWidth="5" strokeLinejoin="round" />
            <rect x="58" y="58" width="84" height="12" rx="6" fill="#2a170e" />
            <path d="M170 92V22" stroke="#2a170e" strokeWidth="5" strokeLinecap="round" />
            <path d="M170 22h22v16h-22" fill="#f2be6b" stroke="#2a170e" strokeWidth="4" strokeLinejoin="round" />
          </svg>
          <p className="font-plush mt-4 text-[2rem]">Message received!</p>
          <p className="mx-auto mt-2 max-w-[40ch] text-cocoa-soft">
            Thank you — our team will get back to you promptly. For the quickest reply, message us on WhatsApp.
          </p>
          <a href={site.whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp mt-6">
            WhatsApp us
          </a>
        </div>
      )}
    </div>
  );
}
