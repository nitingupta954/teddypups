"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { PuppyImage } from "@/components/PuppyImage";
import type { Media } from "@/lib/puppies";
import { REDUCED_MOTION, useMedia } from "./useMedia";

export type Friend = { id: string; slug: string; displayName: string; breed: string; cover: Media };

const SEATS = 6;
/** Pause between swaps, varied so the lineup never feels mechanical. */
const BEATS = [1900, 2500, 1700, 2300, 2000, 2800, 1800];
/** The entrance peek finishes at about 0.62s + 5 × 90ms + 0.75s. */
const AFTER_ENTRANCE = 2000;

type SeatState = "duck" | "pop" | undefined;

function shuffle<T>(items: T[]) {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Six arched seats along the hero quilt. Every couple of seconds one pup ducks
 * behind the quilt and a different available pup pops up in its place, showing
 * its name tag. Hovering or focusing a seat shows its tag too.
 */
export function HeroLineup({ friends }: { friends: Friend[] }) {
  const count = Math.min(SEATS, friends.length);
  const canSwap = friends.length > count;
  /** Index into `friends` for each seat. */
  const [seated, setSeated] = useState(() => friends.slice(0, count).map((_, i) => i));
  const [seatState, setSeatState] = useState<Record<number, SeatState>>({});
  const [popped, setPopped] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  /** The pup that comes on next, rendered off-screen so its photo is loaded in time. */
  const [onDeck, setOnDeck] = useState<number | null>(canSwap ? count : null);
  const reduced = useMedia(REDUCED_MOTION);
  const list = useRef<HTMLUListElement>(null);
  const seatedRef = useRef(seated);

  useEffect(() => {
    seatedRef.current = seated;
  }, [seated]);

  useEffect(() => {
    const ul = list.current;
    if (!ul || reduced || !canSwap) return;

    let visible = true;
    let quietUntil = 0;
    let beat = 0;
    let lastSeat = -1;
    let queue = shuffle(friends.map((_, i) => i).filter((i) => !seatedRef.current.includes(i)));
    const timers: number[] = [];
    const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(fn, ms));

    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting), { threshold: 0.35 });
    io.observe(ul);
    // Hold still while the visitor is scrolling or pointing at a pup.
    const hush = () => (quietUntil = performance.now() + 1200);
    addEventListener("scroll", hush, { passive: true });
    addEventListener("pointerdown", hush, { passive: true });
    ul.addEventListener("pointerover", hush, { passive: true });

    const swap = () => {
      if (document.hidden || !visible || performance.now() < quietUntil) return later(swap, 900);
      if (!queue.length) queue = shuffle(friends.map((_, i) => i).filter((i) => !seatedRef.current.includes(i)));

      let seat = Math.floor(Math.random() * count);
      if (seat === lastSeat) seat = (seat + 1) % count;
      lastSeat = seat;
      const incoming = queue.shift()!;

      setSeatState((s) => ({ ...s, [seat]: "duck" }));
      later(() => {
        queue.push(seatedRef.current[seat]);
        setSeated((s) => s.map((f, i) => (i === seat ? incoming : f)));
        setOnDeck(queue[0] ?? null);
        setSeatState((s) => ({ ...s, [seat]: "pop" }));
        setPopped(seat);
        later(() => setPopped((p) => (p === seat ? null : p)), 1800);
        later(() => setSeatState((s) => ({ ...s, [seat]: undefined })), 700);
      }, 360);
      later(swap, BEATS[beat++ % BEATS.length]);
    };
    later(swap, AFTER_ENTRANCE);

    return () => {
      timers.forEach(clearTimeout);
      io.disconnect();
      removeEventListener("scroll", hush);
      removeEventListener("pointerdown", hush);
      ul.removeEventListener("pointerover", hush);
    };
  }, [friends, count, canSwap, reduced]);

  const unhover = (seat: number) => () => setHovered((h) => (h === seat ? null : h));

  return (
    <>
      <ul ref={list} className="tp-lineup" aria-label="Some of the puppies in our showroom">
        {seated.map((f, seat) => {
          const pup = friends[f];
          return (
            <li key={seat} className="tp-lineup__seat">
              <Link
                href={`/puppies/${pup.slug}`}
                className="tp-lineup__pup"
                data-state={seatState[seat]}
                aria-label={
                  pup.displayName === pup.breed ? `Meet our ${pup.breed}` : `Meet ${pup.displayName}, ${pup.breed}`
                }
                onPointerEnter={() => setHovered(seat)}
                onPointerLeave={unhover(seat)}
                onFocus={() => setHovered(seat)}
                onBlur={unhover(seat)}
              >
                <span className="tp-lineup__photo">
                  <PuppyImage key={pup.id} media={pup.cover} fill sizes="11rem" loading="eager" preload={seat < 2} />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Name tags live in a twin list stacked above the quilt (each tilted seat is its own stacking context). */}
      <ul aria-hidden className="tp-lineup tp-lineup--tags">
        {seated.map((f, seat) => (
          <li key={seat} className="tp-lineup__seat">
            <span className="tp-lineup__ghost" data-tag={seat === popped || seat === hovered ? "show" : undefined}>
              <span className="tp-lineup__name font-scrawl">{friends[f].displayName}</span>
            </span>
          </li>
        ))}
      </ul>

      {onDeck !== null && (
        <span aria-hidden className="tp-lineup__wings">
          <PuppyImage media={friends[onDeck].cover} alt="" fill sizes="11rem" loading="eager" />
        </span>
      )}
    </>
  );
}
