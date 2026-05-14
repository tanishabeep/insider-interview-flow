import * as React from "react";

/**
 * Hand-drawn SVG illustrations.
 * Slightly imperfect paths, organic feel, no perfect geometry.
 * All accept className + size; default stroke #0D0D1A.
 */

type IllProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
  stroke?: string;
};

function base({ size = 40, stroke = "#0D0D1A", className, style, ...rest }: IllProps) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 48 48",
    fill: "none",
    stroke,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    className,
    style,
    ...rest,
  };
}

/* 1. Quiz / paper + pencil */
export function IllQuiz(p: IllProps) {
  const s = p.stroke ?? "#0D0D1A";
  return (
    <svg {...base(p)}>
      {/* paper with curl */}
      <path d="M11 9 C 12 8.4, 28 8.6, 32 9 L 32 36 C 32 38, 30 39, 28 38.6 L 13 38 C 11.5 38, 10.6 37, 10.8 35 Z"
        strokeWidth="2" />
      <path d="M28 38.6 C 29 36.6, 30.5 35.6, 32 36" strokeWidth="1.6" />
      {/* lines */}
      <path d="M14 16 C 18 15.7, 24 15.9, 28.5 15.8" strokeWidth="1.6" />
      <path d="M14 21 C 19 20.8, 25 21, 29 20.9" strokeWidth="1.6" />
      <path d="M14 26 C 17 25.8, 22 26, 25 25.9" strokeWidth="1.6" />
      {/* pencil */}
      <path d="M30 6 L 40 12" strokeWidth="2" />
      <path d="M29.4 6.6 L 31.6 5.4 L 41 11 L 39.6 13" strokeWidth="1.8" />
      <path d="M40 12 L 41.5 13.2" strokeWidth="2" />
      {/* spark at tip */}
      <path d="M28.5 7.4 L 27.6 8.2 M28 6.4 L 28.4 7.4 M27.6 6.6 L 28.2 6.4" strokeWidth="1.4" stroke={s} />
    </svg>
  );
}

/* 2. Interview / two speech bubbles + arrow */
export function IllInterview(p: IllProps) {
  return (
    <svg {...base(p)}>
      <path d="M6 12 C 6 10, 7 9, 9 9 L 18 9 C 20 9, 21 10, 21 12 L 21 18 C 21 20, 20 21, 18 21 L 12 21 L 9 24 L 9.5 21 C 7 20.6, 6 20, 6 18 Z" strokeWidth="2" />
      <circle cx="13.5" cy="15" r="0.9" fill="currentColor" />
      <path d="M22 17 C 26 14, 30 14, 34 16" strokeWidth="1.6" />
      <path d="M33.5 14 L 34.4 16.2 L 32 16.6" strokeWidth="1.6" />
      <path d="M27 23 C 27 20.8, 28.4 19.6, 30.6 19.6 L 39 19.6 C 41 19.6, 42 21, 42 23 L 42 30 C 42 32, 41 33, 39 33 L 33 33 L 30 36 L 30.5 33 C 28 32.6, 27 32, 27 30 Z" strokeWidth="2" />
      <circle cx="32" cy="26.4" r="0.9" fill="currentColor" />
      <circle cx="35" cy="26.4" r="0.9" fill="currentColor" />
      <circle cx="38" cy="26.4" r="0.9" fill="currentColor" />
    </svg>
  );
}

/* 3. Profile / face with spotlight lines */
export function IllProfile(p: IllProps) {
  return (
    <svg {...base(p)}>
      <path d="M16 18 C 16 12.6, 20 9.4, 24.2 9.6 C 28.4 9.6, 32 13, 32 18 C 32 22.6, 28.6 26, 24 26 C 19.4 26, 16 22.6, 16 18 Z" strokeWidth="2" />
      <circle cx="20.6" cy="17.4" r="0.9" fill="currentColor" />
      <circle cx="27.2" cy="17.4" r="0.9" fill="currentColor" />
      <path d="M20.8 21 C 22.4 22.6, 25.6 22.6, 27.2 21" strokeWidth="1.6" />
      <path d="M14 32 C 16 28, 32 28, 34.2 32 L 34 40" strokeWidth="2" />
      {/* spotlight rays */}
      <path d="M9 12 L 13 14" strokeWidth="1.4" />
      <path d="M7 17 L 12 18" strokeWidth="1.4" />
      <path d="M9 22 L 13 22" strokeWidth="1.4" />
      <path d="M39 12 L 35 14" strokeWidth="1.4" />
      <path d="M41 17 L 36 18" strokeWidth="1.4" />
      <path d="M39 22 L 35 22" strokeWidth="1.4" />
    </svg>
  );
}

