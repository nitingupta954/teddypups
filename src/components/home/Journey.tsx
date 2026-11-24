import steps from "@/data/journey-steps.json";
import { PupBuddy } from "@/components/pup/PupBuddy";
import { availablePuppies, breedsIn } from "@/lib/puppies";
import { site } from "@/lib/site";
import { JourneyChat } from "./JourneyChat";
import { Scene } from "./Scene";

/** "Your puppy journey": three steps told as a WhatsApp chat with TeddyPups. */
export function Journey() {
  return (
    <Scene tone="light" sky={["#f7d18d", "#f0b866"]} className="tp-chat" aria-labelledby="journey-title">
      <JourneyChat
        steps={steps}
        breeds={breedsIn(availablePuppies).slice(0, 6)}
        business={site.name}
        whatsappHref={site.whatsappHref}
        teddy={
          <div className="tp-chat__teddy tp-stop">
            <PupBuddy pose="sit" />
          </div>
        }
      />
    </Scene>
  );
}
