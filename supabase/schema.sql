-- Gym Dome schema
-- Paste this entire file into the Supabase SQL editor and run it once.
-- Safe to re-run: every CREATE uses IF NOT EXISTS / OR REPLACE.

-- ─── Tables ───────────────────────────────────────────────

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  streak_count int default 0,
  created_at timestamptz default now()
);

create table if not exists public.exercises (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  muscle_group text not null
    check (muscle_group in ('chest','back','legs','shoulders','arms','core')),
  equipment text
    check (equipment in ('barbell','dumbbell','cable','bodyweight','machine'))
);

create table if not exists public.workouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  started_at timestamptz not null,
  ended_at timestamptz,
  duration_minutes int,
  notes text,
  created_at timestamptz default now()
);

create index if not exists workouts_user_id_started_at_idx
  on public.workouts (user_id, started_at desc);

create table if not exists public.workout_exercises (
  id uuid primary key default gen_random_uuid(),
  workout_id uuid references public.workouts(id) on delete cascade not null,
  exercise_id uuid references public.exercises(id) not null,
  order_index int not null
);

create index if not exists workout_exercises_workout_id_idx
  on public.workout_exercises (workout_id);

create table if not exists public.sets (
  id uuid primary key default gen_random_uuid(),
  workout_exercise_id uuid references public.workout_exercises(id) on delete cascade not null,
  set_number int not null,
  weight_kg numeric,
  reps int,
  completed boolean default false,
  unique (workout_exercise_id, set_number)
);

-- ─── Auto-create profile on signup ───────────────────────

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── Row Level Security ──────────────────────────────────

alter table public.profiles enable row level security;
alter table public.exercises enable row level security;
alter table public.workouts enable row level security;
alter table public.workout_exercises enable row level security;
alter table public.sets enable row level security;

-- profiles: own row only
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

-- exercises: readable by any authenticated user, no writes from client
drop policy if exists "exercises_select_authenticated" on public.exercises;
create policy "exercises_select_authenticated" on public.exercises
  for select using (auth.role() = 'authenticated');

-- workouts: own rows only
drop policy if exists "workouts_select_own" on public.workouts;
create policy "workouts_select_own" on public.workouts
  for select using (auth.uid() = user_id);

drop policy if exists "workouts_insert_own" on public.workouts;
create policy "workouts_insert_own" on public.workouts
  for insert with check (auth.uid() = user_id);

drop policy if exists "workouts_update_own" on public.workouts;
create policy "workouts_update_own" on public.workouts
  for update using (auth.uid() = user_id);

drop policy if exists "workouts_delete_own" on public.workouts;
create policy "workouts_delete_own" on public.workouts
  for delete using (auth.uid() = user_id);

-- workout_exercises: scoped via parent workout
drop policy if exists "workout_exercises_select_own" on public.workout_exercises;
create policy "workout_exercises_select_own" on public.workout_exercises
  for select using (
    exists (
      select 1 from public.workouts w
      where w.id = workout_id and w.user_id = auth.uid()
    )
  );

drop policy if exists "workout_exercises_insert_own" on public.workout_exercises;
create policy "workout_exercises_insert_own" on public.workout_exercises
  for insert with check (
    exists (
      select 1 from public.workouts w
      where w.id = workout_id and w.user_id = auth.uid()
    )
  );

drop policy if exists "workout_exercises_update_own" on public.workout_exercises;
create policy "workout_exercises_update_own" on public.workout_exercises
  for update using (
    exists (
      select 1 from public.workouts w
      where w.id = workout_id and w.user_id = auth.uid()
    )
  );

drop policy if exists "workout_exercises_delete_own" on public.workout_exercises;
create policy "workout_exercises_delete_own" on public.workout_exercises
  for delete using (
    exists (
      select 1 from public.workouts w
      where w.id = workout_id and w.user_id = auth.uid()
    )
  );

-- sets: scoped via parent workout_exercise → workout → user
drop policy if exists "sets_select_own" on public.sets;
create policy "sets_select_own" on public.sets
  for select using (
    exists (
      select 1 from public.workout_exercises we
      join public.workouts w on w.id = we.workout_id
      where we.id = workout_exercise_id and w.user_id = auth.uid()
    )
  );

drop policy if exists "sets_insert_own" on public.sets;
create policy "sets_insert_own" on public.sets
  for insert with check (
    exists (
      select 1 from public.workout_exercises we
      join public.workouts w on w.id = we.workout_id
      where we.id = workout_exercise_id and w.user_id = auth.uid()
    )
  );

drop policy if exists "sets_update_own" on public.sets;
create policy "sets_update_own" on public.sets
  for update using (
    exists (
      select 1 from public.workout_exercises we
      join public.workouts w on w.id = we.workout_id
      where we.id = workout_exercise_id and w.user_id = auth.uid()
    )
  );

drop policy if exists "sets_delete_own" on public.sets;
create policy "sets_delete_own" on public.sets
  for delete using (
    exists (
      select 1 from public.workout_exercises we
      join public.workouts w on w.id = we.workout_id
      where we.id = workout_exercise_id and w.user_id = auth.uid()
    )
  );

-- ─── Seed exercises (idempotent — only inserts if name doesn't exist) ───

insert into public.exercises (name, muscle_group, equipment) values
  ('Bench Press',            'chest',     'barbell'),
  ('Incline Dumbbell Press', 'chest',     'dumbbell'),
  ('Cable Fly',              'chest',     'cable'),
  ('Push-Up',                'chest',     'bodyweight'),
  ('Dips',                   'chest',     'bodyweight'),
  ('Pull-Up',                'back',      'bodyweight'),
  ('Lat Pulldown',           'back',      'cable'),
  ('Bent-Over Row',          'back',      'barbell'),
  ('Seated Cable Row',       'back',      'cable'),
  ('Deadlift',               'back',      'barbell'),
  ('Back Squat',             'legs',      'barbell'),
  ('Romanian Deadlift',      'legs',      'barbell'),
  ('Leg Press',              'legs',      'machine'),
  ('Leg Curl',               'legs',      'machine'),
  ('Standing Calf Raise',    'legs',      'machine'),
  ('Overhead Press',         'shoulders', 'barbell'),
  ('Lateral Raise',          'shoulders', 'dumbbell'),
  ('Front Raise',            'shoulders', 'dumbbell'),
  ('Face Pull',              'shoulders', 'cable'),
  ('Barbell Curl',           'arms',      'barbell'),
  ('Dumbbell Curl',          'arms',      'dumbbell'),
  ('Tricep Pushdown',        'arms',      'cable'),
  ('Skull Crusher',          'arms',      'barbell'),
  ('Plank',                  'core',      'bodyweight'),
  ('Hanging Leg Raise',      'core',      'bodyweight'),
  ('Russian Twist',          'core',      'dumbbell')
on conflict do nothing;
