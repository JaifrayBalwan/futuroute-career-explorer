import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AuthShell } from "@/components/auth/AuthShell";
import {
  AuthDivider,
  Field,
  GoogleSignInButton,
  PasswordInput,
  Spinner,
  inputClass,
  linkClass,
  submitClass,
} from "@/components/auth/fields";
import { Notice } from "@/components/ui-kit";
import { destinationForUser, safeNext, signInError, useUser } from "@/lib/auth";
import { isRememberSession, setRememberSession } from "@/integrations/supabase/rememberStorage";

type Search = { next?: string | undefined };

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    next: typeof s["next"] === "string" ? s["next"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Sign in — Futuroute" },
      {
        name: "description",
        content:
          "Sign in to your Futuroute account to continue your career exploration, comparisons and roadmap.",
      },
      { property: "og:title", content: "Sign in — Futuroute" },
      { property: "og:description", content: "Sign in to continue your career exploration." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { next } = Route.useSearch();
  const nav = useNavigate();
  const { user, loading } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => setRemember(isRememberSession()), []);

  useEffect(() => {
    if (loading || !user) return;
    void destinationForUser(user, next).then((to) => nav({ to, replace: true }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setErr("");
    const emailError = !email.trim()
      ? "Enter your email address."
      : /^\S+@\S+\.\S+$/.test(email.trim())
        ? ""
        : "That doesn't look like a valid email address.";
    const passwordError = password ? "" : "Enter your password.";
    setErrors({ email: emailError, password: passwordError });
    if (emailError || passwordError) return;

    setBusy(true);
    setRememberSession(remember);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setBusy(false);
    if (error) {
      setErr(signInError(error.message));
      return;
    }
    toast.success("Signed in");
    if (data.user)
      void destinationForUser(data.user, next).then((to) => nav({ to, replace: true }));
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to pick up your saved careers, comparisons and roadmap where you left off."
      footer={
        <>
          New to Futuroute?{" "}
          <Link
            to="/register"
            search={{ next: safeNext(next) === "/dashboard" ? undefined : next }}
            className={linkClass}
          >
            Create an account
          </Link>
        </>
      }
    >
      <GoogleSignInButton next={next} onError={setErr} />
      <AuthDivider />
      <form onSubmit={submit} className="grid gap-4" noValidate>
        <Field id="email" label="Email address" error={errors.email}>
          <input
            id="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!!errors.email || undefined}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={inputClass}
            placeholder="you@example.com"
          />
        </Field>
        <Field
          id="password"
          label="Password"
          error={errors.password}
          hint={
            <span className="flex flex-wrap items-center justify-between gap-2">
              <Link to="/forgot-password" className={linkClass}>
                Forgot password?
              </Link>
            </span>
          }
        >
          <PasswordInput
            id="password"
            value={password}
            onChange={setPassword}
            autoComplete="current-password"
            invalid={!!errors.password}
            describedBy={errors.password ? "password-error" : undefined}
          />
        </Field>
        <label className="flex items-start gap-2.5 text-sm text-text-2">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="mt-0.5 size-4 shrink-0 accent-[var(--lavender-bright)]"
          />
          <span>Keep me signed in on this device</span>
        </label>
        {err && <Notice tone="warn">{err}</Notice>}
        <button type="submit" className={submitClass} disabled={busy}>
          {busy ? (
            <>
              <Spinner />
              Signing in…
            </>
          ) : (
            "Sign in"
          )}
        </button>
      </form>
      <p className="mt-5 text-xs text-muted-foreground">
        By signing in you agree to use Futuroute for career exploration. Recommendations are
        indicative and don't guarantee outcomes.
      </p>
    </AuthShell>
  );
}
