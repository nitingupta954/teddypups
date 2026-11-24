import Link from "next/link";
import { PupBuddy } from "@/components/pup/PupBuddy";
import { availablePuppies } from "@/lib/puppies";
import { Door } from "./Door";
import { MeetHall } from "./MeetHall";

/** "Meet the pups": one door per available pup, then a "Meet them all" door. */
export function Meet() {
  return (
    <MeetHall
      teddy={
        <div className="tp-meet__teddy tp-stop">
          {/* Sits beside the grid; trots on the spot while the doors file past (pinned). */}
          <PupBuddy pose="sit" className="tp-meet__teddy-sit" />
          <PupBuddy pose="play" className="tp-meet__teddy-walk" />
        </div>
      }
      head={
        <header className="tp-meet__head gutter">
          <div>
            <h2 id="meet-title" className="font-plush text-huge">
              Meet the pups
            </h2>
            <p className="text-lede mt-3 max-w-[44ch] text-[var(--ink-soft)]">
              Real puppies, real photos, looking for their families right now.
            </p>
          </div>
          <Link className="btn btn-primary shrink-0" href="/puppies">
            See all available puppies
          </Link>
        </header>
      }
    >
      {availablePuppies.map((pup, i) => (
        <Door key={pup.id} pup={pup} index={i} />
      ))}
      <li className="tp-door tp-door--all">
        <Link href="/puppies" className="tp-door__link">
          <span className="tp-door__frame tp-door__frame--all">
            <span className="tp-door__all font-plush">Meet them all</span>
          </span>
        </Link>
      </li>
    </MeetHall>
  );
}
