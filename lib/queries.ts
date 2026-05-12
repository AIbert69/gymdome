import { createClient } from "@/lib/supabase/server";
import type { MuscleGroup } from "@/lib/supabase/types";

const DAY_MS = 24 * 60 * 60 * 1000;
const WEEK_MS = 7 * DAY_MS;

const MUSCLE_GROUPS: MuscleGroup[] = [
  "chest",
  "back",
  "legs",
  "shoulders",
  "arms",
  "core",
];

const capitalize = (s: string) => (s ? s[0].toUpperCase() + s.slice(1) : s);

function relativeWhen(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d >= today) return "Today";
  if (d >= yesterday) return "Yesterday";
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function clamp(n: number, lo = 0, hi = 100) {
  return Math.max(lo, Math.min(hi, n));
}

/** Same shape callers used before; durationLabel auto-switches to minutes. */
export async function getWeekSummary() {
  const supabase = await createClient();
  const sevenDaysAgo = new Date(Date.now() - WEEK_MS).toISOString();

  const { data, error } = await supabase
    .from("workouts")
    .select(
      "id, duration_minutes, workout_exercises(sets(weight_kg, reps))"
    )
    .gte("started_at", sevenDaysAgo);

  if (error || !data) {
    return {
      workouts: 0,
      kgLifted: 0,
      durationHours: 0,
      durationLabel: "0m",
    };
  }

  let kgLifted = 0;
  let durationMinutes = 0;
  for (const w of data) {
    durationMinutes += w.duration_minutes ?? 0;
    for (const we of w.workout_exercises ?? []) {
      for (const s of we.sets ?? []) {
        if (s.weight_kg != null && s.reps != null) {
          kgLifted += Number(s.weight_kg) * s.reps;
        }
      }
    }
  }

  const durationLabel =
    durationMinutes < 60
      ? `${durationMinutes}m`
      : `${Math.round((durationMinutes / 60) * 10) / 10}h`;

  return {
    workouts: data.length,
    kgLifted: Math.round(kgLifted),
    durationHours: Math.round((durationMinutes / 60) * 10) / 10,
    durationLabel,
  };
}

export async function getRecentWorkout() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("workouts")
    .select(
      "id, name, started_at, duration_minutes, workout_exercises(exercises(muscle_group))"
    )
    .not("ended_at", "is", null)
    .order("started_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data) return null;

  const groups = Array.from(
    new Set(
      (data.workout_exercises ?? [])
        .map((we) => we.exercises?.muscle_group)
        .filter((g): g is string => Boolean(g))
    )
  ).map(capitalize);

  return {
    id: data.id,
    name: data.name,
    when: relativeWhen(data.started_at),
    duration: `${data.duration_minutes ?? 0} min`,
    muscleGroups: groups,
  };
}

export type WorkoutListItem = {
  id: string;
  name: string;
  category: string | null;
  when: string;
  duration: string;
  muscleGroups: string[];
};

export async function getAllWorkouts(): Promise<WorkoutListItem[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("workouts")
    .select(
      "id, name, category, started_at, duration_minutes, workout_exercises(exercises(muscle_group))"
    )
    .not("ended_at", "is", null)
    .order("started_at", { ascending: false });

  if (!data) return [];

  return data.map((w) => ({
    id: w.id,
    name: w.name,
    category: w.category,
    when: relativeWhen(w.started_at),
    duration: `${w.duration_minutes ?? 0} min`,
    muscleGroups: Array.from(
      new Set(
        (w.workout_exercises ?? [])
          .map((we) => we.exercises?.muscle_group)
          .filter((g): g is string => Boolean(g))
      )
    ).map(capitalize),
  }));
}

/* ─── Real muscle focus ──────────────────────────────────────────
 * Sum of sets per muscle group over the week (only completed sets),
 * normalized to percent of the top muscle group. Returns 0% for all
 * if no sets are logged.
 */
