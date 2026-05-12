import Image from "next/image";
import Link from "next/link";
import { StatusBar } from "@/components/status-bar";
import { createClient } from "@/lib/supabase/server";
import {
  getMuscleFocus,
  getProgressLastWeek,
  getStrengthTrend,
  getAllWorkouts,
} from "@/lib/queries";

type Tab = "Overview" | "Strength" | "Body" | "History";

export default async function ProgressPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab: rawTab } = await searchParams;
  const tab: Tab = (["Overview", "Strength", "Body", "History"] as const).includes(
    rawTab as Tab
  )
    ? (rawTab as Tab)
    : "Overview";

  return (
    <>
      <StatusBar />
      <main className="pt-16 pb-32">
        <div className="px-5 pb-4 pt-3">
          <h1 className="text-[34px] font-extrabold tracking-[-1px] text-white">
            Progress
          </h1>
        </div>

        {/* Sub-tabs */}
        <div role="tablist" className="mb-4 flex gap-1.5 overflow-x-auto px-4">
          {(["Overview", "Strength", "Body", "History"] as const).map((t) => {
            const active = t === tab;
            return (
              <Link
                key={t}
                role="tab"
                aria-selected={active}
                href={t === "Overview" ? "/progress" : `/progress?tab=${t}`}
                className={
                  active
                    ? "shrink-0 whitespace-nowrap rounded-full border border-primary bg-primary px-4 py-[9px] text-sm font-semibold text-white"
                    : "shrink-0 whitespace-nowrap rounded-full border border-[rgba(255,255,255,0.06)] bg-transparent px-4 py-[9px] text-sm font-semibold text-[#A8A8A8] hover:text-white"
                }
              >
                {t}
              </Link>
            );
          })}
        </div>

        {tab === "Overview" && <OverviewTab />}
        {tab === "Strength" && <StrengthTab />}
        {tab === "Body" && <BodyTab />}
        {tab === "History" && <HistoryTab />}
      </main>
    </>
  );
}

