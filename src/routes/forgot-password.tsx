import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthShell } from "@/components/auth/AuthShell";
import { Field, Spinner, inputClass, linkClass, submitClass } from "@/components/auth/fields";
import { Notice } from "@/components/ui-kit";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Reset your password — Futuroute" },
      {
        name: "description",
        content: "Request a secure password reset link for your Futuroute account.",
      },
      { property: "og:title", content: "Reset your password — Futuroute" },
      { property: "og:description", content: "Request a password reset link." },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    const mail = email.trim();
    if (!/^\S+@\S+\.\S+$/.test(mail)) {
      setError("Please enter a valid email address.");
      return;
    }
    setBusy(true);
    const { error: err } = await supabase.auth.resetPasswordForEmail(mail, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(false);
    if (err) {
      const m = err.message.toLowerCase();
      setError(
        m.includes("too many") || m.includes("rate limit")
          ? "Too many requests. Please wait a few minutes and try again."
          : "We couldn't send the reset email. Please try again in a moment.",
      );
      return;
    }
    // Always the same message, so the page can't be used to discover registered emails.
    setSent(true);
  }

  return (
    <AuthShell
      title="Reset your password"
      subtitle="Enter the email you signed up with and we'll send you a secure link to choose a new password."
      footer={
        <Link to="/login" className={linkClass}>
          Back to sign in
        </Link>
      }
    >
      {sent ? (
        <div className="grid gap-4">
          <Notice tone="success">
            If an account exists for <span className="font-medium">{email.trim()}</span>, a reset
            link is on its way. It expires after a short time.
          </Notice>
          <p className="text-sm text-text-2">
            Check your spam folder if you don't see it. You can request another link in a minute.
          </p>
          <button type="button" className={submitClass} onClick={() => setSent(false)}>
            Use a different email
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="grid gap-4" noValidate>
          <Field id="email" label="Email address" error={error}>
            <input
              id="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={!!error || undefined}
              aria-describedby={error ? "email-error" : undefined}
              className={inputClass}
              placeholder="you@example.com"
            />
          </Field>
          <button type="submit" className={submitClass} disabled={busy}>
            {busy ? (
              <>
                <Spinner />
                Sending the link…
              </>
            ) : (
              "Send reset link"
            )}
          </button>
        </form>
      )}
    </AuthShell>
  );
}
