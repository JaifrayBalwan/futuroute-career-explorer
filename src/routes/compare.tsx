import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronDown, Plus, X, FlaskConical, Scale } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Glass, Chip, btnClass, PageHeader, Bar, Notice } from "@/components/ui-kit";
import { SaveButton } from "@/components/CareerParts";
import { CAREERS, HUE_CLASS, getCareer, type Career } from "@/lib/careers";
import { actions, useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/compare")({
  head: () => ({
    meta: [
      { title: "Compare My Futures — Futuroute" },
      { name: "description", content: "Compare two or three careers side by side: daily work, skills, pathways, trade-offs and what to try first." },
      { property: "og:title", content: "Compare My Futures — Futuroute" },
      { property: "og:description", content: "Side-by-side career comparison without declaring a winner." },
    ],
  }),
  component: Compare,
});

const PRESETS = [
  ["software-developer", "ui-ux-designer"],
  ["data-analyst", "cybersecurity-analyst"],
  ["ai-ml-engineer", "web-developer"],
];

const ROWS: { key: string; label: string; render: (c: Career) => React.ReactNode }[] = [
  { key: "day", label: "Day-to-day work", render: (c) => c.day },
  { key: "resp", label: "Main responsibilities", render: (c) => <ul className="space-y-1">{c.responsibilities.map((r) => <li key={r}>• {r}</li>)}</ul> },
  { key: "skills", label: "Relevant skills", render: (c) => <div className="flex flex-wrap gap-1.5">{c.skills.map((s) => <Chip key={s} className="px-2 py-0.5 text-xs">{s}</Chip>)}</div> },
  { key: "subjects", label: "Useful school subjects", render: (c) => c.subjects.join(", ") },
  { key: "path", label: "Educational pathways", render: (c) => <ul className="space-y-1">{c.pathways.map((r) => <li key={r}>• {r}</li>)}</ul> },
  { key: "proj", label: "Beginner projects", render: (c) => <ul className="space-y-1">{c.projects.map((r) => <li key={r}>• {r}</li>)}</ul> },
  { key: "commit", label: "Learning commitment", render: (c) => <div className="space-y-2"><Bar value={c.commitmentLevel} /><p>{c.commitment}</p></div> },
  { key: "pros", label: "Advantages", render: (c) => <ul className="space-y-1 text-success">{c.pros.map((r) => <li key={r}>+ {r}</li>)}</ul> },
  { key: "cons", label: "Challenges", render: (c) => <ul className="space-y-1 text-warning">{c.cons.map((r) => <li key={r}>– {r}</li>)}</ul> },
  { key: "res", label: "Free / low-cost resources", render: (c) => <ul className="space-y-1">{c.resources.map((r) => <li key={r.url}><a className="text-cyan underline-offset-2 hover:underline" href={r.url} target="_blank" rel="noreferrer">{r.name}</a> <span className="text-muted-foreground">({r.cost})</span></li>)}</ul> },
  { key: "trial", label: "Try before choosing", render: (c) => c.trial },
];

function summary(cs: Career[]) {
  const shared = cs[0]!.skills.filter((s) => cs.slice(1).every((c) => c.skills.includes(s)));
  const easier = [...cs].sort((a, b) => a.commitmentLevel - b.commitmentLevel)[0]!;
  const lines = [
    shared.length ? `They share ${shared.join(", ")} — learning it helps with every option.` : "They draw on quite different skill sets, so a short trial of each will tell you a lot.",
    `${easier.name} generally has a gentler starting curve; ${cs.filter((c) => c !== easier).map((c) => c.name).join(" and ")} may need more foundational study first.`,
    ...cs.map((c) => `${c.name} suits you if you enjoy: ${(c.pros[0] ?? "").toLowerCase()}, but be ready for: ${(c.cons[0] ?? "").toLowerCase()}.`),
  ];
  return lines;
}

