"use client";

import Image from "next/image";
import { BellIcon, FlameIcon } from "@/components/gym-icons";

/**
 * Dashboard hero — matches the Claude Design prototype exactly.
 * 420px tall block: status-bar gutter at top (handled by parent),
 * athlete photo bleeds out the upper-right, gradient fades keep the
 * welcome text readable on the left, greeting + streak anchored at
 * the bottom corners.
 */
export function HeroArt({ streak = 0 }: { streak?: number }) {
  return (
    <div className="relative h-[420px] overflow-hidden pt-[54px]">
      {/* Hero photo, bleeding past the right edge (30% larger than prototype) */}
      <div
        className="absolute -right-[36px] top-1 h-[414px] w-[291px] bg-no-repeat bg-center bg-contain"
        style={{ backgroundImage: "url(/hero-bg.png)" }}
      />

      {/* Left fade — keeps welcome text on solid black */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, #000 0%, #000 30%, rgba(0,0,0,0) 55%)",
        }}
      />

      {/* Bottom fade to black so cards below sit clean */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0) 60%, #000 95%)",
        }}
      />

      {/* Logo top-left (rendered inside, drop-shadowed) */}
      <div className="absolute left-5 top-[60px] z-[5]">
        <Image
          src="/logo.png"
          alt="Gym Dome"
          width={1478}
          height={1064}
          priority
          sizes="173px"
          className="h-[166px] w-[173px] object-scale-down"
          style={{ filter: "drop-shadow(0 0 6px #000)" }}
        />
      </div>

      {/* Bell top-right — no unread dot until notifications are real */}
      <button
        type="button"
        aria-label="Notifications"
        className="absolute right-5 top-[70px] z-[6] cursor-pointer"
      >
        <BellIcon size={24} color="#FFFFFF" />
      </button>

      {/* Greeting bottom-left */}
      <div className="absolute bottom-6 left-5 z-[5] max-w-[230px]">
        <div
          className="mb-0.5 text-[18px] font-medium text-muted-foreground"
          style={{ textShadow: "0 0 12px #000" }}
        >
          Welcome back,
        </div>
        <div
          className="text-[50px] font-extrabold tracking-[-1.6px] leading-none text-white"
          style={{ textShadow: "0 2px 12px #000" }}
        >
          Athlete
        </div>
        <div
          className="mt-3.5 border-l-[3px] border-primary pl-2.5 text-[14.5px] font-medium leading-[1.45] text-white"
          style={{ textShadow: "0 0 8px #000" }}
        >
          Track smarter.
          <br />
          Train harder.{" "}
          <span className="font-semibold text-primary">Be better.</span>
        </div>
      </div>

      {/* Streak bottom-right — overlays the baked-in "12" in the bg image */}
      <div className="absolute bottom-[10px] right-[10px] z-[5] text-right">
        <div
          className="inline-flex items-center justify-end gap-1.5 rounded-lg px-3 py-1"
          style={{
            // Solid-ish backdrop so the baked-in "12" doesn't show through
            // when the real streak is a different number.
            background:
              "radial-gradient(ellipse at center, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 60%, rgba(0,0,0,0) 90%)",
          }}
        >
          <div className="text-[36px] font-extrabold tracking-[-0.5px] text-white tabular-nums">
            {streak}
          </div>
          <span className="inline-flex animate-[flameWiggle_1.8s_ease-in-out_infinite]">
            <FlameIcon size={26} color="#FF1F2D" />
          </span>
        </div>
        <div
          className="text-[11.5px] font-bold tracking-[1.8px] text-muted-foreground"
          style={{ textShadow: "0 0 6px #000" }}
        >
          DAY STREAK
        </div>
      </div>
    </div>
  );
}
