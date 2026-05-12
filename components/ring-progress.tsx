"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type RingProgressProps = {
  percent: number;
  size?: number;
  strokeWidth?: number;
  trackColor?: string;
  color?: string;
  children?: ReactNode;
  glow?: boolean;
};

export function RingProgress({
  percent,
  size = 140,
  strokeWidth = 10,
  trackColor = "#1F1F1F",
  color = "#EF4444",
  children,
  glow = true,
}: RingProgressProps) {
  const reduce = useReducedMotion();
  const clamped = Math.max(0, Math.min(100, percent));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const target = circumference * (1 - clamped / 100);

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        style={
          glow ? { filter: `drop-shadow(0 0 8px ${color}66)` } : undefined
        }
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="butt"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: reduce ? target : circumference }}
          animate={{ strokeDashoffset: target }}
          transition={{ duration: reduce ? 0 : 1.2, ease: "easeOut" }}
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          {children}
        </div>
      )}
    </div>
  );
}
