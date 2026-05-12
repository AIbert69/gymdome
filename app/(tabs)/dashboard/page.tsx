import Link from "next/link";
import Image from "next/image";
import {
  BookmarkIcon,
  ChevronRightIcon,
  CrossedDumbbellsIcon,
  CrosshairIcon,
  FlameIcon,
  PlusIcon,
  StopwatchIcon,
  TargetIcon,
  TrendUpIcon,
  BicepIcon,
} from "@/components/gym-icons";
import { HeroArt } from "@/components/hero-art";
import { RingProgress } from "@/components/ring-progress";
import { StatusBar } from "@/components/status-bar";
import {
  getCaloriesToday,
  getDayStreak,
  getMuscleFocus,
  getProgressAndConsistency,
  getRecentWorkout,
  getStrengthDelta,
  getWeekSummary,
} from "@/lib/queries";

const formatNumber = (n: number) =>
  new Intl.NumberFormat("en-US").format(n);

export default async function DashboardPage() {
  const [
    weekSummary,
    recentWorkout,
    muscleFocus,
    streak,
    strengthDelta,
    progress,
    calories,
  ] = await Promise.all([
    getWeekSummary(),
    getRecentWorkout(),
    getMuscleFocus(),
    getDayStreak(),
    getStrengthDelta(),
    getProgressAndConsistency(),
    getCaloriesToday(),
  ]);

  const caloriesPercent =
    calories.goal > 0
      ? Math.round((calories.consumed / calories.goal) * 100)
      : 0;
  const strengthFill = Math.min(
    100,
    Math.max(0, 50 + (strengthDelta ?? 0) * 2)
  );

  return (
    <>
      <StatusBar />
      <main className="pb-32">
        <HeroArt streak={streak} />

        {/* THIS WEEK SUMMARY */}
        <div className="px-4 -mt-2.5">
          <SectionCard>
            <SectionHead label="THIS WEEK SUMMARY" action="View All" href="/progress" />
            <div className="grid grid-cols-[1fr_1px_1fr_1px_1fr] items-center gap-2">
              <Stat
                icon={<CrossedDumbbellsIcon size={34} />}
                value={String(weekSummary.workouts)}
                label="WORKOUTS"
              />
              <span className="block h-14 w-px bg-[var(--divider)]" />
              <Stat
                icon={<TargetIcon size={34} />}
                value={formatNumber(weekSummary.kgLifted)}
                label="KG LIFTED"
              />
              <span className="block h-14 w-px bg-[var(--divider)]" />
              <Stat
                icon={<StopwatchIcon size={34} />}
                value={weekSummary.durationLabel}
                label="DURATION"
              />
            </div>
          </SectionCard>
        </div>

        {/* 4 stat tiles — all real now */}
        <div className="px-4 pt-3.5 grid grid-cols-4 gap-2">
          <StatTile
            icon={<TrendUpIcon size={22} />}
            label="PROGRESS"
            value={`${progress.progressPct}%`}
            sub={`goal ${progress.weeklyGoal}/wk`}
            pct={progress.progressPct}
          />
          <StatTile
            icon={<FlameIcon size={22} />}
            label="CALORIES"
            value={
              <>
                {formatNumber(calories.consumed)}{" "}
                <span className="text-[11px] font-bold text-primary">KCAL</span>
              </>
            }
            sub={`of ${formatNumber(calories.goal)}`}
            pct={caloriesPercent}
          />
          <StatTile
            icon={<BicepIcon size={22} />}
            label="STRENGTH"
            value={
              strengthDelta >= 0 ? `+${strengthDelta}%` : `${strengthDelta}%`
            }
            sub="vs last month"
            pct={strengthFill}
          />
          <StatTile
            icon={<CrosshairIcon size={22} />}
            label="CONSISTENCY"
            value={`${progress.consistencyPct}%`}
            sub="last 4 wks"
            pct={progress.consistencyPct}
          />
        </div>

        {/* MUSCLE FOCUS — real */}
        <div className="px-4 pt-3.5">
          <SectionCard>
            <SectionHead
              label="MUSCLE FOCUS"
              action="View Details"
              href="/progress"
            />
            <div className="grid grid-cols-[105px_130px_1fr] items-center gap-2">
              <Image
                src="/muscle-focus.png"
                alt=""
                width={1049}
                height={1304}
                className="w-full object-contain"
              />
              <RingProgress
                percent={muscleFocus.weeklyProgress}
                size={120}
                strokeWidth={11}
                color="#FF1F2D"
                trackColor="rgba(255,255,255,0.06)"
              >
                <span className="text-[36px] font-bold tracking-[-0.5px] leading-none text-white">
                  {muscleFocus.weeklyProgress}%
                </span>
                <span className="mt-1.5 text-[11px] font-semibold tracking-[1.2px] text-muted-foreground">
                  WEEKLY PROGRESS
                </span>
              </RingProgress>
              <div className="flex flex-col gap-1.5 text-[13px] font-semibold">
                {muscleFocus.groups.map((g) => (
                  <div
                    key={g.name}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="h-[5px] w-[5px] rounded-full bg-primary" />
                      <span className="text-white">{g.name}</span>
                    </div>
                    <span className="text-white tabular-nums">
                      {g.percent}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>
        </div>

        {/* RECENT WORKOUT */}
        <div className="px-4 pt-3.5">
          <SectionCard>
            <SectionHead label="RECENT WORKOUT" action="View All" href="/workouts" />
            {recentWorkout ? (
              <Link
                href={`/workouts/${recentWorkout.id}`}
                className="flex items-center gap-3.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-lg"
              >
                <div className="grid h-[50px] w-[50px] place-items-center rounded-[14px] bg-primary/[0.12]">
                  <BookmarkIcon size={22} />
                </div>
                <div className="flex-1">
                  <div className="text-[18px] font-bold text-white">
                    {recentWorkout.name}
                  </div>
                  {recentWorkout.muscleGroups.length > 0 && (
                    <div className="mt-0.5 text-[13px] text-muted-foreground">
                      {recentWorkout.muscleGroups.join(" • ")}
                    </div>
                  )}
                  <div className="text-[13px] text-muted-foreground">
                    {recentWorkout.when} • {recentWorkout.duration}
                  </div>
                </div>
                <span className="grid h-8 w-8 place-items-center rounded-full bg-primary/[0.12]">
                  <ChevronRightIcon size={14} />
                </span>
              </Link>
            ) : (
              <p className="text-[13px] text-muted-foreground">
                No workouts logged yet. Tap{" "}
                <span className="font-semibold text-primary">
                  Start New Workout
                </span>{" "}
                to log your first.
              </p>
            )}
          </SectionCard>
        </div>

        {/* Start new workout */}
        <div className="px-4 pt-3.5">
          <Link
            href="/workouts/new"
            className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl border-[1.5px] border-primary bg-transparent text-primary transition-colors hover:bg-primary/[0.06] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            <PlusIcon size={20} />
            <span className="text-[17px] font-semibold">Start New Workout</span>
          </Link>
        </div>
      </main>
    </>
  );
}

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[18px] border border-[rgba(255,255,255,0.06)] bg-card p-[18px]">
      {children}
    </div>
  );
}

function SectionHead({
  label,
  action,
  href,
}: {
  label: string;
  action: string;
  href: string;
}) {
  return (
    <div className="mb-3.5 flex items-center justify-between">
      <h2 className="text-[13px] font-bold tracking-[1.6px] text-white">
        {label}
      </h2>
      <Link
        href={href}
        className="flex items-center gap-1 text-[13px] font-semibold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
      >
        {action} <ChevronRightIcon size={13} />
      </Link>
    </div>
  );
}

function Stat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="mb-0.5">{icon}</div>
      <div className="text-[22px] font-extrabold tracking-[-0.5px] text-white">
        {value}
      </div>
      <div className="text-[10px] font-semibold tracking-[1.2px] text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

function StatTile({
  icon,
  label,
  value,
  sub,
  pct,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  sub?: string;
  pct: number;
}) {
  return (
    <div className="flex min-h-[130px] flex-col items-center justify-between rounded-2xl border border-[rgba(255,255,255,0.06)] bg-card px-2.5 pt-3 pb-3.5">
      <div className="grid h-[38px] w-[38px] place-items-center rounded-full bg-primary/[0.08]">
        {icon}
      </div>
      <div className="mt-1 text-center">
        <div className="text-[10px] font-bold tracking-[1.2px] text-muted-foreground">
          {label}
        </div>
        <div className="mt-0.5 text-[18px] font-extrabold tracking-[-0.4px] text-white">
          {value}
        </div>
        {sub && (
          <div className="mt-0.5 text-[9px] text-muted-foreground">{sub}</div>
        )}
      </div>
      <div className="mt-1 w-full">
        <div className="h-1 overflow-hidden rounded bg-[var(--red-track)]">
          <div
            className="h-full rounded bg-primary transition-[width] duration-700"
            style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
          />
        </div>
      </div>
    </div>
  );
}
