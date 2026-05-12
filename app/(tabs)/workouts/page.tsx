import Link from "next/link";
import { StatusBar } from "@/components/status-bar";
import { getAllWorkouts } from "@/lib/queries";
import { WorkoutsListClient } from "./list-client";

export default async function WorkoutsPage() {
  const workouts = await getAllWorkouts();
  return (
    <>
      <StatusBar />
      <main className="pt-16 pb-32">
        <div className="px-5 pb-4 pt-3">
          <h1 className="text-[34px] font-extrabold tracking-[-1px] text-white">
            Workouts
          </h1>
        </div>
        <WorkoutsListClient workouts={workouts} />
      </main>
    </>
  );
}
