# PRODUCT.md — Gym Dome

## Register

**product** — Gym Dome is an app dashboard / tool surface. Design serves the product (workout tracking), not the other way around. There is no marketing landing in scope; the entry point is `/dashboard`.

## Users & Purpose

Active gym-goers (18–45) who track workouts, calories, strength progression, and adherence. The dashboard is the at-a-glance home: how did this week look, which muscle groups got worked, what was the last session, start the next one. They open it between sets, after a session, or first thing in the morning. They are familiar with fitness apps (Strong, Hevy, Whoop), expect mobile-first interaction, and respond to performance-driven visual language.

## Strategic Principles

1. **Glanceable over comprehensive.** Every section answers a single question at a glance (How active this week? Which muscles? What did I just do?). Detail screens carry the deep data; the dashboard is the index.
2. **Mobile-first, max-width 480px.** The full experience must work on a phone in portrait. Desktop centers the mobile frame on a black bleed.
3. **Performance aesthetic, not corporate health.** This is a bodybuilding/athletic app, not a wellness one. Dark surfaces, strong red accent, photographic hero, anatomical illustrations. Not pastels or "wellness teal."

## Brand Personality

Bold, energetic, performance-focused. Voice is short and imperative: *Track smarter. Train harder. Be better.* Type is bold-extrabold for headlines, condensed/tracked uppercase for section labels, regular for body. Red is reserved for accent, progress, and CTAs — never as a body color.

## Anti-references

- Generic teal/blue SaaS dashboard
- Wellness app pastels (sage, dusty rose, beige)
- Glassmorphism / frosted card stacks
- Cute fitness mascots
- Excessive gamification UI (badges, fireworks, level-up animations)

## Accessibility

- Contrast: white on `#000` and `#0A0A0A` (>15:1, AAA).
- Touch targets: 44×44 minimum, except dense data rows where 32×32 is acceptable.
- Motion is decorative only — must not block content. Honor `prefers-reduced-motion` if added later.
