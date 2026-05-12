import { notFound, redirect } from "next/navigation";
import { StatusBar } from "@/components/status-bar";
import { createClient } from "@/lib/supabase/server";
import { LogClient } from "./log-client";

const DEFAULT_SETS = 3;

export default async function ActiveWorkoutPage({
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
      "id, name, ended_at, workout_exercises(id, order_index, exercises(name, muscle_group), sets(set_number, weight_kg, reps, completed))"
    )
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!workout) notFound();

  // Already finished? bounce to summary so we don't keep editing it.
  if (workout.ended_at) {
    redirect(`/workouts/new/summary/${id}`);
  }

  const exerciseRows = [...(workout.workout_exercises ?? [])]
    .sort((a, b) => a.order_index - b.order_index)
    .map((we) => {
      const existing = (we.sets ?? []).sort(
        (a, b) => a.set_number - b.set_number
      );
      // Fill up to DEFAULT_SETS empty rows so the user has something to type into.
      const max = Math.max(DEFAULT_SETS, existing.length);
      const sets = Array.from({ length: max }, (_, i) => {
        const setNumber = i + 1;
        const found = existing.find((s) => s.set_number === setNumber);
        return {
          setNumber,
          weight: found?.weight_kg != null ? String(found.weight_kg) : "",
          reps: found?.reps != null ? String(found.reps) : "",
          completed: !!found?.completed,
        };
      });
      return {
        workoutExerciseId: we.id,
        name: we.exercises?.name ?? "Exercise",
        muscleGroup: we.exercises?.muscle_group ?? "",
        sets,
      };
    });

  return (
    <>
      <StatusBar />
      <main className="pt-14">
        <LogClient
          workoutId={workout.id}
          workoutName={workout.name}
          exercises={exerciseRows}
        />
      </main>
    </>
  );
}
