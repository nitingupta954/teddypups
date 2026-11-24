import { POSES, type Pose } from "./poses";

type Props = {
  pose?: Pose;
  /** Accessible description; omit for decorative use. */
  label?: string;
  className?: string;
  /** Idle animation: breathing, blinking and an ear twitch. */
  idle?: boolean;
};

/** Teddy, the TeddyPups mascot. Server component; the SVG is static, idle motion is pure CSS. */
export function PupBuddy({ pose = "peek", label, className = "", idle = true }: Props) {
  const { viewBox, svg } = POSES[pose];
  return (
    <div className={`pup-buddy ${className}`} data-idle={idle || undefined}>
      <svg
        viewBox={viewBox}
        style={{ overflow: "visible" }}
        role={label ? "img" : undefined}
        aria-label={label}
        aria-hidden={label ? undefined : true}
        focusable="false"
        // Trusted, build-time markup from ./poses (no user input).
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </div>
  );
}
