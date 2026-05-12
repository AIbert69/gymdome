"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function saveAndExit(formData: FormData) {
  const supabase = await createClient();
  const id = String(formData.get("id"));
  const startedAt = String(formData.get("started_at"));
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !id || !startedAt) redirect("/login");

  const endedAt = new Date();
  const durationMinutes = Math.max(
    1,
    Math.round((endedAt.getTime() - new Date(startedAt).getTime()) / 60000)
  );

  await supabase
    .from("workouts")
    .update({
      ended_at: endedAt.toISOString(),
      duration_minutes: durationMinutes,
    })
    .eq("id", id)
    .eq("user_id", user.id);

  revalidatePath("/dashboard");
  revalidatePath("/workouts");
  revalidatePath("/progress");
  redirect("/dashboard");
}
