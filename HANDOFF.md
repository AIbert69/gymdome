# Gym Dome — Design Handoff

A working web demo of a mobile-first fitness tracker. Dashboard + Workouts are built; the other three tabs are stubs. All data is mocked inline — no backend, no auth, no persistence.

Read alongside:
- [PRODUCT.md](PRODUCT.md) — strategic context (who/what/why)
- [DESIGN.md](DESIGN.md) — visual system (how it looks)

## Run

```powershell
npm install      # if dependencies aren't installed yet
npm run dev      # → http://localhost:3000 → redirects to /dashboard
```

Recommended viewport for development: Chrome DevTools → iPhone 14 Pro (393×852). On desktop the app stays centered at `max-w-[480px]` with black gutters.

> ⚠️ Project lives inside Dropbox. Exclude `node_modules/` and `.next/` from Dropbox Selective Sync to avoid sync churn on every install/HMR.

## Stack

- Next.js 16 (App Router, Turbopack) / React 19 / TypeScript
- Tailwind v4 (CSS-first config in `globals.css`)
- shadcn/ui (`@/components/ui/{button,card}`) — extended for the dark/red palette
- lucide-react — iconography
- framer-motion — RingProgress + MetricCard bar; honors `useReducedMotion`
- recharts — installed, unused after the strength card was folded into the 4-up metric row
- sharp — used only for one-off image processing in `_reference/`

## Routes

| Path | Status | File |
|---|---|---|
| `/` | redirect → `/dashboard` | [app/page.tsx](app/page.tsx) |
| `/dashboard` | ✅ built | [app/(tabs)/dashboard/page.tsx](app/(tabs)/dashboard/page.tsx) |
| `/workouts` | ✅ built (list + filter pills) | [app/(tabs)/workouts/page.tsx](app/(tabs)/workouts/page.tsx) |
| `/workouts/[id]` | ❌ not built — dashboard / list items link here | — |
| `/workouts/new` | ❌ not built — Start CTA links here | — |
| `/progress` | ❌ stub | [app/(tabs)/progress/page.tsx](app/(tabs)/progress/page.tsx) |
| `/nutrition` | ❌ stub | [app/(tabs)/nutrition/page.tsx](app/(tabs)/nutrition/page.tsx) |
| `/profile` | ❌ stub | [app/(tabs)/profile/page.tsx](app/(tabs)/profile/page.tsx) |

Bottom nav lives in [app/(tabs)/layout.tsx](app/(tabs)/layout.tsx). Tab routes inherit it; the root layout doesn't.

## Component inventory

| File | What it is |
|---|---|
| [components/logo.tsx](components/logo.tsx) | GYM DOME mark — uses [public/logo.png](public/logo.png) |
| [components/hero-art.tsx](components/hero-art.tsx) | Full hero bg image, clipped to `aspect-[27/25]` so the iPhone home-indicator chrome at the source PNG's bottom doesn't show |
| [components/bottom-nav.tsx](components/bottom-nav.tsx) | Fixed 5-tab nav, ≥44px tap targets, `aria-current="page"`, red underline above active icon |
| [components/stat-card.tsx](components/stat-card.tsx) | Reusable icon + value + uppercase label — used in This Week Summary's 3-col |
| [components/metric-card.tsx](components/metric-card.tsx) | Icon circle + label + value + animated progress bar — used in the 4-up KPI row |
| [components/ring-progress.tsx](components/ring-progress.tsx) | Framer-motion strokeDashoffset ring. `strokeLinecap="butt"` to avoid the cap-blob artifact at the start of the arc. |
| [components/muscle-map.tsx](components/muscle-map.tsx) | Anatomical PNG ([public/muscle-focus.png](public/muscle-focus.png)) clipped to hide the baked-in title |
| [components/workout-figure.tsx](components/workout-figure.tsx) | 5 stylized red pose silhouettes (push/pull/leg/upper/full). Placeholder fidelity — swap for higher-quality art later. |
| [components/bicep-icon.tsx](components/bicep-icon.tsx) | Custom lucide-style flexed-arm icon for the Strength metric card (lucide has no equivalent) |
| [components/fade-in-section.tsx](components/fade-in-section.tsx) | Currently just a static `<section>` wrapper. Was a framer-motion stagger that fought HMR — pulled. |

## Image assets

| Path | Source | Used by |
|---|---|---|
| [public/hero-bg.png](public/hero-bg.png) | Copied from `_reference/man.png` uncropped | HeroArt |
| [public/logo.png](public/logo.png) | Copied from `_reference/logo.png` | Logo |
| [public/muscle-focus.png](public/muscle-focus.png) | Copied from a reference muscle anatomy image | MuscleMap |
| [public/athlete.png](public/athlete.png) | Earlier cropped athlete (no longer used after the full-bg approach landed) | — |

The `_reference/` folder holds the original screenshots and a `crop-athlete.mjs` one-off sharp script. Safe to delete `_reference/` for production; kept for design iteration history.

## Mock data

All in [lib/mock-data.ts](lib/mock-data.ts). Two top-level exports:

- `dashboardData` — single user, week summary, muscle focus + groups, strength trend, calories, recent workout
- `workouts` — list of 5 workout entries with `category`, `muscles`, `when`, `duration`, `figure` variant
- `workoutCategories` — `["All", "Strength", "Hypertrophy", "Endurance"]`

When wiring a real backend, swap inline imports for `fetch()` / `swr` / `react-query` calls returning the same shapes. The types `WorkoutCategory`, `FigureVariant`, `Workout` are exported.

## Design system snapshot

Tokens defined in [app/globals.css](app/globals.css) via Tailwind v4 `@theme inline`. Forced dark via `<html class="dark">` in [app/layout.tsx](app/layout.tsx).

