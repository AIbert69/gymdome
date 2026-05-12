"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function startWorkout(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const name = String(formData.get("name") || "").trim() || "Workout";
  const rawCategory = String(formData.get("category") || "").trim();
  const category =
    rawCategory === "Strength" ||
    rawCategory === "Hypertrophy" ||
    rawCategory === "Endurance"
      ? rawCategory
      : null;
  const exerciseIds = formData
    .getAll("exerciseIds")
    .map((v) => String(v))
    .filter(Boolean);

  if (exerciseIds.length === 0) {
    redirect("/workouts/new?error=Pick%20at%20least%20one%20exercise");
  }

  const { data: workout, error: wErr } = await supabase
    .from("workouts")
    .insert({
      user_id: user.id,
      name,
      category,
      started_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (wErr || !workout) {
    redirect(
      `/workouts/new?error=${encodeURIComponent(wErr?.message ?? "Could not create workout")}`
    );
  }

  const we = exerciseIds.map((eid, i) => ({
    workout_id: workout.id,
    exercise_id: eid,
    order_index: i,
  }));

  const { error: weErr } = await supabase.from("workout_exercises").insert(we);

  if (weErr) {
    // best-effort cleanup
    await supabase.from("workouts").delete().eq("id", workout.id);
    redirect(`/workouts/new?error=${encodeURIComponent(weErr.message)}`);
  }

  revalidatePath("/workouts");
  redirect(`/workouts/new/log/${workout.id}`);
}