export async function getMuscleFocus() {
  const supabase = await createClient();
  const sevenDaysAgo = new Date(Date.now() - WEEK_MS).toISOString();

  const { data } = await supabase
    .from("workouts")
    .select(
      "workout_exercises(exercises(muscle_group), sets(completed))"
    )
    .gte("started_at", sevenDaysAgo);

  const setsPerGroup = new Map<MuscleGroup, number>();
  for (const g of MUSCLE_GROUPS) setsPerGroup.set(g, 0);

  if (data) {
    for (const w of data) {
      for (const we of w.workout_exercises ?? []) {
        const group = we.exercises?.muscle_group as MuscleGroup | undefined;
        if (!group) continue;
        for (const s of we.sets ?? []) {
          if (s.completed) {
            setsPerGroup.set(group, (setsPerGroup.get(group) ?? 0) + 1);
          }
        }
      }
    }
  }

  const totalSets = [...setsPerGroup.values()].reduce((a, b) => a + b, 0);
  const max = Math.max(0, ...setsPerGroup.values());

  // For the ring: percent of the user's weekly volume target (12 hits/group
  // is a reasonable bodybuilding rule of thumb — but we just use top-relative
  // here so the ring fills proportionally to the most-trained group).
  const weeklyProgress = totalSets === 0 ? 0 : Math.min(100, Math.round((totalSets / 60) * 100));

  // List the top 5 groups; percent shown is relative to the max.
  const groups = [...setsPerGroup.entries()]
    .filter(([, sets]) => sets > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([group, sets]) => ({
      name: capitalize(group),
      percent: max === 0 ? 0 : Math.round((sets / max) * 100),
    }));

  // If user has no data, show the 5 groups at 0% as a placeholder so the
  // card doesn't render empty on a fresh account.
  if (groups.length === 0) {
    return {
      weeklyProgress: 0,
      groups: MUSCLE_GROUPS.slice(0, 5).map((g) => ({
        name: capitalize(g),
        percent: 0,
      })),
    };
  }

  return { weeklyProgress, groups };
}

/* ─── Day streak ────────────────────────────────────────────────
 * Consecutive days (including today, or starting from yesterday if no
 * workout yet today) that have at least one ended workout.
 */
