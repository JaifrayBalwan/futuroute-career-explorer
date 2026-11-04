import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ExternalLink, Loader2, MapPlus } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Glass, Chip, Button, PageHeader, Notice, DemoBadge } from "@/components/ui-kit";
import { CAREERS, getCareer } from "@/lib/careers";
import { buildPlan, buildRoadmap, type PlanInput } from "@/lib/engine";
import { actions, useApp } from "@/lib/store";

export const Route = createFileRoute("/planner")({
  validateSearch: (s: Record<string, unknown>) => ({ career: typeof s.career === "string" ? s.career : undefined }),
  head: () => ({
    meta: [
      { title: "Budget-to-Skill Planner — Futuroute" },
      { name: "description", content: "Plan how to start learning a skill within your real budget in INR and weekly time." },
      { property: "og:title", content: "Budget-to-Skill Planner — Futuroute" },
      { property: "og:description", content: "Free-first learning plans that fit your time and budget." },
    ],
  }),
  component: Planner,
});

const PRESETS = [{ v: 0, l: "₹0 — Free only" }, { v: 500, l: "₹500 — Very limited" }, { v: 1000, l: "₹1,000 — Low-cost" }, { v: 5000, l: "₹5,000 — Flexible" }];
const sel = "h-11 w-full rounded-xl border border-glass-border bg-secondary px-3 text-sm";

