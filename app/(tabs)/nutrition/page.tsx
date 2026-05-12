import { redirect } from "next/navigation";
import { FlameIcon } from "@/components/gym-icons";
import { RingProgress } from "@/components/ring-progress";
import { StatusBar } from "@/components/status-bar";
import { createClient } from "@/lib/supabase/server";
import { logFood, deleteNutritionEntry } from "./actions";

export default async function NutritionPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const [{ data: entries }, { data: profile }] = await Promise.all([
    supabase
      .from("nutrition_entries")
      .select("*")
      .gte("consumed_at", startOfDay.toISOString())
      .order("consumed_at", { ascending: false }),
    supabase
      .from("profiles")
      .select("daily_calorie_goal")
      .eq("id", user.id)
      .maybeSingle(),
  ]);

  const list = entries ?? [];
  const goal = profile?.daily_calorie_goal ?? 2000;
  const consumed = list.reduce((a, e) => a + (e.calories ?? 0), 0);
  const pct = goal > 0 ? Math.min(100, Math.round((consumed / goal) * 100)) : 0;

  const totals = list.reduce(
    (acc, e) => ({
      protein: acc.protein + (e.protein_g ?? 0),
      carbs: acc.carbs + (e.carbs_g ?? 0),
      fat: acc.fat + (e.fat_g ?? 0),
    }),
    { protein: 0, carbs: 0, fat: 0 }
  );

  return (
    <>
      <StatusBar />
      <main className="px-4 pt-16 pb-32">
        <h1 className="mb-4 text-[34px] font-extrabold tracking-[-1px] text-white">
          Nutrition
        </h1>

        {/* Today's calorie ring + macros */}
        <div className="rounded-[18px] border border-[rgba(255,255,255,0.06)] bg-card p-[18px]">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[12px] font-bold tracking-[1.4px] text-white">
              TODAY
            </h2>
            <span className="text-[12px] font-semibold text-muted-foreground">
              of{" "}
              <span className="text-white">
                {new Intl.NumberFormat("en-US").format(goal)}
              </span>{" "}
              kcal
            </span>
          </div>
          <div className="flex items-center gap-5">
            <RingProgress
              percent={pct}
              size={130}
              strokeWidth={11}
              color="#FF1F2D"
              trackColor="rgba(255,255,255,0.06)"
            >
              <span className="text-[28px] font-extrabold tracking-[-0.5px] leading-none text-white">
                {new Intl.NumberFormat("en-US").format(consumed)}
              </span>
              <span className="mt-1 text-[10px] font-semibold tracking-[1.2px] text-muted-foreground">
                KCAL
              </span>
            </RingProgress>
            <div className="flex-1 flex flex-col gap-2 text-[13px]">
              <Macro label="Protein" value={totals.protein} unit="g" />
              <Macro label="Carbs" value={totals.carbs} unit="g" />
              <Macro label="Fat" value={totals.fat} unit="g" />
            </div>
          </div>
        </div>

        {/* Add entry form */}
        <form
          action={logFood}
          className="mt-4 flex flex-col gap-2.5 rounded-[18px] border border-[rgba(255,255,255,0.06)] bg-card p-[18px]"
        >
          <h2 className="text-[12px] font-bold tracking-[1.4px] text-white">
            ADD ENTRY
          </h2>
          {error && (
            <div
              role="alert"
              className="rounded-lg border border-primary/40 bg-primary/10 px-3 py-2 text-sm text-primary"
            >
              {error}
            </div>
          )}
          <input
            name="label"
            placeholder="What did you eat? (optional)"
            className={inputCls}
          />
          <div className="grid grid-cols-4 gap-2">
            <NumField name="calories" placeholder="kcal" required />
            <NumField name="protein_g" placeholder="P (g)" />
            <NumField name="carbs_g" placeholder="C (g)" />
            <NumField name="fat_g" placeholder="F (g)" />
          </div>
          <button
            type="submit"
            className="mt-1 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-[15px] font-semibold text-white hover:opacity-90 active:scale-[0.99]"
          >
            <FlameIcon size={16} color="#fff" /> Log
          </button>
        </form>

        {/* Today list */}
        <div className="mt-4">
          <h2 className="mb-2 text-[12px] font-bold tracking-[1.4px] text-white">
            TODAY&apos;S ENTRIES
          </h2>
          {list.length === 0 ? (
            <p className="rounded-[18px] border border-dashed border-[rgba(255,255,255,0.06)] bg-card/40 p-6 text-center text-[13px] text-muted-foreground">
              Nothing logged yet today.
            </p>
          ) : (
            <ul className="flex flex-col gap-1.5">
              {list.map((e) => (
                <li
                  key={e.id}
                  className="flex items-center justify-between rounded-xl border border-[rgba(255,255,255,0.06)] bg-card px-3.5 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="text-[14px] font-semibold text-white truncate">
                      {e.label ?? "Entry"}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {new Date(e.consumed_at).toLocaleTimeString(undefined, {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                      {(e.protein_g || e.carbs_g || e.fat_g) &&
                        ` · ${e.protein_g ?? 0}P / ${e.carbs_g ?? 0}C / ${e.fat_g ?? 0}F`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-bold tabular-nums text-white">
                      {e.calories}{" "}
                      <span className="text-[10px] text-muted-foreground">kcal</span>
                    </span>
                    <form action={deleteNutritionEntry}>
                      <input type="hidden" name="id" value={e.id} />
                      <button
                        type="submit"
                        aria-label="Delete entry"
                        className="grid h-7 w-7 place-items-center rounded-full text-muted-foreground hover:bg-white/[0.05] hover:text-primary"
                      >
                        ×
                      </button>
                    </form>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </>
  );
}

const inputCls =
  "h-10 w-full rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#08080A] px-3.5 text-[14px] text-white placeholder:text-[#5C5C5C] focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30";

function NumField({
  name,
  placeholder,
  required,
}: {
  name: string;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <input
      name={name}
      type="number"
      step="0.1"
      min="0"
      inputMode="decimal"
      placeholder={placeholder}
      required={required}
      className={inputCls + " text-center"}
    />
  );
}

function Macro({
  label,
  value,
  unit,
}: {
  label: string;
  value: number;
  unit: string;
}) {
  return (
    <div className="flex items-baseline justify-between">
      <span className="text-[11px] uppercase tracking-[1.2px] text-muted-foreground">
        {label}
      </span>
      <span className="font-bold text-white tabular-nums">
        {Math.round(value)}
        <span className="ml-0.5 text-[11px] text-muted-foreground">{unit}</span>
      </span>
    </div>
  );
}
