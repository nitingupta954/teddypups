import type { CSSProperties, ComponentProps } from "react";

type Props = ComponentProps<"section"> & {
  /** Light scenes use cocoa ink; dark scenes switch the ink to milk. */
  tone: "light" | "dark";
  /** The page is one long sky: each scene fades from `top` to `bottom`. */
  sky: [top: string, bottom: string];
};

/** A full-width home page scene with its slice of the sky gradient. */
export function Scene({ tone, sky: [top, bottom], className = "", style, children, ...rest }: Props) {
  return (
    <section
      data-tone={tone}
      className={`tp-scene ${className}`}
      style={{ "--sky-top": top, "--sky-bottom": bottom, ...style } as CSSProperties}
      {...rest}
    >
      {children}
    </section>
  );
}