async function OverviewTab() {
  const [week, muscleFocus] = await Promise.all([
    getProgressLastWeek(),
    getMuscleFocus(),
  ]);

  const max = Math.max(15000, ...week.dailyKg) || 15000;
  const yMax = Math.ceil(max / 5000) * 5000;
  const yTicks = [yMax, yMax * (2 / 3), yMax / 3, 0].map((n) =>
    n >= 1000 ? `${Math.round(n / 1000)}K` : String(Math.round(n))
  );

  return (
    <>
      <div className="px-4">
        <Card>
          <div className="mb-1.5 flex items-center justify-between">
            <h2 className="text-[12px] font-bold tracking-[1.4px] text-white">
              VOLUME LIFTED
            </h2>
            <span className="text-[12px] font-semibold text-primary">
              This Week ▾
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <div className="text-[30px] font-extrabold tracking-[-0.5px] text-white">
              {new Intl.NumberFormat("en-US").format(week.totalKg)}
            </div>
            <div className="text-[13px] font-semibold text-muted-foreground">
              KG
            </div>
          </div>
          <div className="text-[12px] font-semibold text-muted-foreground">
            {week.workoutCount} workouts · {week.durationHours}h
          </div>
          <div className="relative mt-3.5 flex h-[140px] items-end gap-2.5 pl-7">
            <div className="absolute left-0 bottom-[18px] top-0 flex flex-col justify-between text-[10px] font-semibold text-muted-foreground">
              {yTicks.map((t) => (
                <div key={t}>{t}</div>
              ))}
            </div>
            {week.dailyKg.map((v, i) => (
              <div
                key={i}
                className="flex h-full flex-1 flex-col items-center justify-end gap-1.5"
              >
                <div
                  className="w-full rounded-t-[4px] rounded-b-[1px] transition-[height] duration-700"
                  style={{
                    height: `${(v / yMax) * 100}%`,
                    background:
                      "linear-gradient(180deg, #FF3340, #C5101A)",
                    boxShadow:
                      v > 0 ? "0 0 10px rgba(255,31,45,0.4)" : "none",
                  }}
                />
                <div className="text-[11px] font-semibold text-muted-foreground">
                  {week.dayLabels[i]}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-2.5 px-4 pt-3">
        <MiniCard label="WORKOUTS" value={String(week.workoutCount)} sub="This Week" />
        <MiniCard label="DURATION" value={String(week.durationHours)} unit="h" sub="This Week" />
      </div>

      <div className="px-4 pt-3">
        <Card>
          <div className="mb-3.5 flex items-center justify-between">
            <h2 className="text-[12px] font-bold tracking-[1.4px] text-white">
              MUSCLE GROUPS
            </h2>
            <span className="text-[12px] font-semibold text-primary">
              This Week ▾
            </span>
          </div>
          <div className="grid grid-cols-[1.1fr_1fr] items-center gap-2.5">
            <Image
              src="/muscle-focus.png"
              alt="Front and back muscle group highlights"
              width={1049}
              height={1304}
              className="w-full object-contain"
            />
            <div className="flex flex-col gap-[9px] text-[13.5px] font-semibold">
              {muscleFocus.groups.length === 0 && (
                <p className="text-[12px] text-muted-foreground">
                  Log a workout to see muscle distribution.
                </p>
              )}
              {muscleFocus.groups.map((g) => (
                <div
                  key={g.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-[7px]">
                    <span className="h-[5px] w-[5px] rounded-full bg-primary" />
                    <span className="text-white">{g.name}</span>
                  </div>
                  <span className="text-white tabular-nums">{g.percent}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}

async function StrengthTab() {
  const trend = await getStrengthTrend();
  const W = 320;
  const H = 160;
  const maxV = Math.max(1, ...trend.avgPerWeek);
  const stepX = W / Math.max(1, trend.avgPerWeek.length - 1);
  const pts = trend.avgPerWeek.map<[number, number]>((v, i) => [
    i * stepX,
    H - (v / maxV) * (H - 10) - 5,
  ]);
  const path = pts
    .map(([x, y], i) => (i === 0 ? `M${x},${y}` : `L${x},${y}`))
    .join(" ");
  const area = `${path} L${W},${H} L0,${H} Z`;

  return (
    <div className="px-4">
      <Card>
        <h2 className="mb-1 text-[12px] font-bold tracking-[1.4px] text-white">
          AVG SET VOLUME
        </h2>
        <p className="mb-3 text-[12px] text-muted-foreground">
          Weight × reps, averaged across every set. Last 8 weeks.
        </p>
        <svg
          width="100%"
          height="160"
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="strengthFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF1F2D" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#FF1F2D" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={area} fill="url(#strengthFill)" />
          <path
            d={path}
            stroke="#FF1F2D"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ filter: "drop-shadow(0 0 3px rgba(255,31,45,0.6))" }}
          />
        </svg>
        <div className="mt-1 flex justify-between text-[10px] font-semibold text-muted-foreground">
          {trend.labels.map((l, i) => (
            <span key={i}>{l}</span>
          ))}
        </div>
      </Card>
      {trend.avgPerWeek.every((v) => v === 0) && (
        <p className="mt-4 text-center text-[13px] text-muted-foreground">
          No completed sets in the last 8 weeks. Log a workout to start the
          trend.
        </p>
      )}
    </div>
  );
}

async function BodyTab() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = user
    ? await supabase
        .from("profiles")
        .select("body_weight_kg, height_cm, weekly_workout_goal, daily_calorie_goal")
        .eq("id", user.id)
        .maybeSingle()
    : { data: null };

  return (
    <div className="px-4 space-y-3">
      <Card>
        <h2 className="mb-3.5 text-[12px] font-bold tracking-[1.4px] text-white">
          BODY METRICS
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <Metric
            label="Weight"
            value={profile?.body_weight_kg ?? null}
            unit="kg"
          />
          <Metric
            label="Height"
            value={profile?.height_cm ?? null}
            unit="cm"
          />
        </div>
      </Card>
      <Card>
        <h2 className="mb-3.5 text-[12px] font-bold tracking-[1.4px] text-white">
          GOALS
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <Metric
            label="Workouts / Week"
            value={profile?.weekly_workout_goal ?? null}
            unit=""
          />
          <Metric
            label="Calories / Day"
            value={profile?.daily_calorie_goal ?? null}
            unit="kcal"
          />
        </div>
        <Link
          href="/profile"
          className="mt-4 flex h-11 w-full items-center justify-center rounded-xl border border-primary/40 bg-primary/[0.06] text-[14px] font-semibold text-primary hover:bg-primary/[0.12]"
        >
          Edit in Profile →
        </Link>
      </Card>
    </div>
  );
}

async function HistoryTab() {
  const workouts = await getAllWorkouts();

  if (workouts.length === 0) {
    return (
      <div className="px-4">
        <Card>
          <p className="text-[13px] text-muted-foreground">
            No workouts logged yet.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-2 px-4">
      {workouts.map((w) => (
        <li key={w.id}>
          <Link
            href={`/workouts/${w.id}`}
            className="flex items-center justify-between rounded-[14px] border border-[rgba(255,255,255,0.06)] bg-card px-3 py-2.5 hover:border-primary/30"
          >
            <div className="min-w-0">
              <p className="text-[15px] font-bold text-white truncate">
                {w.name}
              </p>
              <p className="text-[12px] text-muted-foreground truncate">
                {w.muscleGroups.join(" • ") || "Untagged"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[12px] font-semibold text-muted-foreground">
                {w.when}
              </p>
              <p className="text-[11px] text-muted-foreground">{w.duration}</p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[18px] border border-[rgba(255,255,255,0.06)] bg-card p-[18px]">
      {children}
    </div>
  );
}

function MiniCard({
  label,
  value,
  unit,
  sub,
}: {
  label: string;
  value: string;
  unit?: string;
  sub: string;
}) {
  return (
    <Card>
      <div className="text-[11px] font-bold tracking-[1.4px] text-white">
        {label}
      </div>
      <div className="mt-1.5 flex items-baseline gap-1">
        <div className="text-[26px] font-extrabold tracking-[-0.5px] text-white">
          {value}
        </div>
        {unit && (
          <div className="text-[12px] font-semibold text-muted-foreground">
            {unit}
          </div>
        )}
      </div>
      <div className="mt-0.5 text-[11px] text-muted-foreground">{sub}</div>
    </Card>
  );
}

function Metric({
  label,
  value,
  unit,
}: {
  label: string;
  value: number | null;
  unit: string;
}) {
  return (
    <div>
      <div className="text-[10px] font-bold tracking-[1.2px] uppercase text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 flex items-baseline gap-1">
        <div className="text-[22px] font-extrabold text-white">
          {value ?? "—"}
        </div>
        {value != null && unit && (
          <div className="text-[12px] text-muted-foreground">{unit}</div>
        )}
      </div>
    </div>
  );
}
