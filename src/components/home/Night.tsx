import Link from "next/link";
import faqs from "@/data/faqs.json";
import { StarIcon } from "@/components/icons";
import { PupBuddy } from "@/components/pup/PupBuddy";
import { Scene } from "./Scene";

/** [left %, top %, width px] for the night sky's twinkling stars. */
const STARS = [
  [8, 12, 16.2],
  [22, 30, 9],
  [41, 8, 12.6],
  [57, 22, 8.1],
  [72, 6, 14.4],
  [88, 18, 10.8],
  [95, 42, 9],
  [4, 58, 10.8],
  [34, 70, 7.2],
  [63, 84, 9.9],
  [83, 66, 12.6],
] as const;

/** "Questions, answered": the first three FAQs under a starry sky. */
export function Night() {
  return (
    <Scene tone="dark" sky={["#4d2b19", "#2f1a10"]} className="tp-night" aria-labelledby="questions-title">
      <div aria-hidden className="tp-night__stars">
        {STARS.map(([left, top, width], i) => (
          <StarIcon
            key={i}
            className="tp-twinkle absolute text-honey"
            style={{ left: `${left}%`, top: `${top}%`, width, animationDelay: `${(i * 0.4).toFixed(2)}s` }}
          />
        ))}
      </div>

      <div className="tp-night__grid gutter">
        <div>
          <h2 id="questions-title" className="font-plush text-huge">
            Questions, answered
          </h2>
          <Link className="btn btn-ghost tp-night__cta" href="/faq">
            Read all questions
          </Link>
          <div className="tp-night__pup tp-stop">
            <span aria-hidden className="tp-night__wonder font-plush">
              ?
            </span>
            <PupBuddy pose="sit" />
          </div>
        </div>

        <dl className="tp-night__list">
          {faqs.slice(0, 3).map((faq) => (
            <div key={faq.id}>
              <dt className="tp-qa__q font-plush">
                <StarIcon className="tp-qa__star" />
                {faq.question}
              </dt>
              <dd className="tp-qa__a">{faq.answer}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Scene>
  );
}
