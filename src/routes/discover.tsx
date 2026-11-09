import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Loader2, RotateCcw, FlaskConical, GitCompareArrows } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Glass, Chip, Button, btnClass, PageHeader, Notice, DemoBadge } from "@/components/ui-kit";
import { SaveButton } from "@/components/CareerParts";
import { CAREERS } from "@/lib/careers";
import { recommend } from "@/lib/engine";
import { actions, useApp, type DiscoveryAnswers } from "@/lib/store";

export const Route = createFileRoute("/discover")({
  head: () => ({
    meta: [
      { title: "Discover Careers — Futuroute" },
      { name: "description", content: "Answer a short, friendly questionnaire and get a personalised career exploration report." },
      { property: "og:title", content: "Discover Careers — Futuroute" },
      { property: "og:description", content: "A friendly questionnaire that suggests careers to explore." },
    ],
  }),
  component: Discover,
});

type Step = { key: string; title: string; help?: string; type: "single" | "multi" | "slider"; options?: string[]; optional?: boolean; min?: number; max?: number; step?: number; unit?: string };

const STEPS: Step[] = [
  { key: "education", title: "What's your current education level?", type: "single", options: ["Class 9–10", "Class 11–12", "Undergraduate", "Graduate", "Other"] },
  { key: "subjects", title: "Which subjects do you enjoy most?", help: "Pick as many as you like.", type: "multi", options: ["Mathematics", "Computer Science", "Physics", "Biology", "Art & Design", "English", "Economics", "Business Studies", "Psychology"] },
  { key: "interests", title: "What are your interests and hobbies?", type: "multi", options: ["Coding", "Gaming", "Drawing", "Writing", "Social media", "Puzzles", "Investigating mysteries", "Photography", "Debating", "Building things"] },
  { key: "skills", title: "Which skills do you already have?", help: "Even a little counts. Optional.", type: "multi", optional: true, options: ["Basic programming", "Spreadsheets", "Sketching", "Public speaking", "Writing", "None yet"] },
  { key: "work", title: "What kind of work sounds appealing?", type: "multi", options: ["Solving logical problems", "Designing visuals", "Working with data", "Talking to people", "Protecting systems", "Running campaigns", "Building things"] },
  { key: "curious", title: "Any careers you're already curious about?", help: "Optional.", type: "multi", optional: true, options: CAREERS.map((c) => c.id) },
  { key: "hours", title: "How much time can you give each week?", type: "slider", min: 1, max: 20, step: 1, unit: "hours / week" },
  { key: "budget", title: "What's your available learning budget?", help: "Many great resources are free.", type: "single", options: ["₹0 — free only", "Up to ₹500", "Up to ₹1,000", "Up to ₹5,000"] },
  { key: "style", title: "How do you prefer to learn?", type: "single", optional: true, options: ["Videos", "Reading", "Hands-on projects", "Interactive courses", "Mix of everything"] },
  { key: "priorities", title: "What matters most to you in a career?", help: "Pick up to three.", type: "multi", options: ["Creativity", "Flexibility", "Stability", "Problem-solving", "Impact", "Earning potential"] },
];

const nameOf = (o: string) => CAREERS.find((c) => c.id === o)?.name ?? o;

