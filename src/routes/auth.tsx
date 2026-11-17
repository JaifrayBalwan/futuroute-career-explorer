import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Logo, Glass, Button, Notice } from "@/components/ui-kit";
import { safeNext } from "@/lib/auth";

type Search = { next?: string | undefined };
export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>): Search => ({ next: typeof s["next"] === "string" ? s["next"] : undefined }),
  head: () => ({ meta: [
    { title: "Sign in — Futuroute" },
    { name: "description", content: "Sign in or create a Futuroute account to save careers, assessments and roadmaps." },
    { property: "og:title", content: "Sign in — Futuroute" },
    { property: "og:description", content: "Create a free account to save your career exploration." },
  ] }),
  component: AuthPage,
});

const input = "h-11 w-full rounded-xl border border-glass-border bg-secondary px-3 text-sm placeholder:text-muted-foreground";

function AuthPage() {
  const { next } = Route.useSearch();
  const nav = useNavigate();
  const [mode, setMode] = useState<"in" | "up" | "forgot">("in");
  const [email, setEmail] = useState(""); const [pw, setPw] = useState(""); const [name, setName] = useState("");
  const [busy, setBusy] = useState(false); const [err, setErr] = useState(""); const [info, setInfo] = useState("");
  const dest = safeNext(next);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => { if (data.user) goAfter(); });
    const { data } = supabase.auth.onAuthStateChange((e) => { if (e === "SIGNED_IN") goAfter(); });
    return () => data.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function goAfter() {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    const { data: p } = await supabase.from("profiles").select("onboarded").eq("id", u.user.id).maybeSingle();
    nav({ to: p?.onboarded ? dest : "/onboarding", replace: true });
  }

  async function submit(e: FormEvent) {
    e.preventDefault(); setErr(""); setInfo("");
    if (!/^\S+@\S+\.\S+$/.test(email)) return setErr("Please enter a valid email address.");
    if (mode !== "forgot" && pw.length < 8) return setErr("Password must be at least 8 characters.");
    setBusy(true);
    try {
      if (mode === "in") {
        const { error } = await supabase.auth.signInWithPassword({ email, password: pw });
        if (error) throw error;
        toast.success("Signed in");
      } else if (mode === "up") {
        const { data, error } = await supabase.auth.signUp({ email, password: pw, options: { emailRedirectTo: window.location.origin + "/auth", data: { full_name: name } } });
        if (error) throw error;
        if (!data.session) setInfo("Check your email and click the confirmation link to finish creating your account.");
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + "/reset-password" });
        if (error) throw error;
        setInfo("If an account exists for that email, a reset link is on its way.");
      }
    } catch (x) { setErr(x instanceof Error ? x.message : "Something went wrong."); }
    finally { setBusy(false); }
  }

  async function google() {
    setErr("");
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/auth" });
    if (r.error) setErr(r.error.message ?? "Google sign-in failed.");
  }

  return (
    <div className="ambient grid min-h-screen place-items-center px-4 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-6 inline-block"><Logo /></Link>
        <Glass>
          <h1 className="font-display text-2xl font-semibold">{mode === "in" ? "Welcome back" : mode === "up" ? "Create your account" : "Reset your password"}</h1>
          <p className="mt-1 text-sm text-text-2">You can explore careers without an account. Sign in to save assessments, careers and roadmaps.</p>
          {mode !== "forgot" && (
            <>
              <button type="button" onClick={google} className="mt-5 flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-[#8E918F] bg-[#131314] px-3 text-sm font-medium text-[#E3E3E3]">
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"/><path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"/></svg>
                Continue with Google
              </button>
              <p className="my-4 text-center text-xs text-muted-foreground">or with email</p>
            </>
          )}
          <form onSubmit={submit} className="grid gap-3" noValidate>
            {mode === "up" && <label className="grid gap-1 text-sm">Name<input className={input} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" /></label>}
            <label className="grid gap-1 text-sm">Email<input className={input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required /></label>
            {mode !== "forgot" && <label className="grid gap-1 text-sm">Password<input className={input} type="password" value={pw} onChange={(e) => setPw(e.target.value)} autoComplete={mode === "in" ? "current-password" : "new-password"} required /></label>}
            {err && <Notice tone="warn">{err}</Notice>}
            {info && <Notice tone="success">{info}</Notice>}
            <Button type="submit" disabled={busy} className="mt-1 h-11">{busy ? "Please wait…" : mode === "in" ? "Sign in" : mode === "up" ? "Create account" : "Send reset link"}</Button>
          </form>
          <div className="mt-4 flex flex-wrap justify-between gap-2 text-sm text-text-2">
            {mode === "in" ? <>
              <button type="button" className="hover:text-foreground" onClick={() => setMode("up")}>New here? Create an account</button>
              <button type="button" className="hover:text-foreground" onClick={() => setMode("forgot")}>Forgot password?</button>
            </> : <button type="button" className="hover:text-foreground" onClick={() => setMode("in")}>Back to sign in</button>}
          </div>
        </Glass>
      </div>
    </div>
  );
}
