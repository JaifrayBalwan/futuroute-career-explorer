import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { MailCheck } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AuthShell } from "@/components/auth/AuthShell";
import {
  AuthDivider,
  Field,
  GoogleSignInButton,
  PasswordInput,
  Spinner,
  StrengthMeter,
  inputClass,
  linkClass,
  submitClass,
} from "@/components/auth/fields";
import { Notice } from "@/components/ui-kit";
import { checkPassword, destinationForUser, safeNext, signUpError, useUser } from "@/lib/auth";

type Search = { next?: string | undefined };

export const Route = createFileRoute("/register")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    next: typeof s["next"] === "string" ? s["next"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Create your account — Futuroute" },
      {
        name: "description",
        content:
          "Create a free Futuroute account to save careers, comparisons and your personal learning roadmap.",
      },
      { property: "og:title", content: "Create your account — Futuroute" },
      {
        property: "og:description",
        content: "Create a free account and start your career exploration.",
      },
    ],
  }),
  component: RegisterPage,
});

type Errors = {
  name?: string | undefined;
  email?: string | undefined;
  password?: string | undefined;
  confirm?: string | undefined;
  terms?: string | undefined;
};

function RegisterPage() {
  const { next } = Route.useSearch();
  const nav = useNavigate();
  const { user, loading } = useUser();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [resent, setResent] = useState(false);

  useEffect(() => {
    if (loading || !user) return;
    void destinationForUser(user, next).then((to) => nav({ to, replace: true }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading]);

  function validate(): Errors {
    const e: Errors = {};
    if (name.trim().length < 2) e.name = "Please enter your full name.";
    const mail = email.trim();
    e.email = !mail
      ? "Enter your email address."
      : /^\S+@\S+\.\S+$/.test(mail)
        ? undefined
        : "That doesn't look like a valid email address.";
    if (!checkPassword(password).valid)
      e.password = "Use at least 8 characters with a letter and a number.";
    if (confirm !== password) e.confirm = "Passwords don't match.";
    if (!terms) e.terms = "Please accept the terms to create an account.";
    return e;
  }

  async function submit(ev: FormEvent) {
    ev.preventDefault();
    setErr("");
    const e = validate();
    setErrors(e);
    if (Object.values(e).some(Boolean)) return;

    setBusy(true);
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
        data: { full_name: name.trim() },
      },
    });
    setBusy(false);

    if (error) {
      setErr(signUpError(error.message));
      return;
    }
    // Supabase returns a user with no identities when the email is already registered.
    if (data.user && (data.user.identities?.length ?? 0) === 0) {
      setErr(signUpError("already registered", true));
      return;
    }
    if (data.session && data.user) {
      toast.success("Account created — welcome to Futuroute!");
      const to = await destinationForUser(data.user, next);
      nav({ to, replace: true });
      return;
    }
    setSentTo(email.trim());
  }

  async function resend() {
    if (!sentTo) return;
    setBusy(true);
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: sentTo,
      options: { emailRedirectTo: `${window.location.origin}/login` },
    });
    setBusy(false);
    if (error) setErr(signUpError(error.message));
    else setResent(true);
  }

  if (sentTo) {
    return (
      <AuthShell
        title="Check your inbox"
        subtitle={`We sent a confirmation link to ${sentTo}. Open it to activate your account, then sign in.`}
      >
        <div className="grid gap-4">
          <div className="glass-soft flex items-start gap-3 p-4 text-sm text-text-2">
            <MailCheck className="mt-0.5 size-5 shrink-0 text-cyan" aria-hidden />
            <p>
              Email confirmation keeps your account secure. If the message doesn't arrive within a
              few minutes, check your spam folder or resend it.
            </p>
          </div>
          {resent && <Notice tone="success">A new confirmation link is on its way.</Notice>}
          {err && <Notice tone="warn">{err}</Notice>}
          <button type="button" onClick={resend} disabled={busy} className={submitClass}>
            {busy ? (
              <>
                <Spinner />
                Sending…
              </>
            ) : (
              "Resend confirmation email"
            )}
          </button>
          <Link to="/login" className="text-center text-sm text-text-2 hover:text-foreground">
            Already confirmed? Sign in
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Free to start. Save careers, compare your options and build a plan that fits your budget."
      footer={
        <>
          Already have an account?{" "}
          <Link
            to="/login"
            search={{ next: safeNext(next) === "/dashboard" ? undefined : next }}
            className={linkClass}
          >
            Sign in
          </Link>
        </>
      }
    >
      <GoogleSignInButton next={next} onError={setErr} />
      <AuthDivider label="or sign up with email" />
      <form onSubmit={submit} className="grid gap-4" noValidate>
        <Field id="name" label="Full name" error={errors.name}>
          <input
            id="name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={!!errors.name || undefined}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={inputClass}
            placeholder="Your name"
          />
        </Field>
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
        <Field id="new-password" label="Password" error={errors.password}>
          <PasswordInput
            id="new-password"
            value={password}
            onChange={setPassword}
            autoComplete="new-password"
            invalid={!!errors.password}
            describedBy={errors.password ? "new-password-error" : undefined}
          />
          <div className="pt-1">
            <StrengthMeter password={password} />
          </div>
        </Field>
        <Field id="confirm-password" label="Confirm password" error={errors.confirm}>
          <PasswordInput
            id="confirm-password"
            value={confirm}
            onChange={setConfirm}
            autoComplete="new-password"
            invalid={!!errors.confirm}
            describedBy={errors.confirm ? "confirm-password-error" : undefined}
          />
        </Field>
        <div className="grid gap-1">
          <label className="flex items-start gap-2.5 text-sm text-text-2">
            <input
              type="checkbox"
              checked={terms}
              onChange={(e) => setTerms(e.target.checked)}
              aria-invalid={!!errors.terms || undefined}
              className="mt-0.5 size-4 shrink-0 accent-[var(--lavender-bright)]"
            />
            <span>
              I agree to Futuroute's{" "}
              <Link to="/about" hash="privacy" className={linkClass}>
                terms of use and privacy notice
              </Link>
              , and understand recommendations are indicative guidance, not guarantees.
            </span>
          </label>
          {errors.terms && (
            <p role="alert" className="text-xs text-warning">
              {errors.terms}
            </p>
          )}
        </div>
        {err && <Notice tone="warn">{err}</Notice>}
        <button type="submit" className={submitClass} disabled={busy}>
          {busy ? (
            <>
              <Spinner />
              Creating your account…
            </>
          ) : (
            "Create account"
          )}
        </button>
      </form>
    </AuthShell>
  );
}
