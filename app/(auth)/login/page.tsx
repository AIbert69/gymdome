"use client";

import { Suspense, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { login, signup } from "./actions";

type Mode = "login" | "signup";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  );
}

function LoginInner() {
  const [mode, setMode] = useState<Mode>("login");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const search = useSearchParams();
  const redirectTo = search.get("redirect") ?? "/dashboard";

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result =
        mode === "login" ? await login(formData) : await signup(formData);
      if (result?.error) setError(result.error);
    });
  }

  const heading = mode === "login" ? "Welcome back" : "Create your account";
  const submitLabel = mode === "login" ? "Sign In" : "Create Account";
  const altPrompt =
    mode === "login"
      ? "Don't have an account?"
      : "Already have an account?";
  const altLabel = mode === "login" ? "Sign Up" : "Sign In";

  return (
    <div className="mx-auto w-full max-w-sm">
      {/* Brand */}
      <div className="mb-10 flex flex-col items-center text-center">
        <div className="mb-2 text-[34px] font-extrabold tracking-[-1px] text-white">
          GYM DOME
        </div>
        <p className="text-sm text-muted-foreground">
          Track smarter. Train harder.{" "}
          <span className="font-semibold text-primary">Be better.</span>
        </p>
      </div>

      <h1 className="mb-6 text-[26px] font-extrabold tracking-[-0.5px] text-white">
        {heading}
      </h1>

      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <input type="hidden" name="redirect" value={redirectTo} />

        {mode === "signup" && (
          <Field label="Name (optional)">
            <input
              name="name"
              type="text"
              autoComplete="name"
              className={inputCls}
              placeholder="Athlete"
            />
          </Field>
        )}

        <Field label="Email">
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className={inputCls}
            placeholder="you@example.com"
          />
        </Field>

        <Field label="Password">
          <input
            name="password"
            type="password"
            required
            minLength={6}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            className={inputCls}
            placeholder={mode === "login" ? "Your password" : "At least 6 characters"}
          />
        </Field>

        {error && (
          <div
            role="alert"
            className="rounded-lg border border-primary/40 bg-primary/10 px-3 py-2 text-sm text-primary"
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={pending}
          className="mt-3 flex h-12 w-full items-center justify-center rounded-2xl bg-primary text-[17px] font-semibold text-white transition-opacity hover:opacity-90 active:scale-[0.99] disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          {pending ? "…" : submitLabel}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {altPrompt}{" "}
        <button
          type="button"
          onClick={() => {
            setError(null);
            setMode(mode === "login" ? "signup" : "login");
          }}
          className="font-semibold text-primary underline-offset-2 hover:underline focus-visible:outline-none focus-visible:underline"
        >
          {altLabel}
        </button>
      </p>
    </div>
  );
}

const inputCls =
  "h-12 w-full rounded-xl border border-[rgba(255,255,255,0.06)] bg-card px-3.5 text-[15px] text-white placeholder:text-[#5C5C5C] focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] font-semibold tracking-[1.4px] text-muted-foreground uppercase">
        {label}
      </span>
      {children}
    </label>
  );
}
