"use client";

import type { LucideIcon } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type MetricCardProps = {
  icon: LucideIcon;
  label: string;
  value: ReactNode;
  /** 0–100 — fills the bar at the bottom */
  fill: number;
  /** Optional muted caption between value and bar */
  sub?: ReactNode;
};

export function MetricCard({
  icon: Icon,
  label,
  value,
  fill,
  sub,
}: MetricCardProps) {
  const reduce = useReducedMotion();
  const clamped = Math.max(0, Math.min(100, fill));

  return (
    <div className="relative rounded-2xl border border-[#1F1F1F] bg-[#0A0A0A] p-3 flex flex-col items-center gap-2">
      <div className="grid h-10 w-10 place-items-center rounded-full border border-white/5 bg-white/[0.02]">
        <Icon className="h-5 w-5 text-primary" strokeWidth={2.25} />
      </div>
      <p className="text-[9px] font-semibold tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <div className="text-base font-bold text-white leading-none">{value}</div>
      {sub && (
        <p className="text-[9px] text-muted-foreground leading-none">{sub}</p>
      )}
      <div className="mt-auto h-1 w-full rounded-full bg-[#1F1F1F] overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-primary"
          initial={{ width: reduce ? `${clamped}%` : 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{
            duration: reduce ? 0 : 1,
            ease: "easeOut",
            delay: reduce ? 0 : 0.2,
          }}
        />
      </div>
    </div>
  );
}