function Discover() {
  const { discovery } = useApp();
  const [i, setI] = useState(0);
  const [a, setA] = useState<DiscoveryAnswers>({ hours: 5 });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(!discovery);
  const step = STEPS[i]!;
  const val = a[step.key];

  const valid = () => step.optional || step.type === "slider" || (Array.isArray(val) ? val.length > 0 : !!val);
  const next = () => {
    if (!valid()) { setErr("Please choose at least one option, or go back to change an earlier answer."); return; }
    setErr("");
    if (i < STEPS.length - 1) setI(i + 1);
    else {
      setLoading(true);
      setTimeout(() => { actions.setDiscovery(a, recommend(a).map((r) => r.career.id)); setLoading(false); setShowForm(false); }, 700);
    }
  };
  const toggle = (o: string) => {
    const cur = (Array.isArray(val) ? val : []) as string[];
    if (cur.includes(o)) setA({ ...a, [step.key]: cur.filter((x) => x !== o) });
    else if (step.key === "priorities" && cur.length >= 3) setErr("You can pick up to three priorities.");
    else { setErr(""); setA({ ...a, [step.key]: [...cur, o] }); }
  };

  if (!showForm && discovery) return <Report answers={discovery.answers} onRetake={() => { setA(discovery.answers); setI(0); setShowForm(true); }} />;

  return (
    <AppShell>
      <PageHeader eyebrow={`Step ${i + 1} of ${STEPS.length}`} title="Discover Careers" text="A few quick questions. There are no right or wrong answers." />
      <div className="mb-6 h-2 overflow-hidden rounded-full bg-secondary" role="progressbar" aria-valuemin={0} aria-valuemax={STEPS.length} aria-valuenow={i + 1} aria-label="Questionnaire progress">
        <div className="h-full bg-brand transition-all" style={{ width: `${((i + 1) / STEPS.length) * 100}%` }} />
      </div>
      <Glass className="mx-auto max-w-3xl">
        <fieldset>
          <legend className="font-display text-2xl font-semibold">{step.title}</legend>
          {step.help && <p className="mt-1 text-sm text-muted-foreground">{step.help}</p>}
          <div className="mt-6">
            {step.type === "slider" ? (
              <div>
                <label htmlFor="hours" className="text-4xl font-display font-semibold">{val as number} <span className="text-base text-text-2">{step.unit}</span></label>
                <input id="hours" type="range" min={step.min} max={step.max} step={step.step} value={val as number}
                  onChange={(e) => setA({ ...a, [step.key]: Number(e.target.value) })} className="mt-4 w-full accent-[var(--lavender-bright)]" />
              </div>
            ) : step.type === "single" ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {step.options!.map((o) => (
                  <button key={o} type="button" aria-pressed={val === o} onClick={() => { setErr(""); setA({ ...a, [step.key]: o }); }}
                    className={`rounded-2xl border px-4 py-4 text-left transition ${val === o ? "border-lavender/60 bg-lavender/20 glow" : "border-glass-border bg-secondary hover:bg-accent"}`}>{o}</button>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {step.options!.map((o) => <Chip key={o} active={Array.isArray(val) && (val as string[]).includes(o)} onClick={() => toggle(o)}>{nameOf(o)}</Chip>)}
              </div>
            )}
          </div>
        </fieldset>
        {err && <div className="mt-4"><Notice tone="warn">{err}</Notice></div>}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <Button variant="ghost" onClick={() => { setErr(""); setI(Math.max(0, i - 1)); }} disabled={i === 0}><ArrowLeft className="size-4" />Back</Button>
          <div className="flex gap-2">
            {step.optional && i < STEPS.length - 1 && <Button variant="ghost" onClick={() => { setErr(""); setI(i + 1); }}>Skip</Button>}
            <Button onClick={next} disabled={loading}>
              {loading ? <><Loader2 className="size-4 animate-spin" />Building report…</> : i === STEPS.length - 1 ? "See my report" : <>Next<ArrowRight className="size-4" /></>}
            </Button>
          </div>
        </div>
      </Glass>
    </AppShell>
  );
}

function Report({ answers, onRetake }: { answers: DiscoveryAnswers; onRetake: () => void }) {
  const recs = recommend(answers);
  const nav = useNavigate();
  return (
    <AppShell>
      <PageHeader eyebrow="Your exploration report" title="Careers worth exploring" text="These suggestions are starting points for exploration, not fixed decisions about your future.">
        <Button variant="outline" onClick={onRetake}><RotateCcw className="size-4" />Change answers</Button>
      </PageHeader>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <DemoBadge />
        <p className="text-xs text-muted-foreground">Matched with simple illustrative rules based on your answers — not a validated assessment.</p>
      </div>
      <div className="space-y-5">
        {recs.map(({ career: c, reasons }, k) => (
          <Glass key={c.id} as="article">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wider text-cyan">Option {k + 1}</p>
                <h2 className="font-display text-2xl font-semibold">{c.name}</h2>
                <p className="text-text-2">{c.short}</p>
              </div>
              <div className="flex flex-wrap gap-2"><SaveButton career={c} /><Link to="/careers/$id" params={{ id: c.id }} className={btnClass("outline")}>Full profile</Link></div>
            </div>
            <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              <div><h3 className="mb-2 text-sm font-medium text-lavender-bright">Why it may align</h3><ul className="space-y-1 text-sm text-text-2">{reasons.map((r) => <li key={r}>• {r}</li>)}</ul></div>
              <div><h3 className="mb-2 text-sm font-medium text-lavender-bright">Typical activities</h3><ul className="space-y-1 text-sm text-text-2">{c.responsibilities.slice(0, 3).map((r) => <li key={r}>• {r}</li>)}</ul></div>
              <div><h3 className="mb-2 text-sm font-medium text-lavender-bright">Skills to explore</h3><div className="flex flex-wrap gap-1.5">{c.skills.map((s) => <Chip key={s} className="px-2 py-0.5 text-xs">{s}</Chip>)}</div></div>
              <div><h3 className="mb-2 text-sm font-medium text-lavender-bright">Education routes</h3><ul className="space-y-1 text-sm text-text-2">{c.pathways.map((r) => <li key={r}>• {r}</li>)}</ul></div>
              <div><h3 className="mb-2 text-sm font-medium text-lavender-bright">Advantages & challenges</h3><ul className="space-y-1 text-sm"><li className="text-success">+ {c.pros[0]}</li><li className="text-success">+ {c.pros[1]}</li><li className="text-warning">– {c.cons[0]}</li></ul></div>
              <div><h3 className="mb-2 text-sm font-medium text-lavender-bright">Beginner trial</h3><p className="text-sm text-text-2">{c.trial}</p></div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2 border-t border-glass-border pt-4">
              <span className="text-sm text-muted-foreground">Next steps:</span>
              <Link to="/try" search={{ c: c.challengeId }} className={btnClass("soft")}><FlaskConical className="size-4" />Try the challenge</Link>
              <Link to="/planner" search={{ career: c.id }} className={btnClass("ghost")}>Plan learning</Link>
            </div>
          </Glass>
        ))}
      </div>
      {recs.length >= 2 && (
        <div className="mt-6 text-center">
          <button type="button" className={btnClass("primary")} onClick={() => { actions.setCompare(recs.slice(0, 3).map((r) => r.career.id)); nav({ to: "/compare" }); }}>
            <GitCompareArrows className="size-4" />Compare my top options
          </button>
        </div>
      )}
    </AppShell>
  );
}
