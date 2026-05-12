import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { BookmarkIcon } from "@/components/gym-icons";
import { StatusBar } from "@/components/status-bar";
import { createClient } from "@/lib/supabase/server";
import { deleteWorkout } from "./actions";

export default async function WorkoutDetailPage({
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
      "id, name, started_at, ended_at, duration_minutes, workout_exercises(order_index, exercises(name, muscle_group), sets(set_number, weight_kg, reps, completed))"
    )
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!workout) notFound();

  // If the workout isn't finished yet, send the user back to the logger.
  if (!workout.ended_at) redirect(`/workouts/new/log/${id}`);

  const sorted = [...(workout.workout_exercises ?? [])].sort(
    (a, b) => a.order_index - b.order_index
  );
  const muscleGroups = Array.from(
    new Set(sorted.map((we) => we.exercises?.muscle_group).filter(Boolean))
  ) as string[];
  const dateLabel = new Date(workout.started_at).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <>
      <StatusBar />
      <main className="px-4 pt-14 pb-32">
        <Link
          href="/workouts"
          className="mb-3 inline-block text-[13px] font-semibold text-muted-foreground hover:text-white"
        >
          ← Workouts
        </Link>

        <div className="flex items-center gap-3.5">
          <div className="grid h-[56px] w-[56px] place-items-center rounded-[16px] bg-primary/[0.12]">
            <BookmarkIcon size={26} />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-[28px] font-extrabold tracking-[-0.8px] text-white">
              {workout.name}
            </h1>
            <p className="text-[13px] text-muted-foreground">
              {dateLabel} • {workout.duration_minutes ?? 0} min
            </p>
          </div>
        </div>

        {muscleGroups.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {muscleGroups.map((g) => (
              <span
                key={g}
                className="rounded-full border border-primary/40 bg-primary/10 px-2.5 py-1 text-[12px] font-semibold capitalize text-primary"
              >
                {g}
              </span>
            ))}
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3">
          {sorted.map((we) => {
            const sets = [...(we.sets ?? [])].sort(
              (a, b) => a.set_number - b.set_number
            );
            return (
              <section
                key={`${we.order_index}-${we.exercises?.name}`}
                className="rounded-[18px] border border-[rgba(255,255,255,0.06)] bg-card p-[18px]"
              >
                <div className="mb-3 flex items-baseline justify-between">
                  <h2 className="text-[17px] font-bold text-white">
                    {we.exercises?.name ?? "Exercise"}
                  </h2>
                  <span className="text-[10px] font-semibold uppercase tracking-[1.2px] text-muted-foreground">
                    {we.exercises?.muscle_group}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  {sets.length === 0 && (
                    <p className="text-[13px] text-muted-foreground">
                      No sets logged.
                    </p>
                  )}
                  {sets.map((s) => (
                    <div
                      key={s.set_number}
                      className="grid grid-cols-[28px_1fr_1fr] items-center gap-2 text-[14px]"
                    >
                      <span className="text-muted-foreground">
                        {s.set_number}
                      </span>
                      <span className="text-white tabular-nums">
                        {s.weight_kg != null ? `${s.weight_kg} kg` : "—"}
                      </span>
                      <span className="text-white tabular-nums">
                        {s.reps != null ? `${s.reps} reps` : "—"}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        <form action={deleteWorkout} className="mt-6">
          <input type="hidden" name="id" value={workout.id} />
          <button
            type="submit"
            className="flex h-11 w-full items-center justify-center rounded-xl border border-[rgba(255,255,255,0.06)] bg-card text-[14px] font-semibold text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
          >
            Delete this workout
          </button>
        </form>
      </main>
    </>
  );
}
