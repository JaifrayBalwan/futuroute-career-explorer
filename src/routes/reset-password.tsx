import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AuthShell } from "@/components/auth/AuthShell";
import {
  Field,
  PasswordInput,
  Spinner,
  StrengthMeter,
  linkClass,
  submitClass,
} from "@/components/auth/fields";
import { Notice } from "@/components/ui-kit";
import { checkPassword } from "@/lib/auth";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Set a new password — Futuroute" },
      { name: "description", content: "Choose a new password for your Futuroute account." },
      { property: "og:title", content: "Set a new password — Futuroute" },
      { property: "og:description", content: "Reset your Futuroute password." },
    ],
  }),
  component: ResetPasswordPage,
});

type Status = "checking" | "ready" | "expired";

function ResetPasswordPage() {
  const nav = useNavigate();
  const [status, setStatus] = useState<Status>("checking");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({});
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      if (data.session) setStatus("ready");
    });
    // The recovery link signs the user in with a short-lived session; wait for that event too.
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return;
      if (event === "PASSWORD_RECOVERY" || (event === "SIGNED_IN" && session)) setStatus("ready");
    });
    const timer = setTimeout(() => {
      if (active) setStatus((s) => (s === "checking" ? "expired" : s));
    }, 4000);
    return () => {
      active = false;
      clearTimeout(timer);
      data.subscription.unsubscribe();
    };
  }, []);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setErr("");
    const next: { password?: string; confirm?: string } = {};
    if (!checkPassword(password).valid)
      next.password = "Use at least 8 characters with a letter and a number.";
    if (confirm !== password) next.confirm = "Passwords don't match.";
    setErrors(next);
    if (Object.values(next).some(Boolean)) return;

    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) {
      const m = error.message.toLowerCase();
      setErr(
        m.includes("session") || m.includes("auth")
          ? "This reset link has expired. Request a new one and try again."
          : m.includes("reuse") || m.includes("different")
            ? "Please choose a password you haven't used before."
            : error.message,
      );
      return;
    }
    toast.success("Password updated — you're signed in.");
    nav({ to: "/dashboard", replace: true });
  }

  if (status === "checking") {
    return (
      <AuthShell title="Checking your reset link" subtitle="One moment while we verify this link.">
        <div className="flex items-center gap-2 text-sm text-text-2">
          <Spinner /> Verifying…
        </div>
      </AuthShell>
    );
  }

  if (status === "expired") {
    return (
      <AuthShell
        title="This link has expired"
        subtitle="Password reset links are single-use and time-limited. Request a fresh one to continue."
        footer={
          <Link to="/login" className={linkClass}>
            Back to sign in
          </Link>
        }
      >
        <div className="grid gap-4">
          <Notice tone="warn">
            We couldn't verify a password reset session in this browser. Open the newest link from
            your inbox, or request another one.
          </Notice>
          <Link to="/forgot-password" className={submitClass}>
            Request a new reset link
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Set a new password"
      subtitle="Choose a strong password you haven't used before. You'll stay signed in on this device."
    >
      <form onSubmit={submit} className="grid gap-4" noValidate>
        <Field id="new-password" label="New password" error={errors.password}>
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
        <Field id="confirm-password" label="Confirm new password" error={errors.confirm}>
          <PasswordInput
            id="confirm-password"
            value={confirm}
            onChange={setConfirm}
            autoComplete="new-password"
            invalid={!!errors.confirm}
            describedBy={errors.confirm ? "confirm-password-error" : undefined}
          />
        </Field>
        {err && <Notice tone="warn">{err}</Notice>}
        <button type="submit" className={submitClass} disabled={busy}>
          {busy ? (
            <>
              <Spinner />
              Saving…
            </>
          ) : (
            "Update password"
          )}
        </button>
      </form>
    </AuthShell>
  );
}
