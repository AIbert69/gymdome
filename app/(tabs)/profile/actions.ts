"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const name = String(formData.get("name") ?? "").trim() || null;
  const parseNum = (raw: FormDataEntryValue | null) => {
    const s = String(raw ?? "").trim();
    if (s === "") return null;
    const n = Number(s);
    return Number.isFinite(n) && n >= 0 ? n : null;
  };

  await supabase
    .from("profiles")
    .update({
      name,
      body_weight_kg: parseNum(formData.get("body_weight_kg")),
      height_cm: parseNum(formData.get("height_cm")),
      weekly_workout_goal: parseNum(formData.get("weekly_workout_goal")) ?? 4,
      daily_calorie_goal: parseNum(formData.get("daily_calorie_goal")) ?? 2000,
    })
    .eq("id", user.id);

  revalidatePath("/profile");
  revalidatePath("/dashboard");
  revalidatePath("/progress");
}