function Planner() {
  const search = Route.useSearch();
  const { roadmap } = useApp();
  const nav = useNavigate();
  const [f, setF] = useState<PlanInput>({ careerId: search.career && getCareer(search.career) ? search.career : "software-developer", level: "beginner", budget: 0, hours: 5, device: "laptop", format: "mixed", outcome: "fundamentals" });
  const [custom, setCustom] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<ReturnType<typeof buildPlan> | null>(null);
  const set = <K extends keyof PlanInput>(k: K, v: PlanInput[K]) => { setF({ ...f, [k]: v }); setPlan(null); };

  const generate = () => {
    if (!Number.isFinite(f.budget) || f.budget < 0) return setErr("Budget must be ₹0 or more.");
    if (f.budget > 1000000) return setErr("Please enter a budget below ₹10,00,000.");
    if (f.hours < 1 || f.hours > 40) return setErr("Hours per week must be between 1 and 40.");
    setErr(""); setLoading(true);
    setTimeout(() => { setPlan(buildPlan(f)); setLoading(false); }, 500);
  };
  const addToRoadmap = () => {
    if (roadmap && roadmap.tasks.some((t) => t.done) && !confirm("Replace your current roadmap? Its progress will be lost.")) return;
    actions.setRoadmap(buildRoadmap({ ...f }), getCareer(f.careerId)!.name);
    nav({ to: "/roadmap" });
  };

  return (
    <AppShell>
      <PageHeader eyebrow="Signature feature" title="Budget-to-Skill Planner" text="Tell us your real constraints. We'll build a free-first plan and show exactly what — if anything — costs money." />
      <div className="grid gap-6 xl:grid-cols-[400px_1fr]">
        <Glass className="h-fit space-y-5">
          <div><label htmlFor="career" className="mb-1.5 block text-sm text-text-2">Target career or skill</label>
            <select id="career" className={sel} value={f.careerId} onChange={(e) => set("careerId", e.target.value)}>{CAREERS.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
          <div><span className="mb-1.5 block text-sm text-text-2">Current skill level</span>
            <div className="flex flex-wrap gap-2">{[["beginner", "Complete beginner"], ["some", "Some basics"], ["comfortable", "Fairly comfortable"]].map(([v, l]) => <Chip key={v} active={f.level === v} onClick={() => set("level", v)}>{l}</Chip>)}</div></div>
          <div><span className="mb-1.5 block text-sm text-text-2">Available budget (INR)</span>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => <Chip key={p.v} active={!custom && f.budget === p.v} onClick={() => { setCustom(false); set("budget", p.v); }}>{p.l}</Chip>)}
              <Chip active={custom} onClick={() => setCustom(true)}>Custom</Chip>
            </div>
            <label htmlFor="budget" className="sr-only">Budget in rupees</label>
            <input id="budget" type="number" min={0} inputMode="numeric" value={f.budget} onChange={(e) => { setCustom(true); set("budget", Number(e.target.value)); }} className={`${sel} mt-2`} />
          </div>
          <div><label htmlFor="hrs" className="mb-1.5 block text-sm text-text-2">Hours per week: <span className="text-foreground">{f.hours}</span></label>
            <input id="hrs" type="range" min={1} max={30} value={f.hours} onChange={(e) => set("hours", Number(e.target.value))} className="w-full accent-[var(--cyan)]" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label htmlFor="dev" className="mb-1.5 block text-sm text-text-2">Device</label>
              <select id="dev" className={sel} value={f.device} onChange={(e) => set("device", e.target.value)}><option value="phone">Phone</option><option value="laptop">Laptop</option><option value="desktop">Desktop</option></select></div>
            <div><label htmlFor="fmt" className="mb-1.5 block text-sm text-text-2">Format</label>
              <select id="fmt" className={sel} value={f.format} onChange={(e) => set("format", e.target.value)}><option value="video">Videos</option><option value="reading">Reading</option><option value="interactive">Interactive</option><option value="mixed">Mixed</option></select></div>
          </div>
          <div><label htmlFor="out" className="mb-1.5 block text-sm text-text-2">Desired outcome</label>
            <select id="out" className={sel} value={f.outcome} onChange={(e) => set("outcome", e.target.value)}><option value="fundamentals">Understand the fundamentals</option><option value="project">Complete a beginner project</option><option value="portfolio">Build a small portfolio</option></select></div>
          {err && <Notice tone="warn">{err}</Notice>}
          <Button className="w-full" onClick={generate} disabled={loading}>{loading ? <><Loader2 className="size-4 animate-spin" />Building plan…</> : "Generate my plan"}</Button>
          <DemoBadge />
        </Glass>

        {!plan ? (
          <Glass className="grid place-items-center text-center"><div className="max-w-sm py-16"><h2 className="font-display text-xl font-semibold">Your plan will appear here</h2><p className="mt-2 text-sm text-text-2">Set your constraints on the left and generate. Core plans always start with free resources.</p></div></Glass>
        ) : (
          <div className="space-y-5">
            <Notice tone={plan.withinBudget ? "success" : "warn"}>{plan.budgetNote}</Notice>
            {plan.warnings.map((w) => <Notice key={w} tone="warn">{w}</Notice>)}
            <div className="grid gap-5 md:grid-cols-2">
              <Glass><h2 className="font-display text-lg font-semibold">1 · What to learn</h2>
                <ol className="mt-3 space-y-2 text-sm text-text-2">{plan.learn.map((s, i) => <li key={s} className="flex gap-3"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-accent text-xs text-lavender-bright">{i + 1}</span>{s}</li>)}</ol></Glass>
              <Glass><h2 className="font-display text-lg font-semibold">2 · Where to learn (free)</h2>
                <ul className="mt-3 space-y-2">{plan.free.map((r) => <li key={r.url}><a href={r.url} target="_blank" rel="noreferrer" className="glass-soft flex items-center justify-between gap-2 px-3 py-2 text-sm hover:border-cyan/40"><span><span className="font-medium">{r.name}</span><span className="block text-xs text-muted-foreground">{r.cost} · {r.note}</span></span><ExternalLink className="size-4 shrink-0 text-cyan" /></a></li>)}</ul>
                <p className="mt-2 text-xs text-muted-foreground">Links checked when this demo was built; providers can change their offerings.</p></Glass>
            </div>
            <Glass><h2 className="font-display text-lg font-semibold">3 · What it costs</h2>
              <div className="mt-3 grid gap-4 md:grid-cols-3 text-sm">
                <div className="glass-soft p-4"><p className="text-success">Free resources</p><p className="mt-1 font-display text-2xl">₹0</p><p className="text-xs text-muted-foreground">{plan.free.length} core resources</p></div>
                <div className="glass-soft p-4"><p className="text-warning">Optional paid</p><ul className="mt-1 space-y-1 text-text-2">{plan.optional.map((o) => <li key={o.item}><span className="text-foreground">{o.item}</span> — {o.note}</li>)}</ul></div>
                <div className="glass-soft p-4"><p className="text-cyan">Additional expenses</p><ul className="mt-1 space-y-1 text-text-2">{plan.extra.map((o) => <li key={o.item}><span className="text-foreground">{o.item}</span> — {o.note}</li>)}</ul></div>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">We don't estimate course prices — check providers directly. Paid items are never required for this plan.</p></Glass>
            <div className="grid gap-5 md:grid-cols-2">
              <Glass><h2 className="font-display text-lg font-semibold">4 · How long it takes</h2><p className="mt-3 font-display text-3xl">~{plan.weeks} weeks</p><p className="mt-1 text-sm text-text-2">{plan.schedule}</p></Glass>
              <Glass><h2 className="font-display text-lg font-semibold">5 · What to build</h2><p className="mt-3 text-text-2">{plan.project}</p><p className="mt-2 text-xs text-muted-foreground">A small project to show yourself what you've learned. It doesn't guarantee a job or outcome.</p></Glass>
            </div>
            <Glass className="flex flex-wrap items-center justify-between gap-4"><div><h2 className="font-display text-lg font-semibold">6 · Next action</h2><p className="text-sm text-text-2">Turn this plan into a step-by-step roadmap.</p></div>
              <Button onClick={addToRoadmap}><MapPlus className="size-4" />Add Plan to My Roadmap</Button></Glass>
          </div>
        )}
      </div>
    </AppShell>
  );
}
