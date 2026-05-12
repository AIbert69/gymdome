// Custom icons ported from the Claude Design prototype (gymdome/project/app.jsx).
// Keep these in one file so the visual language stays consistent across screens.

type IconProps = {
  size?: number;
  color?: string;
  className?: string;
};

const RED = "#FF1F2D";
const WHITE = "#FFFFFF";
const DIM = "#7A7A7A";

export function BellIcon({ size = 22, color = WHITE, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M6 8a6 6 0 1 1 12 0c0 4 1.5 5.5 2.5 6.5H3.5C4.5 13.5 6 12 6 8Z"
        stroke={color}
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M10 18a2 2 0 0 0 4 0"
        stroke={color}
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CrossedDumbbellsIcon({
  size = 30,
  color = RED,
  className,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
    >
      <g transform="rotate(45 16 16)">
        <rect x="3" y="13" width="3.2" height="6" rx="1" fill={color} />
        <rect x="6.5" y="11" width="2.6" height="10" rx="1" fill={color} />
        <rect x="9.2" y="14.5" width="13.6" height="3" rx="0.6" fill={color} />
        <rect x="22.9" y="11" width="2.6" height="10" rx="1" fill={color} />
        <rect x="25.8" y="13" width="3.2" height="6" rx="1" fill={color} />
      </g>
      <g transform="rotate(-45 16 16)">
        <rect x="3" y="13" width="3.2" height="6" rx="1" fill={color} />
        <rect x="6.5" y="11" width="2.6" height="10" rx="1" fill={color} />
        <rect x="9.2" y="14.5" width="13.6" height="3" rx="0.6" fill={color} />
        <rect x="22.9" y="11" width="2.6" height="10" rx="1" fill={color} />
        <rect x="25.8" y="13" width="3.2" height="6" rx="1" fill={color} />
      </g>
    </svg>
  );
}

export function TargetIcon({ size = 30, color = RED, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
    >
      <circle cx="16" cy="16" r="11" stroke={color} strokeWidth="2" />
      <circle cx="16" cy="16" r="6" stroke={color} strokeWidth="2" />
      <circle cx="16" cy="16" r="2" fill={color} />
    </svg>
  );
}

export function StopwatchIcon({
  size = 30,
  color = RED,
  className,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
    >
      <rect x="13" y="2" width="6" height="3" rx="1" stroke={color} strokeWidth="2" />
      <line x1="16" y1="5" x2="16" y2="8" stroke={color} strokeWidth="2" />
      <line
        x1="26"
        y1="6"
        x2="28"
        y2="8"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="16" cy="19" r="10" stroke={color} strokeWidth="2" />
      <path
        d="M16 13.5V19h4"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function TrendUpIcon({
  size = 26,
  color = RED,
  className,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 26 26"
      fill="none"
      className={className}
    >
      <path
        d="M4 18l5-6 4 3 6-9"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 6h5v5"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function FlameIcon({ size = 22, color = RED, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      className={className}
    >
      <path d="M12 2c.7 3-2 4.5-2 7.5 0 1.6 1 2.5 2 2.5s2-1 2-2c0-.7-.4-1.5-.4-1.5 2 1 4 3.5 4 6.5a6 6 0 1 1-12 0c0-3.5 2.5-5 3.5-7C9.4 6 10 4 12 2Z" />
    </svg>
  );
}

export function BicepIcon({ size = 26, color = RED, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 26 26"
      fill="none"
      className={className}
    >
      <path
        d="M3 16c0-2 1-3 3-3 3 0 4 2 7 2s5-1.5 5-4-1.5-3-3-3-2 1-2 2c-1 1-3 1-4 0-2-1-2-3 1-4 5-1 9 1 9 5 0 5-4 8-9 8-4 0-7-1-7-3Z"
        stroke={color}
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CrosshairIcon({
  size = 26,
  color = RED,
  className,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 26 26"
      fill="none"
      className={className}
    >
      <circle cx="13" cy="13" r="9" stroke={color} strokeWidth="1.8" />
      <circle cx="13" cy="13" r="2.2" fill={color} />
      <line x1="13" y1="1" x2="13" y2="5" stroke={color} strokeWidth="1.8" />
      <line x1="13" y1="21" x2="13" y2="25" stroke={color} strokeWidth="1.8" />
      <line x1="1" y1="13" x2="5" y2="13" stroke={color} strokeWidth="1.8" />
      <line x1="21" y1="13" x2="25" y2="13" stroke={color} strokeWidth="1.8" />
    </svg>
  );
}

export function ChevronRightIcon({
  size = 16,
  color = RED,
  className,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      className={className}
    >
      <path
        d="M6 3l5 5-5 5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BookmarkIcon({
  size = 22,
  color = RED,
  className,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M6 3h12v18l-6-4-6 4V3Z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M12 8l.8 1.6 1.7.2-1.3 1.2.3 1.7-1.5-.8-1.5.8.3-1.7-1.3-1.2 1.7-.2L12 8Z"
        fill={color}
      />
    </svg>
  );
}

export function PlusIcon({ size = 20, color = RED, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      className={className}
    >
      <line
        x1="10"
        y1="3"
        x2="10"
        y2="17"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <line
        x1="3"
        y1="10"
        x2="17"
        y2="10"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function DotsIcon({ size = 20, color = DIM, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      className={className}
    >
      <circle cx="4" cy="10" r="1.5" fill={color} />
      <circle cx="10" cy="10" r="1.5" fill={color} />
      <circle cx="16" cy="10" r="1.5" fill={color} />
    </svg>
  );
}

/* ─── Bottom tab icons ─── */

export function TabDumbbellIcon({
  size = 22,
  color = DIM,
  active = false,
  className,
}: IconProps & { active?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <rect
        x="2"
        y="9"
        width="2.4"
        height="6"
        rx="0.8"
        fill={active ? color : "none"}
        stroke={color}
        strokeWidth="1.6"
      />
      <rect
        x="4.6"
        y="7"
        width="2"
        height="10"
        rx="0.8"
        fill={active ? color : "none"}
        stroke={color}
        strokeWidth="1.6"
      />
      <line
        x1="6.8"
        y1="12"
        x2="17.2"
        y2="12"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <rect
        x="17.4"
        y="7"
        width="2"
        height="10"
        rx="0.8"
        fill={active ? color : "none"}
        stroke={color}
        strokeWidth="1.6"
      />
      <rect
        x="19.6"
        y="9"
        width="2.4"
        height="6"
        rx="0.8"
        fill={active ? color : "none"}
        stroke={color}
        strokeWidth="1.6"
      />
    </svg>
  );
}

export function TabProgressIcon({
  size = 22,
  color = DIM,
  className,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M3 19l4-6 4 3 4-7 4 5 2-3"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="3" cy="19" r="1.2" fill={color} />
      <circle cx="7" cy="13" r="1.2" fill={color} />
      <circle cx="11" cy="16" r="1.2" fill={color} />
      <circle cx="15" cy="9" r="1.2" fill={color} />
      <circle cx="19" cy="14" r="1.2" fill={color} />
      <circle cx="21" cy="11" r="1.2" fill={color} />
    </svg>
  );
}

export function TabAppleIcon({ size = 22, color = DIM, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M12 7c-2-2-7-2-7 3 0 5 3 11 7 11s7-6 7-11c0-5-5-5-7-3Z"
        stroke={color}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M12 7c0-2 1.5-3.5 3-3.5"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function TabUserIcon({ size = 22, color = DIM, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <circle cx="12" cy="8" r="3.5" stroke={color} strokeWidth="1.6" />
      <path
        d="M4 21c0-4 4-6 8-6s8 2 8 6"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ─── Workout figure glyphs ─── */

export function GlyphPush({ color = RED }: { color?: string }) {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="10" r="3.4" fill={color} />
      <path
        d="M11 18c2-2 6-3 9-3s7 1 9 3l-2 3-3-1-1 5 3 9h-4l-3-7-3 7h-4l3-9-1-5-3 1-2-3Z"
        fill={color}
      />
    </svg>
  );
}

export function GlyphPull({ color = RED }: { color?: string }) {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <rect x="8" y="11" width="24" height="2.4" rx="1" fill={color} />
      <circle cx="20" cy="19" r="3.2" fill={color} />
      <path d="M14 14l4 6h4l4-6-3 0-3 4-3-4-3 0Z" fill={color} />
      <path
        d="M16 23l2 5-1 6h2l1-5h2l1 5h2l-1-6 2-5h-10Z"
        fill={color}
      />
    </svg>
  );
}

export function GlyphLeg({ color = RED }: { color?: string }) {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <circle cx="22" cy="9" r="3" fill={color} />
      <path
        d="M11 33l8-9 2-7 4 3 1 5-2 4 6 4-2 3-7-3-3 4-3-1-4 0Z"
        fill={color}
      />
    </svg>
  );
}

export function GlyphUpper({ color = RED }: { color?: string }) {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="9" r="3" fill={color} />
      <path
        d="M10 17c2-2 6-3 10-3s8 1 10 3l-2 5-5-2-1 11h-4l-1-11-5 2-2-5Z"
        fill={color}
      />
    </svg>
  );
}

export function GlyphFull({ color = RED }: { color?: string }) {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="8" r="3" fill={color} />
      <path
        d="M13 14h14l-1 5-3 1v6h-2v-5h-2v5h-2v-5h-2v5h-2v-6l-3-1-1-5Z"
        fill={color}
      />
      <rect x="16" y="27" width="3" height="6" rx="1" fill={color} />
      <rect x="21" y="27" width="3" height="6" rx="1" fill={color} />
    </svg>
  );
}

import type { FigureVariant } from "@/lib/mock-data";
export function WorkoutGlyph({ variant }: { variant: FigureVariant }) {
  switch (variant) {
    case "push":
      return <GlyphPush />;
    case "pull":
      return <GlyphPull />;
    case "leg":
      return <GlyphLeg />;
    case "upper":
      return <GlyphUpper />;
    case "full":
      return <GlyphFull />;
  }
}
