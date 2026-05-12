import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { StatusBar } from "@/components/status-bar";
import { createClient } from "@/lib/supabase/server";
import { saveAndExit } from "./actions";

export default async function WorkoutSummaryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: workout } = await supabase
    .from("workouts")
    .select(
      "id, name, started_at, ended_at, workout_exercises(exercises(name, muscle_group), sets(weight_kg, reps, completed))"
    )
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!workout) notFound();

  // Totals
  let totalSets = 0;
  let completedSets = 0;
  let kgLifted = 0;
  const muscleGroups = new Set<string>();

  for (const we of workout.workout_exercises ?? []) {
    if (we.exercises?.muscle_group) muscleGroups.add(we.exercises.muscle_group);
    for (const s of we.sets ?? []) {
      totalSets++;
      if (s.completed) completedSets++;
      if (s.weight_kg != null && s.reps != null) {
        kgLifted += Number(s.weight_kg) * s.reps;
      }
    }
  }

  const startedAt = new Date(workout.started_at);
  const liveDurationMin = Math.max(
    1,
    Math.round((Date.now() - startedAt.getTime()) / 60000)
  );

  return (
    <>
      <StatusBar />
      <main className="px-4 pt-14 pb-32">
        <h1 className="mb-2 text-[28px] font-extrabold tracking-[-0.8px] text-white">
          Nice work
        </h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Review your <span className="text-white">{workout.name}</span> session
          before saving.
        </p>

        <div className="rounded-[18px] border border-[rgba(255,255,255,0.06)] bg-card p-[18px]">
          <h2 className="mb-4 text-[12px] font-bold tracking-[1.4px] text-white">
            SESSION TOTALS
          </h2>
          <div className="grid grid-cols-3 gap-2 text-center">
            <Total label="DURATION" value={`${liveDurationMin}m`} />
            <Total label="SETS" value={`${completedSets}/${totalSets}`} />
            <Total
              label="VOLUME"
              value={`${new Intl.NumberFormat("en-US").format(Math.round(kgLifted))}`}
              unit="kg"
            />
          </div>

          {muscleGroups.size > 0 && (
            <div className="mt-5 border-t border-[var(--divider)] pt-4">
              <h3 className="mb-2 text-[10px] font-bold tracking-[1.4px] uppercase text-muted-foreground">
                Muscle Groups
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {[...muscleGroups].map((g) => (
                  <span
                    key={g}
                    className="rounded-full border border-primary/40 bg-primary/10 px-2.5 py-1 text-[12px] font-semibold capitalize text-primary"
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <form action={saveAndExit} className="mt-5 flex flex-col gap-2.5">
          <input type="hidden" name="id" value={workout.id} />
          <input
            type="hidden"
            name="started_at"
            value={workout.started_at}
          />
          <button
            type="submit"
            className="flex h-14 w-full items-center justify-center rounded-2xl bg-primary text-[17px] font-semibold text-white transition-opacity hover:opacity-90 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            Save Workout
          </button>
          <Link
            href={`/workouts/new/log/${workout.id}`}
            className="flex h-12 w-full items-center justify-center rounded-2xl border border-[rgba(255,255,255,0.06)] bg-card text-[15px] font-semibold text-muted-foreground hover:text-white"
          >
            Back to logging
          </Link>
        </form>
      </main>
    </>
  );
}

function Total({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit?: string;
}) {
  return (
    <div>
      <div className="text-[10px] font-bold tracking-[1.2px] text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 flex items-baseline justify-center gap-1">
        <div className="text-[22px] font-extrabold tracking-[-0.4px] text-white">
          {value}
        </div>
        {unit && (
          <div className="text-[11px] font-semibold text-muted-foreground">
            {unit}
          </div>
        )}
      </div>
    </div>
  );
}
