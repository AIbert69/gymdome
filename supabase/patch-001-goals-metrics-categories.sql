-- Patch 001 — adds goal/body fields to profiles, category to workouts,
-- and a nutrition_entries table. Idempotent (safe to re-run).
--
-- Run in: Supabase Dashboard → SQL Editor → New query → paste → Run.

-- 1. Profiles: goals + body metrics
alter table public.profiles
  add column if not exists weekly_workout_goal int default 4,
  add column if not exists daily_calorie_goal int default 2000,
  add column if not exists body_weight_kg numeric,
  add column if not exists height_cm numeric;

-- 2. Workouts: category (Strength / Hypertrophy / Endurance)
alter table public.workouts
  add column if not exists category text
    check (category in ('Strength','Hypertrophy','Endurance'));

-- 3. Nutrition entries (one row per logged meal/snack)
create table if not exists public.nutrition_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  consumed_at timestamptz not null default now(),
  label text,
  calories int not null,
  protein_g numeric,
  carbs_g numeric,
  fat_g numeric
);

create index if not exists nutrition_entries_user_consumed_idx
  on public.nutrition_entries (user_id, consumed_at desc);

alter table public.nutrition_entries enable row level security;

drop policy if exists "nutrition_select_own" on public.nutrition_entries;
create policy "nutrition_select_own" on public.nutrition_entries
  for select using (auth.uid() = user_id);

drop policy if exists "nutrition_insert_own" on public.nutrition_entries;
create policy "nutrition_insert_own" on public.nutrition_entries
  for insert with check (auth.uid() = user_id);

drop policy if exists "nutrition_update_own" on public.nutrition_entries;
create policy "nutrition_update_own" on public.nutrition_entries
  for update using (auth.uid() = user_id);

drop policy if exists "nutrition_delete_own" on public.nutrition_entries;
create policy "nutrition_delete_own" on public.nutrition_entries
  for delete using (auth.uid() = user_id);

-- 4. Backfill profiles for users that pre-date the trigger
insert into public.profiles (id, name)
select id, split_part(email, '@', 1)
from auth.users
on conflict (id) do nothing;
