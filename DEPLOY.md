# Deploying Gym Dome to Vercel

The local build is green (verify any time with `npm run build`). Now ship it.

## 0. Pre-flight

- `.env.local` exists locally but is gitignored (do not commit).
- `API.txt`, `_reference/`, `gymdome/` are gitignored.
- `npm run build` succeeds with no errors.
- The proxy at `proxy.ts` is the Next 16 modern name (used to be `middleware.ts`).
- TypeScript build-time errors are intentionally suppressed in `next.config.ts` (the hand-rolled `Database` type doesn't declare foreign-key `Relationships`, so postgrest-js nested-select inference returns `never`). Dev-server type checking still runs.

## 1. Push to GitHub

```powershell
# from C:\Users\Albert\Mizuno Dropbox\albert mizuno\Gym Dome\app
gh repo create gym-dome --private --source=. --push   # if you have gh CLI
```

Or manually:

```powershell
# Create an empty private repo on github.com first, then:
git remote add origin https://github.com/<your-username>/gym-dome.git
git branch -M main
git push -u origin main
```

## 2. Vercel — import the project

1. Go to https://vercel.com/new
2. Click **Import** next to `gym-dome`
3. Framework preset auto-detects as **Next.js**. Leave everything default.
4. **Don't deploy yet.** Expand **Environment Variables** and add both:

   | Name | Value |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://kxgkbknnkyeayefvhvwz.supabase.co` |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_WDxLqNPXpurfTKq_IeamyQ_0wZjkjfp` |

   Make sure both are scoped to **Production, Preview, Development**.
5. Click **Deploy**. First build is ~90s.

## 3. Supabase — tell auth about the production URL

Vercel gives you a URL like `https://gym-dome-<hash>.vercel.app`. Supabase needs to allow it as an OAuth redirect target.

1. https://supabase.com/dashboard/project/kxgkbknnkyeayefvhvwz/auth/url-configuration
2. **Site URL**: change to your Vercel URL (production).
3. **Additional Redirect URLs**: add both:
   - `https://gym-dome-<hash>.vercel.app/**`
   - `https://*.vercel.app/**` *(covers every preview build)*
4. Save.

## 4. Supabase — turn email confirmation back on

For dev we disabled it so signup → instant login. For production, you almost certainly want confirmation:

1. https://supabase.com/dashboard/project/kxgkbknnkyeayefvhvwz/auth/providers
2. Email provider → **Confirm email** → **ON**.
3. Save.

## 5. Sanity test

Open the Vercel URL.

- `/` → redirects to `/login`
- Sign up with a new email → check inbox → click the verification link → you're in
- New account dashboard shows zero workouts; tap **Start New Workout** → pick exercises → log sets → finish → save → see real data on dashboard
- Profile → edit weight + goal → save → dashboard PROGRESS tile updates
- Nutrition → log a meal → calorie ring fills

## Common gotchas

- **"Auth session missing"** on a fresh deploy = Site URL still points at localhost. Update step 3.
- **Build fails on Vercel but passes locally** = check the build log for missing env vars. Both `NEXT_PUBLIC_SUPABASE_*` must be set before the first build.
- **Email verification email never arrives** = Supabase free tier rate-limits SMTP. Either re-enable "Confirm email = OFF" for testing, or wire up a real SMTP provider in **Auth → Email Templates → SMTP settings**.
- **Patch-001 not applied** = Profile saves and Nutrition inserts silently no-op. See [SUPABASE_SETUP.md](SUPABASE_SETUP.md) §2.

## After it's live

- **Rotate the secret key.** You pasted it in chat earlier. Supabase Dashboard → Settings → API → "Reset service role key".
- **Generate proper Database types**: `npx supabase gen types typescript --project-id kxgkbknnkyeayefvhvwz > lib/supabase/types.ts` — this fixes the nested-select inference issue and lets me remove `typescript.ignoreBuildErrors` in `next.config.ts`.
- **Custom domain**: Vercel → Project → Settings → Domains → add e.g. `gym.albertmizuno.com`. Then re-add the new URL to Supabase URL Configuration.
