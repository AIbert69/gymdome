"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const num = (v: FormDataEntryValue | null) => {
  const s = String(v ?? "").trim();
  if (s === "") return null;
  const n = Number(s);
  return Number.isFinite(n) && n >= 0 ? n : null;
};

export async function logFood(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const calories = num(formData.get("calories"));
  if (calories == null || calories <= 0) {
    redirect("/nutrition?error=Calories%20required");
  }

  await supabase.from("nutrition_entries").insert({
    user_id: user.id,
    label: String(formData.get("label") ?? "").trim() || null,
    calories,
    protein_g: num(formData.get("protein_g")),
    carbs_g: num(formData.get("carbs_g")),
    fat_g: num(formData.get("fat_g")),
  });

  revalidatePath("/nutrition");
  revalidatePath("/dashboard");
}

export async function deleteNutritionEntry(formData: FormData) {
  const supabase = await createClient();
  const id = String(formData.get("id"));
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !id) return;
  await supabase
    .from("nutrition_entries")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);
  revalidatePath("/nutrition");
  revalidatePath("/dashboard");
}
