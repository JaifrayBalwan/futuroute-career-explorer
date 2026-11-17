import { useState, type ReactNode } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { checkPassword, googleError } from "@/lib/auth";
import { cn } from "@/lib/utils";

export const inputClass =
  "h-11 w-full rounded-xl border border-glass-border bg-secondary px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-lavender/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lavender/40";

export const submitClass =
  "inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 text-sm font-semibold text-primary-foreground transition glow hover:brightness-110 disabled:pointer-events-none disabled:opacity-60";

export const linkClass =
  "font-medium text-lavender-bright underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lavender/50 rounded";

export function Field({
  id,
  label,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  error?: string | undefined;
  hint?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-xs text-warning">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

export function PasswordInput({
  id,
  value,
  onChange,
  autoComplete,
  invalid,
  describedBy,
  placeholder,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: string;
  invalid?: boolean | undefined;
  describedBy?: string | undefined;
  placeholder?: string | undefined;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        id={id}
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        placeholder={placeholder}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        className={cn(inputClass, "pr-11")}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? "Hide password" : "Show password"}
        aria-pressed={show}
        className="absolute right-1.5 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground transition hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lavender/50"
      >
        {show ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
      </button>
    </div>
  );
}

const BAR = ["bg-warning", "bg-warning", "bg-cyan", "bg-success", "bg-success"];

export function StrengthMeter({
  password,
  showRules = true,
}: {
  password: string;
  showRules?: boolean;
}) {
  const check = checkPassword(password);
  return (
    <div className="grid gap-2" aria-live="polite">
      <div className="flex items-center gap-2">
        <div className="flex flex-1 gap-1" aria-hidden>
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors",
                i <= check.score && password ? BAR[check.score] : "bg-secondary",
              )}
            />
          ))}
        </div>
        <span className="w-24 text-right text-xs text-text-2">
          {password ? check.label : "Strength"}
        </span>
      </div>
      {showRules && (
        <ul className="grid gap-1 text-xs text-muted-foreground sm:grid-cols-2">
          {check.rules.map((r) => (
            <li
              key={r.label}
              className={cn("flex items-center gap-1.5", r.ok ? "text-success" : undefined)}
            >
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  r.ok ? "bg-success" : "bg-muted-foreground/50",
                )}
                aria-hidden
              />
              {r.label}
              {!r.required && <span className="text-muted-foreground">(optional)</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function GoogleMark() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"
      />
    </svg>
  );
}

/** Real Google OAuth through Supabase (no simulated login). Surfaces a clear message when the provider is not configured. */
export function GoogleSignInButton({
  next,
  onError,
  disabled,
}: {
  next?: string | undefined;
  onError: (message: string) => void;
  disabled?: boolean | undefined;
}) {
  const [busy, setBusy] = useState(false);
  async function signIn() {
    setBusy(true);
    try {
      const redirectTo = `${window.location.origin}/login${next ? `?next=${encodeURIComponent(next)}` : ""}`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo, queryParams: { prompt: "select_account" } },
      });
      if (error) {
        setBusy(false);
        onError(googleError(error.message));
      }
    } catch (e) {
      setBusy(false);
      onError(googleError(e instanceof Error ? e.message : "Google sign-in failed."));
    }
  }
  return (
    <button
      type="button"
      onClick={signIn}
      disabled={busy || disabled}
      className="flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-glass-border bg-secondary px-3 text-sm font-medium text-foreground transition hover:bg-accent disabled:pointer-events-none disabled:opacity-60"
    >
      {busy ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <GoogleMark />}
      {busy ? "Opening Google…" : "Continue with Google"}
    </button>
  );
}

export function AuthDivider({ label = "or with email" }: { label?: string }) {
  return (
    <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-wider text-muted-foreground">
      <span className="h-px flex-1 bg-glass-border" aria-hidden />
      {label}
      <span className="h-px flex-1 bg-glass-border" aria-hidden />
    </div>
  );
}

export function Spinner({ className }: { className?: string }) {
  return <Loader2 className={cn("size-4 animate-spin", className)} aria-hidden />;
}