export async function getDayStreak(): Promise<number> {
  const supabase = await createClient();
  // 60 days lookback is plenty for any plausible streak
  const since = new Date(Date.now() - 60 * DAY_MS).toISOString();
  const { data } = await supabase
    .from("workouts")
    .select("started_at")
    .gte("started_at", since)
    .not("ended_at", "is", null)
    .order("started_at", { ascending: false });

  if (!data || data.length === 0) return 0;

  const dayKey = (d: Date) =>
    `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
  const workoutDays = new Set(data.map((w) => dayKey(new Date(w.started_at))));

  // Walk backwards from today. If today has no workout, allow yesterday
  // as the streak start (so the streak doesn't reset until you miss two days).
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let cursor = new Date(today);
  if (!workoutDays.has(dayKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
    if (!workoutDays.has(dayKey(cursor))) return 0;
  }

  let count = 0;
  while (workoutDays.has(dayKey(cursor))) {
    count++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return count;
}

/* ─── Strength delta (% change in avg set volume vs last month) ── */
export async function getStrengthDelta(): Promise<number> {
  const supabase = await createClient();
  const now = Date.now();
  const start30 = new Date(now - 30 * DAY_MS).toISOString();
  const start60 = new Date(now - 60 * DAY_MS).toISOString();
  const start60To30 = new Date(now - 30 * DAY_MS).toISOString();

  // Two windows: last 30 days, and 30–60 days ago
  async function avgVolume(after: string, before?: string) {
    let q = supabase
      .from("workouts")
      .select("workout_exercises(sets(weight_kg, reps))")
      .gte("started_at", after);
    if (before) q = q.lt("started_at", before);
    const { data } = await q;
    if (!data) return 0;
    let totalVolume = 0;
    let setCount = 0;
    for (const w of data) {
      for (const we of w.workout_exercises ?? []) {
        for (const s of we.sets ?? []) {
          if (s.weight_kg != null && s.reps != null) {
            totalVolume += Number(s.weight_kg) * s.reps;
            setCount++;
          }
        }
      }
    }
    return setCount === 0 ? 0 : totalVolume / setCount;
  }

  const [current, previous] = await Promise.all([
    avgVolume(start30),
    avgVolume(start60, start60To30),
  ]);

  if (previous === 0) return 0;
  return Math.round(((current - previous) / previous) * 100);
}

/* ─── Calorie totals (today) ───────────────────────────────────── */
export async function getCaloriesToday() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { consumed: 0, goal: 2000 };

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const [{ data: entries }, { data: profile }] = await Promise.all([
    supabase
      .from("nutrition_entries")
      .select("calories")
      .gte("consumed_at", startOfDay.toISOString()),
    supabase
      .from("profiles")
      .select("daily_calorie_goal")
      .eq("id", user.id)
      .maybeSingle(),
  ]);

  const consumed = (entries ?? []).reduce((a, e) => a + (e.calories ?? 0), 0);
  return {
    consumed,
    goal: profile?.daily_calorie_goal ?? 2000,
  };
}

/* ─── Progress + Consistency (workouts vs goal) ─────────────────
 * Progress  = workouts this week  / weekly_workout_goal
 * Consistency = (# of last 4 weeks meeting the goal) / 4
 */
export async function getProgressAndConsistency() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { progressPct: 0, consistencyPct: 0, weeklyGoal: 4 };

  const fourWeeksAgo = new Date(Date.now() - 4 * WEEK_MS).toISOString();
  const oneWeekAgo = new Date(Date.now() - WEEK_MS).toISOString();

  const [{ data: profile }, { data: recentWorkouts }] = await Promise.all([
    supabase
      .from("profiles")
      .select("weekly_workout_goal")
      .eq("id", user.id)
      .maybeSingle(),
    supabase
      .from("workouts")
      .select("started_at")
      .gte("started_at", fourWeeksAgo)
      .not("ended_at", "is", null),
  ]);

  const weeklyGoal = profile?.weekly_workout_goal ?? 4;

  // This week count
  const thisWeekCount =
    recentWorkouts?.filter((w) => w.started_at >= oneWeekAgo).length ?? 0;
  const progressPct = clamp(Math.round((thisWeekCount / weeklyGoal) * 100));

  // Last 4 weeks — count buckets where the goal was met
  const buckets = [0, 0, 0, 0];
  for (const w of recentWorkouts ?? []) {
    const daysAgo = Math.floor(
      (Date.now() - new Date(w.started_at).getTime()) / DAY_MS
    );
    const weekIdx = Math.min(3, Math.floor(daysAgo / 7));
    buckets[weekIdx]++;
  }
  const weeksHit = buckets.filter((c) => c >= weeklyGoal).length;
  const consistencyPct = clamp(Math.round((weeksHit / 4) * 100));

  return { progressPct, consistencyPct, weeklyGoal };
}

/* ─── Progress page: 7-day volume bar + totals ─────────────────── */
export async function getProgressLastWeek() {
  const supabase = await createClient();
  const sevenDaysAgo = new Date(Date.now() - WEEK_MS).toISOString();

  const { data } = await supabase
    .from("workouts")
    .select(
      "started_at, duration_minutes, workout_exercises(sets(weight_kg, reps))"
    )
    .gte("started_at", sevenDaysAgo);

  const buckets = Array.from({ length: 7 }, () => 0);
  const dayLabels = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - (6 - i));
    return d.toLocaleDateString(undefined, { weekday: "short" }).charAt(0);
  });

  let totalKg = 0;
  let totalDurationMinutes = 0;
  const workoutCount = data?.length ?? 0;

  if (data) {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    for (const w of data) {
      const wDate = new Date(w.started_at);
      wDate.setHours(0, 0, 0, 0);
      const daysAgo = Math.floor(
        (todayStart.getTime() - wDate.getTime()) / DAY_MS
      );
      const idx = 6 - daysAgo;

      let kg = 0;
      for (const we of w.workout_exercises ?? []) {
        for (const s of we.sets ?? []) {
          if (s.weight_kg != null && s.reps != null) {
            kg += Number(s.weight_kg) * s.reps;
          }
        }
      }
      totalKg += kg;
      totalDurationMinutes += w.duration_minutes ?? 0;
      if (idx >= 0 && idx <= 6) buckets[idx] += kg;
    }
  }

  return {
    dailyKg: buckets,
    dayLabels,
    totalKg: Math.round(totalKg),
    workoutCount,
    durationHours: Math.round((totalDurationMinutes / 60) * 10) / 10,
  };
}

/* ─── Strength tab: weekly avg-set-volume trend, 8 weeks ────────── */
export async function getStrengthTrend() {
  const supabase = await createClient();
  const since = new Date(Date.now() - 8 * WEEK_MS).toISOString();

  const { data } = await supabase
    .from("workouts")
    .select(
      "started_at, workout_exercises(sets(weight_kg, reps))"
    )
    .gte("started_at", since)
    .not("ended_at", "is", null);

  const weeklyVol = Array.from({ length: 8 }, () => ({ volume: 0, sets: 0 }));
  const labels = Array.from({ length: 8 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (7 - i) * 7);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  });

  if (data) {
    for (const w of data) {
      const daysAgo = Math.floor(
        (Date.now() - new Date(w.started_at).getTime()) / DAY_MS
      );
      const weeksAgo = Math.floor(daysAgo / 7);
      const idx = 7 - weeksAgo;
      if (idx < 0 || idx > 7) continue;
      for (const we of w.workout_exercises ?? []) {
        for (const s of we.sets ?? []) {
          if (s.weight_kg != null && s.reps != null) {
            weeklyVol[idx].volume += Number(s.weight_kg) * s.reps;
            weeklyVol[idx].sets++;
          }
        }
      }
    }
  }

  const avgPerWeek = weeklyVol.map((w) =>
    w.sets === 0 ? 0 : Math.round(w.volume / w.sets)
  );
  return { labels, avgPerWeek };
}