/* 4. Globe / current affairs */
export function IllGlobe(p: IllProps) {
  return (
    <svg {...base(p)}>
      <path d="M9 24 C 9 16, 15.6 9, 24 9 C 32.4 9, 39 16, 39 24 C 39 32, 32.6 39, 24 39 C 15.4 39, 9 32, 9 24 Z" strokeWidth="2" />
      <path d="M10 19 C 18 17, 30 17, 38 19" strokeWidth="1.4" />
      <path d="M10 28 C 18 30, 30 30, 38 28" strokeWidth="1.4" />
      <path d="M24 9 C 19 14, 19 33, 24 39" strokeWidth="1.4" />
      <path d="M40 14 C 42 15, 43.4 17, 44 19" strokeWidth="1.4" />
      <path d="M41 11 C 44 13, 45.6 16, 46 19" strokeWidth="1.4" />
      <path d="M42 8 C 45.6 11, 47 14, 47.6 19" strokeWidth="1.4" />
    </svg>
  );
}

/* 5. Books / archive */
export function IllBooks(p: IllProps) {
  return (
    <svg {...base(p)}>
      <path d="M9 13 L 16.4 12.6 L 17 38 L 9.4 38.6 Z" strokeWidth="2" />
      <path d="M10 17 L 16 16.6" strokeWidth="1.4" />
      <path d="M18 11 L 25.6 10.6 L 26 38 L 18.4 38.4 Z" strokeWidth="2" />
      <path d="M19 15 L 25 14.6" strokeWidth="1.4" />
      {/* middle bookmark */}
      <path d="M21 11 L 21 16 L 22.4 14.6 L 23.6 16 L 23.6 11" strokeWidth="1.4" />
      <path d="M27 14 L 35 13.6 L 35 38 L 27.4 38.4 Z" strokeWidth="2" />
      <path d="M28 18 L 34 17.6" strokeWidth="1.4" />
    </svg>
  );
}

/* 6. Analytics / bars + arrow */
export function IllAnalytics(p: IllProps) {
  return (
    <svg {...base(p)}>
      <path d="M8 36 L 14 36 L 14 28 L 8 28 Z" strokeWidth="2" />
      <path d="M16 36 L 22 36 L 22 22 L 16 22 Z" strokeWidth="2" />
      <path d="M24 36 L 30 36 L 30 14 L 24 14 Z" strokeWidth="2" />
      <path d="M27 11 C 30 7, 36 7, 40 9" strokeWidth="1.8" />
      <path d="M38 6.4 L 41 9 L 38.4 11.6" strokeWidth="1.8" />
    </svg>
  );
}

/* 7. Flame / streak — leans right slightly */
export function IllFlame({ stroke = "#0D0D1A", ...p }: IllProps) {
  const fill = "#DDF34466";
  return (
    <svg {...base({ ...p, stroke })}>
      <path d="M22 8 C 26 12, 30 14, 30 20 C 30 22, 28.6 23, 27 22.6 C 28 25, 32 26, 32 31 C 32 36, 27.6 40, 22 40 C 16.4 40, 12 36, 12 30.4 C 12 25, 16 22, 17 18 C 17.4 16, 18 14, 22 8 Z"
        strokeWidth="2" fill={fill} />
      <path d="M22 18 C 24 21, 25 24, 23.6 27" strokeWidth="1.4" />
      <path d="M19 24 C 19 27, 20 29, 22 30" strokeWidth="1.4" />
      <path d="M9 41 L 36 41" strokeWidth="1.6" />
    </svg>
  );
}

/* 8. Shield / risk */
export function IllShield({ stroke = "#4849F8", ...p }: IllProps) {
  return (
    <svg {...base({ ...p, stroke })}>
      <path d="M24 7 C 28 9, 33 10, 38 10 C 38 22, 36 32, 24 41 C 12 32, 10 22, 10 10 C 15 10, 20 9, 24 7 Z" strokeWidth="2" />
      <path d="M24 17 L 24 26" strokeWidth="2.4" />
      <circle cx="24" cy="30" r="1.2" fill={stroke} stroke="none" />
    </svg>
  );
}

/* 9. IIM building / panel intel */
export function IllBuilding(p: IllProps) {
  return (
    <svg {...base(p)}>
      <path d="M8 16 L 24 8 L 40 16 L 38.4 17.4 L 9.6 17.4 Z" strokeWidth="2" />
      <path d="M11 17 L 11 36 M19 17 L 19 36 M28 17 L 28 36 M36 17 L 36 36" strokeWidth="1.8" />
      <path d="M7 38 L 41 38" strokeWidth="2" />
      {/* magnifying glass */}
      <circle cx="34" cy="34" r="5" strokeWidth="1.8" />
      <path d="M37.6 37.6 L 41.6 41.6" strokeWidth="2" />
    </svg>
  );
}

/* 10. Brain / memory */
export function IllBrain(p: IllProps) {
  return (
    <svg {...base(p)}>
      <path d="M22 10 C 18 9, 14 11, 13.4 15 C 10 16, 9 20, 12 23 C 10 25, 11 30, 14.6 31 C 14.6 35, 18 38, 22.4 36.6 L 22 10 Z" strokeWidth="2" />
      <path d="M26 10 C 30 9, 34 11, 34.6 15 C 38 16, 39 20, 36 23 C 38 25, 37 30, 33.4 31 C 33.4 35, 30 38, 25.6 36.6 L 26 10 Z" strokeWidth="2" />
      <path d="M22 16 L 19 19 L 22 21 L 19 24" strokeWidth="1.6" />
      <path d="M26 16 L 29 19 L 26 21 L 29 24" strokeWidth="1.6" />
      <path d="M20 30 C 18 28, 18 26, 20 24" strokeWidth="1.4" />
      <path d="M18 26 L 19 24.4 L 20 26" strokeWidth="1.4" />
      <path d="M28 30 C 30 28, 30 26, 28 24" strokeWidth="1.4" />
      <path d="M30 26 L 29 24.4 L 28 26" strokeWidth="1.4" />
    </svg>
  );
}

