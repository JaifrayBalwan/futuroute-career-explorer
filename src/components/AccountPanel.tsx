import { useState, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { LogOut, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Glass, Button, Notice } from "@/components/ui-kit";
import { Field, PasswordInput, Spinner, StrengthMeter } from "@/components/auth/fields";
import { checkPassword, useUser } from "@/lib/auth";

const formatDate = (value?: string | null) => {
  if (!value) return "—";
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? "—"
    : d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

/** Password change, session management and sign-out for the signed-in account. */
export function AccountPanel() {
  const { user } = useUser();
  const nav = useNavigate();
  const [current, setCurrent] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<{ current?: string; password?: string; confirm?: string }>(
    {},
  );
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const [busy, setBusy] = useState(false);

  if (!user) return null;

  async function changePassword(e: FormEvent) {
    e.preventDefault();
    setErr("");
    setOk("");
    const next: typeof errors = {};
    if (!current) next.current = "Enter your current password.";
    if (!checkPassword(password).valid)
      next.password = "Use at least 8 characters with a letter and a number.";
    if (confirm !== password) next.confirm = "Passwords don't match.";
    setErrors(next);
    if (!user || Object.values(next).some(Boolean)) return;

    setBusy(true);
    // Re-authenticate first: a valid current password is required, not just an open session.
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: user.email ?? "",
      password: current,
    });
    if (authError) {
      setBusy(false);
      setErrors({ current: "That password is incorrect." });
      return;
    }
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) {
      setErr(error.message);
      return;
    }
    setCurrent("");
    setPassword("");
    setConfirm("");
    setErrors({});
    setOk("Password updated. Use your new password next time you sign in.");
    toast.success("Password updated");
  }

  async function signOut(scope: "local" | "global") {
    await supabase.auth.signOut({ scope });
    toast.success(scope === "global" ? "Signed out of all devices" : "Signed out");
    nav({ to: "/", replace: true });
  }

  return (
    <div className="grid gap-5">
      <Glass>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-lg font-semibold">Sign-in & security</h2>
            <p className="mt-1 text-sm text-text-2">
              Signed in as <span className="text-foreground">{user.email}</span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Member since {formatDate(user.created_at)} · Last sign-in{" "}
              {formatDate(user.last_sign_in_at)}
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-2.5 py-1 text-xs text-success">
            <ShieldCheck className="size-3.5" aria-hidden /> Email on file
          </span>
        </div>

        <form onSubmit={changePassword} className="mt-5 grid gap-4 sm:max-w-md" noValidate>
          <Field id="current-password" label="Current password" error={errors.current}>
            <PasswordInput
              id="current-password"
              value={current}
              onChange={setCurrent}
              autoComplete="current-password"
              invalid={!!errors.current}
              describedBy={errors.current ? "current-password-error" : undefined}
            />
          </Field>
          <Field id="account-new-password" label="New password" error={errors.password}>
            <PasswordInput
              id="account-new-password"
              value={password}
              onChange={setPassword}
              autoComplete="new-password"
              invalid={!!errors.password}
              describedBy={errors.password ? "account-new-password-error" : undefined}
            />
            <div className="pt-1">
              <StrengthMeter password={password} showRules={false} />
            </div>
          </Field>
          <Field id="account-confirm-password" label="Confirm new password" error={errors.confirm}>
            <PasswordInput
              id="account-confirm-password"
              value={confirm}
              onChange={setConfirm}
              autoComplete="new-password"
              invalid={!!errors.confirm}
              describedBy={errors.confirm ? "account-confirm-password-error" : undefined}
            />
          </Field>
          {err && <Notice tone="warn">{err}</Notice>}
          {ok && <Notice tone="success">{ok}</Notice>}
          <div>
            <Button type="submit" disabled={busy} className="h-11 px-5">
              {busy ? (
                <>
                  <Spinner />
                  Updating…
                </>
              ) : (
                "Change password"
              )}
            </Button>
          </div>
        </form>
      </Glass>

      <Glass>
        <h2 className="font-display text-lg font-semibold">Sessions</h2>
        <p className="mt-1 text-sm text-text-2">
          Sign out of this device, or end every active session if you've used a shared computer.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => signOut("local")}>
            <LogOut className="size-4" />
            Sign out
          </Button>
          <Button variant="ghost" onClick={() => signOut("global")}>
            Sign out of all devices
          </Button>
        </div>
      </Glass>
    </div>
  );
}
