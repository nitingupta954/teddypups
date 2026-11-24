import Link from "next/link";
import { RevealScope } from "@/components/RevealScope";
import { goneHomePuppies } from "@/lib/puppies";
import { PupSketch } from "./PupSketch";

/** "Already gone home": the five most recent adoptions, below the available list. */
export function GoneStrip() {
  return (
    <RevealScope>
      <section aria-labelledby="gone-title" className="tp-gone-strip">
        <div className="gutter mx-auto flex max-w-[110rem] flex-col gap-10 md:flex-row md:items-center">
          <div className="md:w-1/3">
            <h2 id="gone-title" className="font-plush text-big">
              Already gone home
            </h2>
            <p className="mt-3 text-cocoa-soft">These puppies have found their families.</p>
            <Link className="btn btn-primary mt-6" href="/gone-home">
              See the puppies who&apos;ve gone home
            </Link>
          </div>
          <ul className="tp-gone-strip__row" aria-label="Some puppies who have gone home">
            {goneHomePuppies.slice(0, 5).map((p, i) => (
              <li key={p.id}>
                <PupSketch pup={p} index={i} small />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </RevealScope>
  );
}
