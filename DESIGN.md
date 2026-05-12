# DESIGN.md — Gym Dome

Generated from observed code state. Source of truth for tokens lives in [app/globals.css](app/globals.css).

## Theme

**Dark, always.** No light-mode toggle. `<html class="dark">` is forced. `color-scheme: dark` set on `:root`. The dashboard runs inside a 480px-max centered mobile frame with pure black gutters on desktop.

## Color tokens

| Role | Hex | Tailwind |
|---|---|---|
| Background | `#000000` | `bg-background` |
| Card | `#0a0a0a` | `bg-card`, `bg-[#0A0A0A]` |
| Border (subtle) | `#1f1f1f` | `border-border`, `border-[#1F1F1F]` |
| Foreground (primary text) | `#ffffff` | `text-foreground`, `text-white` |
| Muted foreground (captions, labels) | `#6b7280` | `text-muted-foreground` |
| Primary (accent, CTAs, active states, progress) | `#ef4444` | `text-primary`, `bg-primary` |
| Primary foreground (text on red) | `#ffffff` | `text-primary-foreground` |

Note on the impeccable rule "no `#000`/`#fff`": deliberately violated for brand. The mockup and ICP both call for absolute black + pure white — softening either would dilute the high-contrast performance aesthetic.

## Typography

- **Family**: Inter (`next/font/google`), weights 400/500/600/700/800, exposed as `--font-sans`.
- **Scale** (used in dashboard):
  - Display heading (Athlete name): `text-[44px] font-extrabold tracking-tight leading-[0.95]`
  - Metric value: `text-2xl font-bold` (24px)
  - Card label (uppercase): `text-xs font-semibold tracking-[0.22em]`
  - Body: `text-sm` / `text-base`
  - Caption: `text-[10–11px]`
- **Numerals**: `tabular-nums` on streak, KG lifted, percentages.

## Layout

- **Mobile frame**: `mx-auto max-w-[480px]` on the root `<body>` wrapper in [app/layout.tsx](app/layout.tsx).
- **Section spacing**: vertical `space-y-4` (16px) between dashboard sections.
- **Section padding**: most sections live in cards with `p-4` (16px). The hero is full-bleed (no horizontal padding) so the athlete photo touches the right edge. Other sections wear `mx-4` to recreate the inset since `main` has no horizontal padding.
- **Radius**: cards `rounded-2xl` (16px), icon tiles `rounded-lg` (8px), pill/CTA `rounded-2xl`. Single radius family; no mix of styles.
- **Borders**: 1px `#1F1F1F` on cards. Hover: `#2A2A2A`. Active/important cards: `border-primary/30`.

## Hero

The hero is the dashboard's signature. Full-bleed photographic background ([public/hero-bg.png](public/hero-bg.png)) with red rotating glow rings and a "12 DAY STREAK" counter baked into the source image. Overlays on top of it: GYM DOME logo (top-left), welcome line, big "Athlete" heading, and a 3px red vertical bar accent on the tagline. The bottom of the image is clipped via `aspect-[27/25] overflow-hidden` to remove the iPhone home-indicator chrome without modifying the source file.

## Components in use

- [Card pattern](app/(tabs)/dashboard/page.tsx): `rounded-2xl border border-[#1F1F1F] bg-[#0A0A0A] p-4` — used for week summary, muscle focus, recent workout
- [StatCard](components/stat-card.tsx) — icon + value + uppercase label, 3 across in week summary
- [MetricCard](components/metric-card.tsx) — circular icon, label, value, animated progress bar, 4 across
- [RingProgress](components/ring-progress.tsx) — framer-motion strokeDashoffset animation with `butt` line cap, optional drop-shadow glow
- [MuscleMap](components/muscle-map.tsx) — anatomical PNG anchored top, container clips the baked-in title
- [BottomNav](components/bottom-nav.tsx) — fixed 5-tab nav with red underline above the active icon
- [Logo](components/logo.tsx) — uploaded outlined PNG mark
- [HeroArt](components/hero-art.tsx) — full hero image with aspect-ratio clip

## Iconography

- [lucide-react](https://lucide.dev) at default stroke (2.0–2.25), red `#EF4444` fill or stroke
- Custom [BicepIcon](components/bicep-icon.tsx) for Strength card (lucide has no flexed-arm icon)
- Dome+dumbbell mark is a PNG asset, not iconography

## Motion

- Ring progress: 1.2s `easeOut` strokeDashoffset animation on mount
- Metric card progress bar: 1.0s `easeOut` width animation, delayed 0.2s
- Hero rotating rings: continuous `linear` rotation (decorative, baked into image now)
- No section-stagger entrance — was tried, was fragile under HMR, removed in favor of static render

## Anti-patterns flagged but kept (with rationale)

- **Identical 4-up card grid**: impeccable would normally flag this. Kept because the metrics are meant to be at parity — visual sameness is the message ("here are your 4 weekly stats"). Differentiating them by size/treatment would imply unequal weighting.
- **Side-stripe accent on tagline (3px red bar)**: matches mockup exactly. Kept as a deliberate design choice, not a default "I added a border to make it pop."
- **Hero-metric template**: the dashboard *is* a hero-metric layout. The fitness category calls for it.

## What this design *won't* do

- No glassmorphism (`backdrop-blur` only on the fixed bottom nav, intentional for legibility on scroll)
- No gradient text
- No emoji as functional icons
- No modal dialogs (drill into a screen instead)
- No purple, teal, mint, sage, or "calm" colors
