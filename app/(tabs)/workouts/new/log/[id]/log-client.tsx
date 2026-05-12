"use client";

import { useState, useTransition } from "react";
import { saveSet, finishWorkout, discardWorkout } from "./actions";
import { PlusIcon } from "@/components/gym-icons";

type ExerciseRow = {
  workoutExerciseId: string;
  name: string;
  muscleGroup: string;
  sets: Array<{
    setNumber: number;
    weight: string;
    reps: string;
    completed: boolean;
  }>;
};

export function LogClient({
  workoutId,
  workoutName,
  exercises,
}: {
  workoutId: string;
  workoutName: string;
  exercises: ExerciseRow[];
}) {
  const [rows, setRows] = useState<ExerciseRow[]>(exercises);
  const [finishing, startFinish] = useTransition();
  const [discarding, startDiscard] = useTransition();

  function updateSet(
    exIdx: number,
    setIdx: number,
    patch: Partial<ExerciseRow["sets"][number]>
  ) {
    setRows((prev) => {
      const next = [...prev];
      const ex = { ...next[exIdx] };
      const sets = [...ex.sets];
      sets[setIdx] = { ...sets[setIdx], ...patch };
      ex.sets = sets;
      next[exIdx] = ex;
      return next;
    });
  }

  function addSet(exIdx: number) {
    setRows((prev) => {
      const next = [...prev];
      const ex = { ...next[exIdx] };
      const last = ex.sets[ex.sets.length - 1];
      ex.sets = [
        ...ex.sets,
        {
          setNumber: (last?.setNumber ?? 0) + 1,
          weight: last?.weight ?? "",
          reps: last?.reps ?? "",
          completed: false,
        },
      ];
      next[exIdx] = ex;
      return next;
    });
  }

  async function onBlur(exRow: ExerciseRow, setIdx: number) {
    const s = exRow.sets[setIdx];
    if (s.weight === "" && s.reps === "") return;
    const fd = new FormData();
    fd.set("workoutExerciseId", exRow.workoutExerciseId);
    fd.set("setNumber", String(s.setNumber));
    fd.set("weight", s.weight);
    fd.set("reps", s.reps);
    await saveSet(fd);
    updateSet(rows.indexOf(exRow), setIdx, {
      completed:
        s.weight !== "" && Number(s.weight) > 0 && s.reps !== "" && Number(s.reps) > 0,
    });
  }

  return (
    <div className="px-4 pt-4 pb-32">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-[28px] font-extrabold tracking-[-0.8px] text-white">
          {workoutName}
        </h1>
        <button
          type="button"
          onClick={() =>
            confirm("Discard this workout?") &&
            startDiscard(() => discardWorkout(workoutId))
          }
          disabled={discarding}
          className="text-[13px] font-semibold text-muted-foreground hover:text-primary disabled:opacity-50"
        >
          Discard
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {rows.map((ex, exIdx) => (
          <section
            key={ex.workoutExerciseId}
            className="rounded-[18px] border border-[rgba(255,255,255,0.06)] bg-card p-[18px]"
          >
            <div className="mb-3 flex items-baseline justify-between">
              <h2 className="text-[17px] font-bold text-white">{ex.name}</h2>
              <span className="text-[10px] font-semibold tracking-[1.2px] uppercase text-muted-foreground">
                {ex.muscleGroup}
              </span>
            </div>

            <div className="mb-2 grid grid-cols-[28px_1fr_1fr_28px] gap-2 text-[10px] font-bold tracking-[1.2px] uppercase text-muted-foreground">
              <span>Set</span>
              <span>Weight (kg)</span>
              <span>Reps</span>
              <span></span>
            </div>

            <div className="flex flex-col gap-2">
              {ex.sets.map((s, setIdx) => (
                <div
                  key={s.setNumber}
                  className="grid grid-cols-[28px_1fr_1fr_28px] items-center gap-2"
                >
                  <span className="text-[14px] font-semibold text-muted-foreground">
                    {s.setNumber}
                  </span>
                  <input
                    type="number"
                    inputMode="decimal"
                    step="0.5"
                    min="0"
                    value={s.weight}
                    onChange={(e) =>
                      updateSet(exIdx, setIdx, { weight: e.target.value })
                    }
                    onBlur={() => onBlur(ex, setIdx)}
                    placeholder="—"
                    className="h-10 rounded-lg border border-[rgba(255,255,255,0.06)] bg-[#08080A] px-2.5 text-[15px] text-white text-center focus-visible:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/30"
                  />
                  <input
                    type="number"
                    inputMode="numeric"
                    step="1"
                    min="0"
                    value={s.reps}
                    onChange={(e) =>
                      updateSet(exIdx, setIdx, { reps: e.target.value })
                    }
                    onBlur={() => onBlur(ex, setIdx)}
                    placeholder="—"
                    className="h-10 rounded-lg border border-[rgba(255,255,255,0.06)] bg-[#08080A] px-2.5 text-[15px] text-white text-center focus-visible:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/30"
                  />
                  <span
                    aria-label={s.completed ? "saved" : "unsaved"}
                    className={
                      s.completed
                        ? "block h-2.5 w-2.5 mx-auto rounded-full bg-primary shadow-[0_0_6px_#FF1F2D]"
                        : "block h-2.5 w-2.5 mx-auto rounded-full bg-[#1a1a1a]"
                    }
                  />
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => addSet(exIdx)}
              className="mt-3 flex w-full items-center justify-center gap-1 rounded-lg border border-dashed border-[rgba(255,255,255,0.10)] px-3 py-2 text-[13px] font-semibold text-muted-foreground hover:text-white hover:border-[rgba(255,255,255,0.20)]"
            >
              <PlusIcon size={14} color="currentColor" /> Add set
            </button>
          </section>
        ))}
      </div>

      {/* Sticky finish — nav is hidden on this route */}
      <div className="fixed inset-x-0 bottom-0 z-50 pb-[max(env(safe-area-inset-bottom),1rem)] pt-3">
        <div className="mx-auto max-w-[480px] bg-gradient-to-t from-black via-black/95 to-transparent px-4 pt-8 pb-2">
          <button
            type="button"
            disabled={finishing}
            onClick={() => startFinish(() => finishWorkout(workoutId))}
            className="flex h-14 w-full items-center justify-center rounded-2xl bg-primary text-[17px] font-semibold text-white transition-opacity hover:opacity-90 active:scale-[0.99] disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            {finishing ? "Finishing…" : "Finish Workout"}
          </button>
        </div>
      </div>
    </div>
  );
}
