import type { SVGProps } from "react";

/** Line-drawn Downtown Dubai skyline (Burj Khalifa in the middle). */
export function Skyline(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 300 120" aria-hidden {...props}>
      <path
        d="M4 116h292M20 116V78h16v38M44 116V60h18v56M70 116V84h12v32M150 116V36l4-6v-14l3-4 3 4v14l4 6v80M118 116V70l12-8v54M174 116V64l14 8v44M200 116V82h18v34M226 116V56h14v60M248 116V88h22v28"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const line = { fill: "none", stroke: "currentColor", strokeWidth: 3, strokeLinecap: "round", strokeLinejoin: "round" } as const;

/** 64×64 outline icons shared by the passport stamps and "why choose us" list. */
export const BadgeIcons = {
  heartbeat: (
    <>
      <path d="M32 54C16 43 8 34 8 24c0-7 5.4-12 12-12 5 0 9 3 12 7 3-4 7-7 12-7 6.6 0 12 5 12 12 0 10-8 19-24 30z" {...line} />
      <path d="M22 30h7l3-7 4 13 3-6h7" {...line} />
    </>
  ),
  plane: (
    <>
      <path d="M6 36l22-3 12-17h6l-6 17 12-1 6-7h3l-2 10 2 10h-3l-6-7-12-1 6 17h-6L28 37 6 36z" {...line} />
      <path d="M8 50c10 4 20 4 30 0" {...line} strokeDasharray="2 7" />
    </>
  ),
  chat: (
    <>
      <path d="M10 14h44v28H30l-12 10v-10h-8z" {...line} />
      <path d="M22 28h0M32 28h0M42 28h0" {...line} strokeWidth={5} />
    </>
  ),
};

export type BadgeIcon = keyof typeof BadgeIcons;
