"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function saveSet(formData: FormData) {
  const supabase = await createClient();
  const workoutExerciseId = String(formData.get("workoutExerciseId"));
  const setNumber = Number(formData.get("setNumber"));
  const weightRaw = String(formData.get("weight") ?? "").trim();
  const repsRaw = String(formData.get("reps") ?? "").trim();

  if (!workoutExerciseId || !Number.isInteger(setNumber)) return;

  const weight = weightRaw === "" ? null : Number(weightRaw);
  const reps = repsRaw === "" ? null : Number(repsRaw);
  const completed =
    weight != null && weight > 0 && reps != null && reps > 0;

  await supabase.from("sets").upsert(
    {
      workout_exercise_id: workoutExerciseId,
      set_number: setNumber,
      weight_kg: weight,
      reps: reps,
      completed,
    },
    { onConflict: "workout_exercise_id,set_number" }
  );
}

export async function finishWorkout(workoutId: string) {
  redirect(`/workouts/new/summary/${workoutId}`);
}

export async function discardWorkout(workoutId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    await supabase
      .from("workouts")
      .delete()
      .eq("id", workoutId)
      .eq("user_id", user.id);
  }
  revalidatePath("/workouts");
  redirect("/workouts");
}
