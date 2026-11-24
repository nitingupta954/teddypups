"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { PAW_PATH } from "@/components/icons";
import { PuppyImage } from "@/components/PuppyImage";
import { showroomClip, showroomPhotos } from "./showroom";
import { DESKTOP, REDUCED_MOTION, useMedia } from "./useMedia";

type Step = { title: string; text: string };

type Props = {
  steps: Step[];
  breeds: { slug: string; name: string }[];
  business: string;
  whatsappHref: string;
  teddy: ReactNode;
};

const GREETING = "Hi TeddyPups! I'd love to know more about your puppies.";
/** How long TeddyPups is "typing…" before each reply lands. */
const TYPING_MS = 750;

/**
 * Desktop: the phone sticks beside the steps; as each step scrolls past the
 * reading line, TeddyPups types and its reply for that step appears.
 * Mobile and reduced motion: every step is done and the whole chat is shown.
 */
export function JourneyChat({ steps, breeds, business, whatsappHref, teddy }: Props) {
  const desktop = useMedia(DESKTOP);
  const reduced = useMedia(REDUCED_MOTION);
  const story = desktop && !reduced;
  const [reached, setReached] = useState(-1);
  const [typing, setTyping] = useState(false);
  const list = useRef<HTMLOListElement>(null);
  const active = story ? reached : steps.length - 1;

  useEffect(() => {
    if (!story || !list.current) return;
    const items = Array.from(list.current.children);
    let current = -1;
    let timer: number | undefined;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const step = items.indexOf(entry.target);
          if (step > current) {
            setTyping(true);
            clearTimeout(timer);
            timer = window.setTimeout(() => setTyping(false), TYPING_MS);
          }
          current = step;
          setReached(step);
        }
      },
      // A thin reading line ~30% down the viewport.
      { rootMargin: "-28% 0px -62% 0px" },
    );
    items.forEach((item) => io.observe(item));
    return () => {
      io.disconnect();
      clearTimeout(timer);
    };
  }, [story]);

  const shown = (i: number) => i < active || (i === active && !typing);

  return (
    <div className="tp-chat__grid gutter">
      <div className="tp-chat__story">
        <h2 id="journey-title" className="font-plush text-huge">
          Your puppy journey
        </h2>
        <p className="text-lede mt-5 max-w-[42ch] text-[var(--ink-soft)]">
          A premium, step-by-step concierge experience. We make adoption simple, secure, and purely joyful.
        </p>
        <ol ref={list} className="tp-chat__steps">
          {steps.map((step, i) => (
            <li
              key={step.title}
              className="tp-chat__step"
              data-active={i === active || undefined}
              data-done={i < active || undefined}
            >
              <span className="tp-chat__num font-plush" aria-hidden>
                {i + 1}
              </span>
              <h3 className="tp-chat__title font-plush">{step.title}</h3>
              <p className="tp-chat__text">{step.text}</p>
            </li>
          ))}
        </ol>
        <Link className="btn btn-ghost tp-chat__cta" href="/how-it-works">
          How it works
        </Link>
      </div>

      <div className="tp-chat__side">
        <div className="tp-phone" role="group" aria-label={`A WhatsApp conversation with ${business}`}>
          <div className="tp-phone__bar">
            <Image src="/brand/logo.png" alt="" width={40} height={40} className="tp-phone__avatar" />
            <span>
              <span className="tp-phone__name">{business}</span>
              <span className="tp-phone__status">{typing ? "typing…" : "online"}</span>
            </span>
          </div>

          <div className="tp-phone__screen">
            <p className="tp-msg tp-msg--me">{GREETING}</p>

            {steps.map((step, i) => (
              <div key={step.title} className="tp-msg-group" data-show={shown(i)}>
                {i === 0 && (
                  <div className="tp-msg tp-msg--them">
                    <p>{step.text}</p>
                    <ul className="tp-chips" aria-label="Breeds we have now">
                      {breeds.map((b) => (
                        <li key={b.slug}>
                          <Link href={`/puppies?breed=${b.slug}`}>{b.name}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {i === 1 && (
                  <>
                    <div className="tp-msg tp-msg--them tp-msg--media">
                      <div className="tp-snaps">
                        {showroomPhotos.map((m) => (
                          <span key={m.id} className="tp-snaps__one">
                            <PuppyImage media={m} fill sizes="9rem" />
                          </span>
                        ))}
                      </div>
                    </div>
                    <ClipBubble />
                    <p className="tp-msg tp-msg--them">{step.text}</p>
                  </>
                )}
                {i === 2 && (
                  <div className="tp-msg tp-msg--them">
                    <p>{step.text}</p>
                    <HomeRoute />
                  </div>
                )}
                {i > 2 && <p className="tp-msg tp-msg--them">{step.text}</p>}
              </div>
            ))}

            <p className="tp-typing" data-show={typing} aria-hidden>
              <span />
              <span />
              <span />
            </p>
          </div>

          <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="tp-phone__compose">
            <span>Say hello on WhatsApp</span>
            <svg viewBox="0 0 24 24" aria-hidden>
              <path d="M3 20l18-8L3 4v6l12 2-12 2z" />
            </svg>
          </a>
        </div>
        {teddy}
      </div>
    </div>
  );
}

/** A video message with its own play/pause button. */
function ClipBubble() {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused)
      v.play().then(
        () => setPlaying(true),
        () => {},
      );
    else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <div className="tp-msg tp-msg--them tp-msg--media">
      <div className="tp-clip">
        <video
          ref={video}
          src={showroomClip.src}
          poster={showroomClip.poster}
          muted
          loop
          playsInline
          preload="none"
          aria-label={showroomClip.label}
        />
        <button
          type="button"
          className="tp-clip__play"
          onClick={toggle}
          aria-pressed={playing}
          aria-label={playing ? "Pause video" : "Play video"}
        >
          <svg viewBox="0 0 24 24" aria-hidden>
            <path d={playing ? "M7 5h3v14H7zM14 5h3v14h-3z" : "M8 5v14l11-7z"} />
          </svg>
        </button>
      </div>
    </div>
  );
}

/** Dotted paw trail from a pin to a little house with a heart. */
function HomeRoute() {
  return (
    <svg viewBox="0 0 220 70" className="tp-route" aria-hidden>
      <path d="M14 52 C 60 6, 120 70, 170 28" className="tp-route__line" />
      <circle cx="14" cy="52" r="5" className="tp-route__dot" />
      <path d="M164 32 l12 -12 l12 12 v14 h-24 z" className="tp-route__home" />
      <path d="M176 42 c-2-3-7-2-6 2c1 3 6 5 6 5s5-2 6-5c1-4-4-5-6-2z" className="tp-route__heart" />
      <path d={PAW_PATH} transform="translate(70 22) scale(.3) rotate(70 32 32)" className="tp-route__paw" />
      <path d={PAW_PATH} transform="translate(104 38) scale(.3) rotate(100 32 32)" className="tp-route__paw" />
    </svg>
  );
}
