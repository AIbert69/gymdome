import { StatusBar } from "@/components/status-bar";
import { createClient } from "@/lib/supabase/server";
import { ExercisePicker } from "./picker-client";

export default async function NewWorkoutPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("exercises")
    .select("id, name, muscle_group, equipment")
    .order("name", { ascending: true });

  const { error } = await searchParams;

  return (
    <>
      <StatusBar />
      <main className="pt-14">
        <ExercisePicker exercises={data ?? []} error={error} />
      </main>
    </>
  );
}