function Compare() {
  const { compare, saved } = useApp();
  const ids = compare.filter((id) => getCareer(id));
  const cs = ids.map((id) => getCareer(id)!);
  const [open, setOpen] = useState<Record<string, boolean>>({ day: true, skills: true, commit: true, pros: true, cons: true });
  const [picking, setPicking] = useState(false);
  const key = ids.join("|");
  useEffect(() => { if (cs.length >= 2) actions.markCompared(cs.map((c) => c.name)); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const remove = (id: string) => actions.setCompare(ids.filter((x) => x !== id));
  const add = (id: string) => { actions.setCompare([...ids, id]); setPicking(false); };

  return (
    <AppShell>
      <PageHeader eyebrow="Signature feature" title="Compare My Futures" text="Pick two or three careers and see them side by side. Futuroute won't choose for you — it lays out the trade-offs so you can." />

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">Try a sample:</span>
        {PRESETS.map((p) => (
          <Chip key={p.join()} active={p.join() === ids.join()} onClick={() => actions.setCompare(p)}>{p.map((id) => getCareer(id)!.name).join(" vs ")}</Chip>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {cs.map((c) => {
          const h = HUE_CLASS[c.hue];
          return (
            <Glass key={c.id} className={cn("relative border-t-2", h.border)}>
              <button type="button" onClick={() => remove(c.id)} aria-label={`Remove ${c.name} from comparison`} className="absolute right-3 top-3 grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground"><X className="size-4" /></button>
              <span className={cn("inline-grid size-10 place-items-center rounded-xl border font-display font-semibold", h.bg, h.border, h.text)}>{c.name[0]}</span>
              <h2 className="mt-3 font-display text-xl font-semibold">{c.name}</h2>
              <p className="mt-1 text-sm text-text-2">{c.short}</p>
              <div className="mt-4 flex flex-wrap gap-2"><SaveButton career={c} /><Link to="/careers/$id" params={{ id: c.id }} className={btnClass("ghost")}>Full profile</Link></div>
            </Glass>
          );
        })}
        {cs.length < 3 && (
          <div className="glass flex min-h-48 flex-col items-center justify-center gap-3 border-dashed p-5">
            {!picking ? (
              <button type="button" onClick={() => setPicking(true)} className={btnClass("soft")}><Plus className="size-4" />Add a career</button>
            ) : (
              <div className="w-full">
                <p className="mb-2 text-sm text-text-2">Choose a career{saved.length ? " (saved ones first)" : ""}:</p>
                <div className="flex flex-wrap gap-2">
                  {[...CAREERS].sort((a, b) => Number(saved.includes(b.id)) - Number(saved.includes(a.id))).filter((c) => !ids.includes(c.id)).map((c) => (
                    <Chip key={c.id} onClick={() => add(c.id)}>{saved.includes(c.id) ? "★ " : ""}{c.name}</Chip>
                  ))}
                </div>
                <button type="button" className={btnClass("ghost", "mt-3")} onClick={() => setPicking(false)}>Cancel</button>
              </div>
            )}
          </div>
        )}
      </div>

      {cs.length < 2 ? (
        <div className="mt-6"><Notice>Add at least two careers to see the comparison.</Notice></div>
      ) : (
        <>
          <Glass className="mt-6">
            <div className="flex items-center gap-2"><Scale className="size-5 text-cyan" /><h2 className="font-display text-xl font-semibold">Key differences & trade-offs</h2></div>
            <ul className="mt-3 space-y-2 text-text-2">{summary(cs).map((l) => <li key={l} className="flex gap-2"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-lavender" />{l}</li>)}</ul>
            <p className="mt-3 text-xs text-muted-foreground">There's no winner here — the right choice depends on what you enjoy and want. Sample information for exploration.</p>
          </Glass>

          <section aria-label="Comparison table" className="mt-6 space-y-3">
            {ROWS.map((r) => (
              <div key={r.key} className="glass overflow-hidden p-0">
                <button type="button" aria-expanded={!!open[r.key]} onClick={() => setOpen({ ...open, [r.key]: !open[r.key] })}
                  className="flex w-full items-center justify-between px-5 py-4 text-left font-display font-semibold hover:bg-secondary">
                  {r.label}<ChevronDown className={cn("size-4 transition", open[r.key] && "rotate-180")} />
                </button>
                {open[r.key] && (
                  <div className={cn("grid gap-px border-t border-glass-border bg-glass-border", cs.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2")}>
                    {cs.map((c) => (
                      <div key={c.id} className="bg-indigo-deep/80 p-5 text-sm text-text-2">
                        <p className={cn("mb-2 text-xs font-medium uppercase tracking-wider", HUE_CLASS[c.hue].text)}>{c.name}</p>
                        {r.render(c)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </section>

          <Glass className="mt-6">
            <h2 className="font-display text-2xl font-semibold">What should I try first?</h2>
            <p className="mt-1 text-text-2">Spend 10 minutes on each. Notice which one you'd happily keep doing.</p>
            <div className={cn("mt-5 grid gap-4", cs.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2")}>
              {cs.map((c) => (
                <div key={c.id} className="glass-soft flex flex-col gap-3 p-5">
                  <p className={cn("text-sm font-medium", HUE_CLASS[c.hue].text)}>{c.name} trial</p>
                  <p className="text-text-2">{c.trial}</p>
                  <Link to="/try" search={{ c: c.challengeId }} className={btnClass("outline", "mt-auto")}><FlaskConical className="size-4" />Start this trial</Link>
                </div>
              ))}
            </div>
          </Glass>
        </>
      )}
    </AppShell>
  );
}
