import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Glass, Chip, Button, Notice } from "@/components/ui-kit";
import { INTERESTS, CAPABILITIES, SUBJECTS } from "@/lib/auth";

const AGE = ["Under 15", "15–17", "18–21", "22–25", "26+"];
const EDU = ["Class 8–10", "Class 11–12", "Diploma", "Undergraduate", "Postgraduate", "Working / gap year"];
const STREAM = ["Science (PCM)", "Science (PCB)", "Commerce", "Humanities / Arts", "Vocational", "Not decided / not applicable"];
const ENV = ["Office / desk", "Outdoors / on the move", "Lab or studio", "Remote / from home", "With people (schools, clinics, events)", "No preference"];
const BUDGET = [0, 500, 1000, 5000];
const sel = "h-11 w-full rounded-xl border border-glass-border bg-secondary px-3 text-sm";

export type ProfileData = { display_name: string; age_range: string; education_level: string; stream: string; subjects: string[]; interests: string[]; capabilities: string[]; environment: string; budget: number; weekly_hours: number; short_goal: string; long_goal: string };
const EMPTY: ProfileData = { display_name: "", age_range: "", education_level: "", stream: "", subjects: [], interests: [], capabilities: [], environment: "", budget: 0, weekly_hours: 5, short_goal: "", long_goal: "" };

export function ProfileForm({ userId, submitLabel, onSaved }: { userId: string; submitLabel: string; onSaved?: () => void }) {
  const [d, setD] = useState<ProfileData>(EMPTY);
  const [loading, setLoading] = useState(true); const [busy, setBusy] = useState(false); const [err, setErr] = useState("");
  const set = <K extends keyof ProfileData>(k: K, v: ProfileData[K]) => setD((x) => ({ ...x, [k]: v }));
  const toggle = (k: "subjects" | "interests" | "capabilities", v: string) => setD((x) => ({ ...x, [k]: x[k].includes(v) ? x[k].filter((y) => y !== v) : [...x[k], v] }));

  useEffect(() => {
    (async () => {
      const [p, pr] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
        supabase.from("user_preferences").select("*").eq("user_id", userId).maybeSingle(),
      ]);
      setD({ ...EMPTY, display_name: p.data?.display_name ?? "", age_range: p.data?.age_range ?? "", education_level: p.data?.education_level ?? "", stream: p.data?.stream ?? "",
        subjects: pr.data?.subjects ?? [], interests: pr.data?.interests ?? [], capabilities: pr.data?.capabilities ?? [], environment: pr.data?.environment ?? "",
        budget: pr.data?.budget ?? 0, weekly_hours: pr.data?.weekly_hours ?? 5, short_goal: pr.data?.short_goal ?? "", long_goal: pr.data?.long_goal ?? "" });
      setLoading(false);
    })();
  }, [userId]);

  async function save() {
    setErr("");
    if (!d.display_name.trim()) return setErr("Please add your name.");
    if (d.interests.length === 0 || d.capabilities.length === 0) return setErr("Pick at least one interest and one strength.");
    setBusy(true);
    const a = await supabase.from("profiles").update({ display_name: d.display_name.trim(), age_range: d.age_range || null, education_level: d.education_level || null, stream: d.stream || null, onboarded: true, updated_at: new Date().toISOString() }).eq("id", userId);
    const b = await supabase.from("user_preferences").upsert({ user_id: userId, subjects: d.subjects, interests: d.interests, capabilities: d.capabilities, environment: d.environment || null, budget: d.budget, weekly_hours: d.weekly_hours, short_goal: d.short_goal || null, long_goal: d.long_goal || null, updated_at: new Date().toISOString() });
    setBusy(false);
    if (a.error || b.error) return setErr("Couldn't save your profile. Please try again.");
    toast.success("Profile saved"); onSaved?.();
  }

  if (loading) return <Glass><p className="text-sm text-text-2">Loading your profile…</p></Glass>;
  const Sel = ({ k, opts, label }: { k: "age_range" | "education_level" | "stream" | "environment"; opts: string[]; label: string }) => (
    <label className="grid gap-1 text-sm">{label}<select className={sel} value={d[k]} onChange={(e) => set(k, e.target.value)}><option value="">Choose…</option>{opts.map((o) => <option key={o}>{o}</option>)}</select></label>
  );
  return (
    <div className="grid gap-5">
      <Glass><h2 className="font-display text-lg font-semibold">About you</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">Name<input className={sel} value={d.display_name} onChange={(e) => set("display_name", e.target.value)} /></label>
          <Sel k="age_range" opts={AGE} label="Age range" />
          <Sel k="education_level" opts={EDU} label="Current education level" />
          <Sel k="stream" opts={STREAM} label="Academic stream" />
        </div></Glass>
      <Glass><h2 className="font-display text-lg font-semibold">Favourite subjects</h2>
        <div className="mt-3 flex flex-wrap gap-2">{SUBJECTS.map((s) => <Chip key={s} active={d.subjects.includes(s)} onClick={() => toggle("subjects", s)}>{s}</Chip>)}</div></Glass>
      <Glass><h2 className="font-display text-lg font-semibold">Interests and hobbies</h2>
        <div className="mt-3 flex flex-wrap gap-2">{INTERESTS.map(([id, l]) => <Chip key={id} active={d.interests.includes(id)} onClick={() => toggle("interests", id)}>{l}</Chip>)}</div></Glass>
      <Glass><h2 className="font-display text-lg font-semibold">Strengths and capabilities</h2>
        <div className="mt-3 flex flex-wrap gap-2">{CAPABILITIES.map(([id, l]) => <Chip key={id} active={d.capabilities.includes(id)} onClick={() => toggle("capabilities", id)}>{l}</Chip>)}</div></Glass>
      <Glass><h2 className="font-display text-lg font-semibold">How you like to learn and work</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Sel k="environment" opts={ENV} label="Preferred working environment" />
          <label className="grid gap-1 text-sm">Weekly learning time: {d.weekly_hours} hours<input type="range" min={1} max={30} value={d.weekly_hours} onChange={(e) => set("weekly_hours", Number(e.target.value))} /></label>
          <div className="grid gap-1 text-sm sm:col-span-2">Learning budget
            <div className="flex flex-wrap items-center gap-2">{BUDGET.map((b) => <Chip key={b} active={d.budget === b} onClick={() => set("budget", b)}>₹{b.toLocaleString("en-IN")}</Chip>)}
              <label className="flex items-center gap-2">Custom ₹<input type="number" min={0} className={sel + " w-28"} value={d.budget} onChange={(e) => set("budget", Math.max(0, Number(e.target.value) || 0))} /></label></div></div>
          <label className="grid gap-1 text-sm">Short-term goal<input className={sel} value={d.short_goal} onChange={(e) => set("short_goal", e.target.value)} placeholder="e.g. Pick a stream for Class 11" /></label>
          <label className="grid gap-1 text-sm">Long-term goal<input className={sel} value={d.long_goal} onChange={(e) => set("long_goal", e.target.value)} placeholder="e.g. Work in sports analytics" /></label>
        </div></Glass>
      {err && <Notice tone="warn">{err}</Notice>}
      <div><Button onClick={save} disabled={busy} className="h-11 px-6">{busy ? "Saving…" : submitLabel}</Button></div>
    </div>
  );
}
