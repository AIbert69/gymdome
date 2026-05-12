import type { FigureVariant } from "@/lib/mock-data";

type WorkoutFigureProps = {
  variant: FigureVariant;
  className?: string;
};

/**
 * Stylized red pose silhouettes for the workout list. Simple shape language
 * (head circle + torso path + limb paths) so the variants read at small
 * sizes. Swap each `<svg>` for higher-fidelity art later if needed.
 */
export function WorkoutFigure({
  variant,
  className = "h-9 w-9",
}: WorkoutFigureProps) {
  const fill = "#EF4444";
  const stroke = "#EF4444";

  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      stroke={stroke}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-hidden="true"
    >
      {variant === "push" && (
        // Push: arms extending forward, body leaned
        <g fill={fill} stroke={stroke}>
          <circle cx="20" cy="18" r="5" />
          <path d="M16 23 Q14 33 18 42 L24 42 L26 30 L30 30 Q44 30 50 22 L52 18 L44 16 Q34 18 30 24 L26 24 Z" />
          <path d="M18 42 L14 56 L22 56 L24 44 Z" />
          <path d="M26 44 L28 56 L36 56 L30 42 Z" />
        </g>
      )}

      {variant === "pull" && (
        // Pull: arms raised up overhead
        <g fill={fill} stroke={stroke}>
          <circle cx="32" cy="22" r="5" />
          <path d="M22 8 L26 18 L30 22 L26 32 L24 46 L40 46 L38 32 L34 22 L38 18 L42 8 L38 8 L34 16 L30 16 L26 16 L26 8 Z" />
          <path d="M24 46 L20 60 L28 60 L29 48 Z" />
          <path d="M36 46 L35 48 L36 60 L44 60 L40 46 Z" />
        </g>
      )}

      {variant === "leg" && (
        // Leg: squat — knees bent wide, arms forward
        <g fill={fill} stroke={stroke}>
          <circle cx="32" cy="14" r="5" />
          <path d="M24 19 L26 30 L38 30 L40 19 L36 18 L32 22 L28 18 Z" />
          <path d="M26 30 L22 36 L20 38 L16 36 L18 32 Z" />
          <path d="M38 30 L42 36 L44 38 L48 36 L46 32 Z" />
          <path d="M26 30 L20 42 L22 56 L32 56 L34 42 L34 30 Z" />
          <path d="M30 30 L30 42 L32 56 L42 56 L44 42 L38 30 Z" />
        </g>
      )}

      {variant === "upper" && (
        // Upper body: standing, arms relaxed at sides
        <g fill={fill} stroke={stroke}>
          <circle cx="32" cy="14" r="5" />
          <path d="M22 22 Q22 18 26 19 L30 21 L34 21 L38 19 Q42 18 42 22 L40 36 L24 36 Z" />
          <path d="M22 22 L18 38 L22 40 L26 26 Z" />
          <path d="M42 22 L46 38 L42 40 L38 26 Z" />
          <path d="M24 36 L24 56 L32 56 L32 38 Z" />
          <path d="M32 38 L32 56 L40 56 L40 36 Z" />
        </g>
      )}

      {variant === "full" && (
        // Full body: standing wider stance with all limbs
        <g fill={fill} stroke={stroke}>
          <circle cx="32" cy="14" r="5" />
          <path d="M22 22 L24 36 L40 36 L42 22 L36 19 L32 22 L28 19 Z" />
          <path d="M22 22 L14 36 L18 38 L26 26 Z" />
          <path d="M42 22 L50 36 L46 38 L38 26 Z" />
          <path d="M24 36 L20 56 L28 56 L30 38 Z" />
          <path d="M34 38 L36 56 L44 56 L40 36 Z" />
        </g>
      )}
    </svg>
  );
}