| Token | Value | Role |
|---|---|---|
| `--background` | `#000000` | Page bg |
| `--card` | `#0a0a0a` | All card bg |
| `--border` | `#1f1f1f` | All card border (default); `#2A2A2A` on hover |
| `--foreground` | `#ffffff` | Primary text |
| `--muted-foreground` | `#6b7280` | Captions, labels, secondary text |
| `--primary` | `#ef4444` | Accent, CTAs, active states, progress |
| `--radius` | `1rem` (16px) | Default; cards use `rounded-2xl` |

Type: Inter via `next/font/google`, weights 400/500/600/700/800.

## Decisions made (don't undo without context)

- **`#000` / `#fff` extremes** — impeccable normally bans these; deliberately kept for the high-contrast performance aesthetic. Documented in [DESIGN.md](DESIGN.md).
- **Identical 4-up metric grid** — parity is the message. The four KPIs (Progress / Calories / Strength / Consistency) get equal visual weight on purpose.
- **3px red side-stripe on the tagline** — mockup-specified; not "I added a border to make it pop."
- **Hero bg includes baked-in status bar / bell / streak** — uses the supplied PNG composite as the single source of those visual elements. Removed the coded `StatusBar` and the coded streak overlay to avoid duplication. Bottom of the image is CSS-clipped (not pre-cropped) so the source PNG stays intact.
- **`fade-in-section` is static** — framer-motion entrance was fragile under HMR (sections froze at opacity 0). The mockup is static; entrance was sugar, not load-bearing.
- **`strokeLinecap="butt"`** on the ring progress — `round` produced a glow-blob at the arc start. Trade-off: end of arc no longer rounded.

## Known open items (ranked)

### High
1. **`/progress`** — empty stub. Mockup 3 right panel shows: volume bar chart (recharts is installed and ready), workouts + duration mini-trends, muscle group breakdown (reuse [MuscleMap](components/muscle-map.tsx) + ring + group list from Dashboard).
2. **`/workouts/[id]`** — currently 404s. Recent Workout card on Dashboard and every list item on Workouts page link here. Needs detail view with exercises (Bench Press / Incline DB Press / Tricep Pushdown rows from mockup 2).
3. **`/workouts/new`** — currently 404s. "Start New Workout" CTA links here on both Dashboard and Workouts.

### Medium
4. **`/nutrition`** stub — no mockup yet
5. **`/profile`** stub — no mockup yet
6. **Workout figure SVGs** — placeholder quality. Swap [workout-figure.tsx](components/workout-figure.tsx) variants for higher-fidelity illustrations when art is available.
7. **Logo PNG** — current asset is thin-outlined white; renders as a subtle mark on the hero. If you want a solid filled mark, replace [public/logo.png](public/logo.png) (size + transparent bg preserved) and no code change needed.

### Low
8. **Bell icon** is baked into the hero image and not interactive. If notifications become real, render an interactive `<button>` over the bell's pixel location, or rebuild the hero with a layered bell.
9. **Empty state for the Workouts filter** is bland — could use an illustration matching the bottom CTA.
10. **Recharts** is in dependencies but unused after the strength chart card came out. If `/progress` charts don't need it either, remove from `package.json`.

## Critique log (full review history)

A full design-critique report against mockup 1 lives in chat history (not committed). Key items:

- Whole-card tappability ✅ landed
- Bell tap target ✅ resolved by baking into image (no longer a coded element)
- Metric icon container visibility ✅ landed (raised border + bg opacity)
- Hero athlete photo ✅ landed (real image, not placeholder)
- Muscle map ✅ landed (real anatomical art)

## Accessibility checklist (audit pass)

- Color contrast white-on-`#000` and white-on-`#0A0A0A` exceeds WCAG AAA (15:1+)
- `focus-visible:ring-2 ring-primary ring-offset-2 ring-offset-black` on every interactive surface
- Bottom nav: `aria-label` on each link, `aria-current="page"` on the active route
- Workouts filter: `role="tablist"` / `role="tab"` / `aria-selected`
- Cards have descriptive `aria-label` (e.g., `"Open recent workout: Push Day"`)
- Kebab/more buttons have `aria-label` and `preventDefault` so they don't trigger the parent card link
- `useReducedMotion()` honored on ring + bar animations
- Tap targets ≥ 44×44 on nav; kebab/CTA buttons all ≥ 36 with visible focus ring
- All decorative images have empty `alt=""` or `aria-hidden`; informational images have descriptive alt

Outstanding a11y: real keyboard traversal sweep, screen reader pass (NVDA / VoiceOver), check `prefers-color-scheme: light` if light mode is ever added.

## How to extend

**Add a new tab route:** create `app/(tabs)/<route>/page.tsx` and add the route + icon to the `tabs` array in [components/bottom-nav.tsx](components/bottom-nav.tsx).

**Add a new card to Dashboard:** wrap in a `<FadeInSection className="mx-4 ...">`; reuse the card pattern `rounded-2xl border border-[#1F1F1F] bg-[#0A0A0A] p-4 transition-colors hover:border-[#2A2A2A]`. If the card drills into a detail screen, swap the wrapper for a `<Link>` and include the focus-ring classes.

**Add a new workout category:** extend the `WorkoutCategory` union in [lib/mock-data.ts](lib/mock-data.ts); the filter pills render from `workoutCategories` automatically.

**Add a new figure variant:** extend `FigureVariant` and add a case in [components/workout-figure.tsx](components/workout-figure.tsx)'s switch.

## Contact / context

This handoff was produced after a multi-pass design session including the `frontend-mastery`, `impeccable`, and `Design Critique Agent` skills. PRODUCT.md and DESIGN.md were seeded by Claude from the conversation context and reflect product intent as of the last working session.
