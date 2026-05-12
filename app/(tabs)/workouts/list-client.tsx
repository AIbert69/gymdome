"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { DotsIcon, PlusIcon } from "@/components/gym-icons";
import { WorkoutFigure } from "@/components/workout-figure";
import type { WorkoutListItem } from "@/lib/queries";
import type { FigureVariant } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type Filter = "All" | "Strength" | "Hypertrophy" | "Endurance";
const FILTERS: Filter[] = ["All", "Strength", "Hypertrophy", "Endurance"];

function figureFor(groups: string[]): FigureVariant {
  const first = groups[0]?.toLowerCase() ?? "";
  if (first.includes("leg")) return "leg";
  if (first === "back") return "pull";
  if (first === "chest") return "push";
  if (first === "core") return "full";
  return "upper";
}

export function WorkoutsListClient({
  workouts,
}: {
  workouts: WorkoutListItem[];
}) {
  const [filter, setFilter] = useState<Filter>("All");

  const visible = useMemo(
    () =>
      filter === "All"
        ? workouts
        : workouts.filter((w) => w.category === filter),
    [filter, workouts]
  );

  return (
    <>
      <div
        role="tablist"
        className="mb-4 flex gap-2 overflow-x-auto px-4"
      >
        {FILTERS.map((f) => {
          const active = f === filter;
          return (
            <button
              key={f}
              role="tab"
              aria-selected={active}
              onClick={() => setFilter(f)}
              className={cn(
                "shrink-0 whitespace-nowrap rounded-full px-[18px] py-[9px] text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                active
                  ? "border border-primary bg-primary text-white"
                  : "border border-[rgba(255,255,255,0.06)] bg-transparent text-[#A8A8A8] hover:text-white"
              )}
            >
              {f}
            </button>
          );
        })}
      </div>

      <ul className="flex flex-col gap-2.5 px-4">
        {visible.map((w) => (
          <li key={w.id}>
            <Link
              href={`/workouts/${w.id}`}
              aria-label={`Open ${w.name} workout`}
              className="block rounded-[18px] border border-[rgba(255,255,255,0.06)] bg-card p-3.5 transition-colors hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-[50px] w-[50px] shrink-0 place-items-center rounded-[14px] bg-primary/[0.10]">
                  <WorkoutFigure variant={figureFor(w.muscleGroups)} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <p className="text-[17px] font-bold text-white leading-tight">
                      {w.name}
                    </p>
                    {w.category && (
                      <span className="text-[10px] font-bold uppercase tracking-[1px] text-primary">
                        {w.category}
                      </span>
                    )}
                  </div>
                  {w.muscleGroups.length > 0 && (
                    <p className="mt-0.5 truncate text-[12.5px] text-muted-foreground">
                      {w.muscleGroups.join(" • ")}
                    </p>
                  )}
                  <p className="text-[12.5px] text-muted-foreground">
                    {w.when} • {w.duration}
                  </p>
                </div>
                <span
                  aria-hidden
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted-foreground"
                >
                  <DotsIcon />
                </span>
              </div>
            </Link>
          </li>
        ))}
        {visible.length === 0 && (
          <li className="rounded-[18px] border border-dashed border-[rgba(255,255,255,0.06)] bg-card/40 p-10 text-center">
            <p className="text-sm text-muted-foreground">
              {filter === "All"
                ? "No workouts logged yet."
                : `No ${filter.toLowerCase()} workouts yet.`}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Tap{" "}
              <span className="font-semibold text-primary">
                Start New Workout
              </span>{" "}
              below to log one.
            </p>
          </li>
        )}
      </ul>

      <div className="px-4 pt-5">
        <Link
          href="/workouts/new"
          className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl border-[1.5px] border-primary bg-transparent text-primary transition-colors hover:bg-primary/[0.06] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          <PlusIcon size={20} />
          <span className="text-[17px] font-semibold">Start New Workout</span>
        </Link>
      </div>
    </>
  );
}
