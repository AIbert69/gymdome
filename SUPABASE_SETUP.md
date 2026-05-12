# Supabase Setup & End-to-End Test

## 1. Environment

Heads up — `.env.local` wasn't present when I checked. Create it at the project root with these two vars (from **Supabase Dashboard → Project Settings → API**):

```
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-public-key>
```

There's a template at [.env.local.example](.env.local.example) you can copy.

After creating `.env.local`, restart `npm run dev` — Next.js only reads env vars at startup.

## 2. Database schema

Open **Supabase Dashboard → SQL Editor → New query**, paste the entire contents of [supabase/schema.sql](supabase/schema.sql), and click **Run**.

### Patch 001 (after the base schema)

Real Muscle Focus / streak / strength / consistency / calories / Nutrition / workout categories all depend on **`patch-001-goals-metrics-categories.sql`** — open it, paste into the SQL Editor, and Run. Adds:

- `profiles.weekly_workout_goal`, `daily_calorie_goal`, `body_weight_kg`, `height_cm`
- `workouts.category` (`Strength` / `Hypertrophy` / `Endurance`)
- `nutrition_entries` table + RLS
- Backfills `profiles` rows for anyone who signed up before the trigger existed

The script is idempotent (safe to re-run). It creates:

- `profiles`, `exercises`, `workouts`, `workout_exercises`, `sets` tables
- Indexes for fast `workouts` lookups
- A trigger `on_auth_user_created` that auto-creates a `profiles` row when someone signs up
- RLS policies on every table (users can only read/write their own data; `exercises` is read-only for any authenticated user)
- 26 seed exercises across all 6 muscle groups

Verify in **Database → Tables**: you should see all five tables and `exercises` should have 26 rows.

## 3. Enable email auth

**Supabase Dashboard → Authentication → Providers → Email**

- Make sure **Enable Email provider** is on
- For local testing convenience: **Authentication → Providers → Email → Confirm email = OFF** (otherwise you need a verified email before you can log in). Turn it back on for production.

While you're there, check **Authentication → URL Configuration**:

- **Site URL**: `http://localhost:3000` (for dev). Add your production URL later.

## 4. End-to-end test

Start the app:

```powershell
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you should be redirected to `/login` (the middleware blocks unauthenticated access to everything except `/login` and `/auth/*`).

### Sign up

1. Click **Sign Up**
2. Enter a name (optional), email, and a 6+ char password
3. Submit — you should land on `/dashboard` with all KPIs reading **0** / **0 KG** / **0h** and "No workouts logged yet" in Recent Workout

### Log a workout

1. Tap **Start New Workout** (Dashboard or Workouts tab)
2. Type a name (e.g., "Push Day"), tap a few exercises (e.g., Bench Press, Incline Dumbbell Press, Tricep Pushdown), tap **Start Workout (3)**
3. You're on `/workouts/new/log/<id>` — three empty set rows per exercise
4. Fill in **Weight** + **Reps** for a few sets — when you tab/click out of a row, you'll see the red status dot light up (= persisted)
5. Tap **+ Add set** under any exercise to log a 4th
6. Tap **Finish Workout** → summary screen with duration, sets completed, total volume
7. Tap **Save Workout** → back at `/dashboard`

### Verify persistence

- **Dashboard** — `THIS WEEK SUMMARY` should show 1 workout, real kg lifted (weight × reps summed across all completed sets), and the live duration. `RECENT WORKOUT` should show your workout's name, muscle groups, and "Today • Nm"
- **Workouts** — your workout should be the first item in the list
- **Progress** — the **VOLUME LIFTED** number should match. Today's bar should be the tallest in the 7-day chart
- Tap the workout in the list → `/workouts/<id>` should show every exercise and every set you logged
- **Profile** tab — your email + name show, **Sign Out** button works (returns you to `/login`)

### Reload behavior

- Reload `/dashboard` — data should re-appear (it's coming from Supabase, not local state)
- Sign out → sign back in with the same email/password — your workouts are still there
- Open a private window → try `/dashboard` directly → middleware redirects to `/login`

### Inspecting in Supabase

Hit **Table Editor** in Supabase Dashboard:

- `auth.users` — 1 row (you)
- `public.profiles` — 1 row (auto-created by the trigger)
- `public.workouts` — 1 row, `ended_at` populated, `duration_minutes` populated
- `public.workout_exercises` — 1 row per exercise you picked
- `public.sets` — 1 row per set you filled in, `completed: true` for the rows with both weight + reps

If any of these are empty after a logged workout, check **Logs → Postgres logs** for RLS denials (look for `permission denied`).

## 5. What's still mock

Per the spec, the Muscle Focus card and the Strength / Calories / Progress / Consistency tiles still use the mock data from [lib/mock-data.ts](lib/mock-data.ts). Wiring those up is in the next round — they need:

- **Muscle Focus** — aggregate sets-per-muscle-group over a configurable window, compute share of total volume → ring + group breakdown
- **Strength** — average weight×reps per workout, compared to last month's average
- **Calories** — calories burned model (requires user body data — needs Profile fields)
- **Progress / Consistency** — workout-frequency goals (needs a Profile setting)

## 6. Known cosmetic warning

`middleware.ts` triggers a Next.js 16 deprecation warning: *"The 'middleware' file convention is deprecated. Please use 'proxy' instead."* The middleware still works; rename to `proxy.ts` (same contents) to silence the warning when you have a moment.
