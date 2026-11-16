import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Glass, Button, Notice, Logo } from "@/components/ui-kit";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [
    { title: "Set a new password — Futuroute" },
    { name: "description", content: "Choose a new password for your Futuroute account." },
    { property: "og:title", content: "Set a new password — Futuroute" },
    { property: "og:description", content: "Reset your Futuroute password." },
  ] }),
  component: Reset,
});

function Reset() {
  const nav = useNavigate();
  const [pw, setPw] = useState(""); const [pw2, setPw2] = useState(""); const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  async function submit(e: FormEvent) {
    e.preventDefault(); setErr("");
    if (pw.length < 8) return setErr("Password must be at least 8 characters.");
    if (pw !== pw2) return setErr("Passwords don't match.");
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setBusy(false);
    if (error) return setErr(error.message.includes("session") ? "This reset link has expired. Request a new one from the sign-in page." : error.message);
    toast.success("Password updated"); nav({ to: "/dashboard" });
  }
  const cls = "h-11 w-full rounded-xl border border-glass-border bg-secondary px-3 text-sm";
  return (
    <div className="ambient grid min-h-screen place-items-center px-4">
      <div className="w-full max-w-md"><div className="mb-6"><Logo /></div>
        <Glass><h1 className="font-display text-2xl font-semibold">Set a new password</h1>
          <form onSubmit={submit} className="mt-4 grid gap-3">
            <label className="grid gap-1 text-sm">New password<input type="password" className={cls} value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="new-password" /></label>
            <label className="grid gap-1 text-sm">Confirm password<input type="password" className={cls} value={pw2} onChange={(e) => setPw2(e.target.value)} autoComplete="new-password" /></label>
            {err && <Notice tone="warn">{err}</Notice>}
            <Button type="submit" disabled={busy}>{busy ? "Saving…" : "Update password"}</Button>
          </form></Glass></div>
    </div>
  );
}