/* 11. Calendar + clock / day before */
export function IllCalendar(p: IllProps) {
  return (
    <svg {...base(p)}>
      <path d="M10 12 L 36 12 L 36 36 L 10 36 Z" strokeWidth="2" />
      <circle cx="16" cy="12" r="1.6" fill="currentColor" />
      <circle cx="30" cy="12" r="1.6" fill="currentColor" />
      <path d="M11 18 L 35 18" strokeWidth="1.4" />
      <path d="M22 22 L 22 32 M22 22 L 19 24" strokeWidth="2.2" />
      {/* clock */}
      <circle cx="36" cy="36" r="6" strokeWidth="1.8" fill="#FDFEFF" />
      <path d="M36 32 L 36 36 L 38.6 37" strokeWidth="1.6" />
    </svg>
  );
}

/* 12. Consistency / timeline */
export function IllConsistency(p: IllProps) {
  return (
    <svg {...base(p)}>
      <path d="M6 30 C 18 28, 30 32, 42 30" strokeWidth="1.8" />
      <circle cx="12" cy="30" r="2" fill="currentColor" />
      <circle cx="24" cy="31" r="2" fill="currentColor" />
      <circle cx="36" cy="30" r="2" fill="currentColor" />
      <path d="M9 24 L 11 19 L 13 24 L 15 19" strokeWidth="1.6" />
      <path d="M21 19 L 23 24 L 25 19 L 27 24" strokeWidth="1.6" />
      <path d="M36 26 L 36 14" strokeWidth="1.8" />
      <circle cx="36" cy="12" r="2" strokeWidth="1.6" />
    </svg>
  );
}

/* 13. Target / attack map */
export function IllTarget(p: IllProps) {
  return (
    <svg {...base(p)}>
      <circle cx="22" cy="26" r="14" strokeWidth="1.8" />
      <circle cx="22" cy="26" r="9" strokeWidth="1.6" />
      <circle cx="22" cy="26" r="4" strokeWidth="1.6" fill="#4849F820" />
      <path d="M22 26 C 26 22, 32 16, 38 10" strokeWidth="2" />
      <path d="M37 14 L 38.4 9.6 L 34 11" strokeWidth="1.8" />
    </svg>
  );
}

/* Decorative — large floating curved arrow (scroll-down) */
export function IllScrollArrow({ size = 80, stroke = "#4849F8", className, style, ...rest }: IllProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 80" fill="none" stroke={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className} style={style} {...rest}>
      <path d="M30 6 C 38 18, 22 36, 30 56" strokeWidth="2.4" />
      <path d="M22 50 L 30 60 L 38 50" strokeWidth="2.4" />
    </svg>
  );
}

/* Decorative — looser book stack */
export function IllBookStack({ size = 64, stroke = "#DDF344", className, style, ...rest }: IllProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className} style={style} {...rest}>
      <path d="M10 22 L 50 20 L 51 30 L 11 32 Z" strokeWidth="2.2" />
      <path d="M14 32 L 48 30 L 49 41 L 15 43 Z" strokeWidth="2.2" />
      <path d="M9 43 L 53 42 L 54 53 L 10 54 Z" strokeWidth="2.2" />
      <path d="M16 24 L 22 23.6" strokeWidth="1.4" />
      <path d="M18 35 L 24 34.6" strokeWidth="1.4" />
      <path d="M14 47 L 22 46.6" strokeWidth="1.4" />
    </svg>
  );
}

/* Decorative — scattered hand-drawn star cluster */
export function IllStarCluster({ size = 90, stroke = "#4849F8", className, style, ...rest }: IllProps) {
  const Star = ({ cx, cy, r, sw }: { cx: number; cy: number; r: number; sw: number }) => (
    <path
      d={`M${cx} ${cy - r} L${cx + r * 0.32} ${cy - r * 0.32} L${cx + r} ${cy} L${cx + r * 0.32} ${cy + r * 0.32} L${cx} ${cy + r} L${cx - r * 0.32} ${cy + r * 0.32} L${cx - r} ${cy} L${cx - r * 0.32} ${cy - r * 0.32} Z`}
      strokeWidth={sw}
    />
  );
  return (
    <svg width={size} height={size} viewBox="0 0 90 90" fill="none" stroke={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className} style={style} {...rest}>
      <Star cx={20} cy={26} r={9} sw={1.8} />
      <Star cx={56} cy={18} r={5} sw={1.5} />
      <Star cx={68} cy={48} r={11} sw={2} />
      <Star cx={32} cy={62} r={6} sw={1.6} />
    </svg>
  );
}
