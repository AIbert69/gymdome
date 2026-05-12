import { StatusBar } from "@/components/status-bar";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/(auth)/login/actions";
import { updateProfile } from "./actions";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = user
    ? await supabase
        .from("profiles")
        .select(
          "name, streak_count, created_at, weekly_workout_goal, daily_calorie_goal, body_weight_kg, height_cm"
        )
        .eq("id", user.id)
        .maybeSingle()
    : { data: null };

  return (
    <>
      <StatusBar />
      <main className="px-5 pt-16 pb-32">
        <h1 className="mb-4 text-[34px] font-extrabold tracking-[-1px] text-white">
          Profile
        </h1>

        {/* Identity card */}
        <div className="rounded-[18px] border border-[rgba(255,255,255,0.06)] bg-card p-[18px]">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-primary/[0.12] text-[18px] font-bold text-primary">
              {(profile?.name ?? user?.email ?? "?")[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-[17px] font-bold text-white">
                {profile?.name ?? "Athlete"}
              </p>
              <p className="truncate text-[12.5px] text-muted-foreground">
                {user?.email}
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-[var(--divider)] pt-4">
            <Stat label="Day Streak" value={String(profile?.streak_count ?? 0)} />
            <Stat
              label="Member Since"
              value={
                profile?.created_at
                  ? new Date(profile.created_at).toLocaleDateString(undefined, {
                      month: "short",
                      year: "numeric",
                    })
                  : "—"
              }
            />
          </div>
        </div>

        {/* Editable form */}
        <form
          action={updateProfile}
          className="mt-4 flex flex-col gap-3 rounded-[18px] border border-[rgba(255,255,255,0.06)] bg-card p-[18px]"
        >
          <h2 className="text-[12px] font-bold tracking-[1.4px] text-white">
            ACCOUNT
          </h2>

          <Field label="Name">
            <input
              name="name"
              defaultValue={profile?.name ?? ""}
              placeholder="Athlete"
              className={inputCls}
            />
          </Field>

          <h2 className="mt-3 text-[12px] font-bold tracking-[1.4px] text-white">
            BODY METRICS
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Weight (kg)">
              <input
                name="body_weight_kg"
                type="number"
                step="0.1"
                min="0"
                inputMode="decimal"
                defaultValue={profile?.body_weight_kg ?? ""}
                placeholder="—"
                className={inputCls}
              />
            </Field>
            <Field label="Height (cm)">
              <input
                name="height_cm"
                type="number"
                step="1"
                min="0"
                inputMode="numeric"
                defaultValue={profile?.height_cm ?? ""}
                placeholder="—"
                className={inputCls}
              />
            </Field>
          </div>

          <h2 className="mt-3 text-[12px] font-bold tracking-[1.4px] text-white">
            GOALS
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Workouts / Week">
              <input
                name="weekly_workout_goal"
                type="number"
                step="1"
                min="1"
                max="14"
                inputMode="numeric"
                defaultValue={profile?.weekly_workout_goal ?? 4}
                className={inputCls}
              />
            </Field>
            <Field label="Calories / Day">
              <input
                name="daily_calorie_goal"
                type="number"
                step="50"
                min="1000"
                max="6000"
                inputMode="numeric"
                defaultValue={profile?.daily_calorie_goal ?? 2000}
                className={inputCls}
              />
            </Field>
          </div>

          <button
            type="submit"
            className="mt-2 flex h-11 w-full items-center justify-center rounded-xl bg-primary text-[15px] font-semibold text-white transition-opacity hover:opacity-90 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            Save Changes
          </button>
        </form>

        <form action={signOut} className="mt-4">
          <button
            type="submit"
            className="flex h-12 w-full items-center justify-center rounded-2xl border-[1.5px] border-primary bg-transparent text-[17px] font-semibold text-primary transition-colors hover:bg-primary/[0.06] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            Sign Out
          </button>
        </form>
      </main>
    </>
  );
}

const inputCls =
  "h-11 w-full rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#08080A] px-3.5 text-[15px] text-white placeholder:text-[#5C5C5C] focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[10px] font-semibold tracking-[1.2px] uppercase text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] font-semibold tracking-[1.2px] text-muted-foreground">
        {label.toUpperCase()}
      </div>
      <div className="mt-1 text-[20px] font-extrabold tracking-[-0.4px] text-white">
        {value}
      </div>
    </div>
  );
}
