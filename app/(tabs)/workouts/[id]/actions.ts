"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function deleteWorkout(formData: FormData) {
  const supabase = await createClient();
  const id = String(formData.get("id"));
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !id) redirect("/login");

  await supabase
    .from("workouts")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  revalidatePath("/dashboard");
  revalidatePath("/workouts");
  revalidatePath("/progress");
  redirect("/workouts");
}
