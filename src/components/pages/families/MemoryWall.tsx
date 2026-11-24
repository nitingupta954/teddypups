"use client";

import { useState, type CSSProperties } from "react";
import { PawIcon } from "@/components/icons";
import { RevealScope } from "@/components/RevealScope";
import type { Media } from "@/lib/puppies";
import { PhotoViewer } from "./PhotoViewer";
import { Polaroid } from "./Polaroid";

const SIZES = "(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 45vw";

/** Masonry wall of family polaroids; each print opens the full-screen viewer. */
export function MemoryWall({ photos }: { photos: Media[] }) {
  const [view, setView] = useState<{ index: number; direction: number } | null>(null);

  return (
    <>
      <RevealScope>
        <ul className="tp-wall" aria-label="Photos from TeddyPups families">
          {photos.map((photo, i) => (
            // Prints in the same row bounce in one after another.
            <li key={photo.id} className="tp-wall__item" data-reveal style={{ "--d": `${(i % 4) * 60}ms` } as CSSProperties}>
              <button
                type="button"
                className="tp-wall__print"
                onClick={() => setView({ index: i, direction: 1 })}
                aria-label={`Open photo ${i + 1} of ${photos.length}${photo.caption ? `: ${photo.caption}` : ""}`}
              >
                <Polaroid media={photo} order={i} sizes={SIZES} preload={i < 2} />
                <PawIcon className="tp-wall__paw" />
              </button>
            </li>
          ))}
        </ul>
      </RevealScope>
      <PhotoViewer
        photos={photos}
        index={view?.index ?? null}
        direction={view?.direction ?? 1}
        onNavigate={(index, direction) => setView({ index, direction })}
        onClose={() => setView(null)}
      />
    </>
  );
}
