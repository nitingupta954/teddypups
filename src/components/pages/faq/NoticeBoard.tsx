"use client";

import { Fragment, useId, useMemo, useState, type CSSProperties } from "react";
import { PupBuddy } from "@/components/pup/PupBuddy";
import { RevealScope } from "@/components/RevealScope";

type Faq = { id: string; question: string; answer: string };

// Each note gets a slightly different tilt and pin colour, cycling down the board.
const TILTS = [-1.6, 1.2, -0.8, 1.8, -1.2, 0.7, -1.9, 1.4];
const PINS = ["var(--color-toffee)", "var(--color-sky-deep)", "#d9a13c", "#c45a6a"];

/** Wraps every case-insensitive match of `query` in <mark>. */
function Highlight({ text, query }: { text: string; query: string }) {
  const q = query.trim();
  if (!q) return text;
  const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // split() with a capturing group puts the matches at the odd indexes.
  return text.split(new RegExp(`(${escaped})`, "gi")).map((part, i) =>
    i % 2 ? <mark key={i}>{part}</mark> : <Fragment key={i}>{part}</Fragment>,
  );
}

/** FAQ pinned to a cork board: searchable, one note unfolded at a time. */
export function NoticeBoard({ faqs, askHref }: { faqs: Faq[]; askHref: string }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const searchId = useId();
  const needle = query.trim().toLowerCase();

  const shown = useMemo(
    () => (needle ? faqs.filter((f) => `${f.question} ${f.answer}`.toLowerCase().includes(needle)) : faqs),
    [faqs, needle],
  );

  return (
    <div className="tp-notes" data-open={openId || needle ? "" : undefined}>
      <aside className="tp-notes__side" aria-label="Find a question">
        <label htmlFor={searchId} className="font-scrawl tp-notes__label">
          sniff out a question
        </label>
        <div className="tp-notes__search">
          <svg viewBox="0 0 24 24" aria-hidden className="tp-notes__lens">
            <circle cx="10.5" cy="10.5" r="6.5" />
            <path d="m15.5 15.5 5 5" />
          </svg>
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="delivery, Korea, vaccinated…"
            autoComplete="off"
          />
        </div>
        <p className="tp-notes__count" aria-live="polite">
          {needle ? `${shown.length} ${shown.length === 1 ? "note" : "notes"} found` : `${faqs.length} notes on the board`}
        </p>
        <div className="tp-notes__teddy">
          <span aria-hidden className="tp-notes__bubble font-plush">
            <span className="tp-notes__q">?</span>
            <span className="tp-notes__a">!</span>
          </span>
          <PupBuddy pose="sit" label="Teddy, reading the notes" />
        </div>
        <a href={askHref} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp tp-notes__ask">
          Ask your own question
        </a>
      </aside>

      <RevealScope className="tp-notes__board">
        <ul className="tp-notes__list">
          {shown.map((faq, i) => {
            // While searching, every note whose answer matches unfolds so the highlight is visible.
            const open = openId === faq.id || (!!needle && faq.answer.toLowerCase().includes(needle));
            return (
              <li
                key={faq.id}
                className="tp-note"
                data-reveal
                data-unfolded={open || undefined}
                style={{ "--tilt": `${TILTS[i % TILTS.length]}deg`, "--pin": PINS[i % PINS.length], "--i": i } as CSSProperties}
              >
                <span aria-hidden className="tp-note__pin" />
                <h2 className="tp-note__q">
                  <button
                    type="button"
                    id={`q-${faq.id}`}
                    aria-expanded={open}
                    aria-controls={`a-${faq.id}`}
                    onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                  >
                    <span className="font-plush-text">
                      <Highlight text={faq.question} query={query} />
                    </span>
                    <span aria-hidden className="tp-note__chevron" />
                  </button>
                </h2>
                <div id={`a-${faq.id}`} role="region" aria-labelledby={`q-${faq.id}`} className="tp-note__answer" inert={!open}>
                  <div className="tp-note__flap">
                    <p>
                      <Highlight text={faq.answer} query={query} />
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        {shown.length === 0 && (
          <div className="tp-note tp-note--empty">
            <span aria-hidden className="tp-note__pin" />
            <p className="font-plush-text text-[1.2rem] font-bold">No note about “{query.trim()}” yet.</p>
            <p className="mt-2">
              <a href={askHref} target="_blank" rel="noopener noreferrer" className="link-ink">
                Ask us on WhatsApp
              </a>{" "}
              and we&apos;ll answer.
            </p>
          </div>
        )}
      </RevealScope>
    </div>
  );
}
