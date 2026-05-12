"use client";

import { useState, useMemo, useTransition } from "react";
import Link from "next/link";
import { startWorkout } from "./actions";
import { PlusIcon } from "@/components/gym-icons";
import { cn } from "@/lib/utils";
import type {
  MuscleGroup,
  Equipment,
  WorkoutCategory,
} from "@/lib/supabase/types";

type Exercise = {
  id: string;
  name: string;
  muscle_group: MuscleGroup;
  equipment: Equipment | null;
};

const GROUP_ORDER: MuscleGroup[] = [
  "chest",
  "back",
  "legs",
  "shoulders",
  "arms",
  "core",
];

const groupLabels: Record<MuscleGroup, string> = {
  chest: "Chest",
  back: "Back",
  legs: "Legs",
  shoulders: "Shoulders",
  arms: "Arms",
  core: "Core",
};

const CATEGORIES: WorkoutCategory[] = [
  "Strength",
  "Hypertrophy",
  "Endurance",
];

export function ExercisePicker({
  exercises,
  error,
}: {
  exercises: Exercise[];
  error?: string;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [name, setName] = useState("");
  const [category, setCategory] = useState<WorkoutCategory | "">("");
  const [search, setSearch] = useState("");
  const [pending, startTransition] = useTransition();

  const grouped = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered = q
      ? exercises.filter(
          (e) =>
            e.name.toLowerCase().includes(q) ||
            e.muscle_group.toLowerCase().includes(q) ||
            (e.equipment ?? "").toLowerCase().includes(q)
        )
      : exercises;
    const map: Record<string, Exercise[]> = {};
    for (const e of filtered) {
      (map[e.muscle_group] ??= []).push(e);
    }
    return map;
  }, [exercises, search]);

  const matchCount = Object.values(grouped).reduce(
    (a, list) => a + list.length,
    0
  );

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData();
    fd.set("name", name);
    fd.set("category", category);
    selected.forEach((id) => fd.append("exerciseIds", id));
    startTransition(() => startWorkout(fd));
  }

  return (
    <form onSubmit={onSubmit} className="px-4 pt-3 pb-32">
      <div className="flex items-center justify-between pb-4">
        <Link
          href="/workouts"
          className="text-[13px] font-semibold text-muted-foreground hover:text-white"
        >
          ← Cancel
        </Link>
      </div>

      <h1 className="mb-4 text-[28px] font-extrabold tracking-[-0.8px] text-white">
        New Workout
      </h1>

      <label className="flex flex-col gap-1.5">
        <span className="text-[11px] font-semibold tracking-[1.4px] text-muted-foreground uppercase">
          Workout name
        </span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Push Day"
          className="h-11 w-full rounded-xl border border-[rgba(255,255,255,0.06)] bg-card px-3.5 text-[15px] text-white placeholder:text-[#5C5C5C] focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
        />
      </label>

      <fieldset className="mt-3">
        <legend className="text-[11px] font-semibold tracking-[1.4px] text-muted-foreground uppercase mb-1.5">
          Category
        </legend>
        <div className="flex gap-2">
          {CATEGORIES.map((c) => {
            const active = c === category;
            return (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(active ? "" : c)}
                aria-pressed={active}
                className={cn(
                  "flex-1 rounded-full px-3 py-2 text-[13px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  active
                    ? "border border-primary bg-primary text-white"
                    : "border border-[rgba(255,255,255,0.06)] bg-transparent text-[#A8A8A8] hover:text-white"
                )}
              >
                {c}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-6 mb-2 flex items-center justify-between">
        <h2 className="text-[13px] font-bold tracking-[1.4px] text-white">
          PICK EXERCISES
        </h2>
        <span className="text-[12px] text-muted-foreground">
          {selected.size} selected
        </span>
      </div>

      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search exercises…"
        className="mb-3 h-10 w-full rounded-xl border border-[rgba(255,255,255,0.06)] bg-card px-3.5 text-[14px] text-white placeholder:text-[#5C5C5C] focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
      />

      {error && (
        <div
          role="alert"
          className="mb-3 rounded-lg border border-primary/40 bg-primary/10 px-3 py-2 text-sm text-primary"
        >
          {error}
        </div>
      )}

      <div className="flex flex-col gap-4">
        {GROUP_ORDER.map((group) => {
          const items = grouped[group] ?? [];
          if (!items.length) return null;
          return (
            <section key={group}>
              <h3 className="mb-2 text-[10px] font-bold tracking-[1.4px] text-muted-foreground uppercase">
                {groupLabels[group]}
              </h3>
              <div className="flex flex-col gap-1.5">
                {items.map((ex) => {
                  const isSelected = selected.has(ex.id);
                  return (
                    <button
                      key={ex.id}
                      type="button"
                      onClick={() => toggle(ex.id)}
                      aria-pressed={isSelected}
                      className={cn(
                        "flex items-center justify-between rounded-xl border bg-card px-3.5 py-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                        isSelected
                          ? "border-primary bg-primary/[0.08]"
                          : "border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.12)]"
                      )}
                    >
                      <div>
                        <div className="text-[15px] font-semibold text-white">
                          {ex.name}
                        </div>
                        {ex.equipment && (
                          <div className="text-[11px] text-muted-foreground capitalize">
                            {ex.equipment}
                          </div>
                        )}
                      </div>
                      <span
                        className={cn(
                          "grid h-6 w-6 place-items-center rounded-full border text-[12px] font-bold transition-colors",
                          isSelected
                            ? "border-primary bg-primary text-white"
                            : "border-[rgba(255,255,255,0.16)] text-transparent"
                        )}
                      >
                        ✓
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
        {matchCount === 0 && search.trim() !== "" && (
          <p className="rounded-xl border border-dashed border-[rgba(255,255,255,0.06)] bg-card/40 p-6 text-center text-[13px] text-muted-foreground">
            No exercises match “{search}”.
          </p>
        )}
      </div>

      {/* Sticky bottom CTA — nav is hidden on this route */}
      <div className="fixed inset-x-0 bottom-0 z-50 pb-[max(env(safe-area-inset-bottom),1rem)] pt-3">
        <div className="mx-auto max-w-[480px] bg-gradient-to-t from-black via-black/95 to-transparent px-4 pt-8 pb-2">
          <button
            type="submit"
            disabled={selected.size === 0 || pending}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl border-[1.5px] border-primary bg-transparent text-primary transition-colors hover:bg-primary/[0.06] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PlusIcon size={20} />
            <span className="text-[17px] font-semibold">
              {pending
                ? "Starting…"
                : selected.size === 0
                  ? "Pick exercises to continue"
                  : `Start Workout (${selected.size})`}
            </span>
          </button>
        </div>
      </div>
    </form>
  );
}
