import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef } from "react";
import { Check, ExternalLink, Map, ArrowRight } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Glass, ProgressRing, Button, PageHeader, EmptyState, btnClass } from "@/components/ui-kit";
import { getCareer } from "@/lib/careers";
import { actions, roadmapProgress, useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/roadmap")({
  head: () => ({
    meta: [
      { title: "My Roadmap — Futuroute" },
      { name: "description", content: "Your phased learning roadmap with tasks you can tick off and track." },
      { property: "og:title", content: "My Roadmap — Futuroute" },
      { property: "og:description", content: "A phased, budget-aware learning roadmap." },
    ],
  }),
  component: RoadmapPage,
});

const PHASES = ["Foundations", "Core Skills", "Practical Application", "Review and Next Steps"];

function RoadmapPage() {
  const { roadmap } = useApp();
  const refs = useRef<Record<string, HTMLLIElement | null>>({});
  if (!roadmap) return (
    <AppShell><PageHeader title="My Roadmap" />
      <Glass><EmptyState icon={<Map className="size-5" />} title="No roadmap yet" text="Use the Budget-to-Skill Planner to generate a plan, then add it to your roadmap." action={{ label: "Open the planner", to: "/planner" }} /></Glass>
    </AppShell>
  );
  const c = getCareer(roadmap.careerId);
  const p = roadmapProgress(roadmap);
  const next = roadmap.tasks.find((t) => !t.done);
  const goNext = () => { if (next) { const el = refs.current[next.id]; el?.scrollIntoView({ behavior: "smooth", block: "center" }); el?.querySelector("button")?.focus(); } };

  return (
    <AppShell>
      <PageHeader eyebrow="Personalised roadmap" title={`${c?.name} roadmap`} text={`${roadmap.hours} h/week · ${roadmap.level === "beginner" ? "Beginner" : roadmap.level === "some" ? "Some basics" : "Fairly comfortable"} · budget ₹${roadmap.budget.toLocaleString("en-IN")} · project: ${roadmap.project}`}>
        <Link to="/planner" search={{ career: roadmap.careerId }} className={btnClass("outline")}>Re-plan</Link>
      </PageHeader>
      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          {PHASES.map((name, i) => {
            const tasks = roadmap.tasks.filter((t) => t.phase === i + 1);
            const done = tasks.filter((t) => t.done).length;
            return (
              <Glass key={name} as="section">
                <div className="flex items-center justify-between"><h2 className="font-display text-lg font-semibold">Phase {i + 1}: {name}</h2><span className="text-sm text-muted-foreground">{done}/{tasks.length}</span></div>
                <ul className="mt-4 space-y-3">{tasks.map((t) => (
                  <li key={t.id} ref={(el) => { refs.current[t.id] = el; }} className={cn("glass-soft flex gap-4 p-4 transition", t.done && "opacity-70", next?.id === t.id && "border-cyan/50")}>
                    <button type="button" role="checkbox" aria-checked={t.done} aria-label={`Mark "${t.title}" ${t.done ? "incomplete" : "complete"}`} onClick={() => actions.toggleTask(t.id)}
                      className={cn("mt-0.5 grid size-6 shrink-0 place-items-center rounded-lg border transition", t.done ? "border-success bg-success text-primary-foreground" : "border-glass-border hover:border-lavender")}>
                      {t.done && <Check className="size-4" />}
                    </button>
                    <div className="min-w-0 flex-1">
                      <p className={cn("font-medium", t.done && "line-through")}>{t.title}</p>
                      <p className="mt-0.5 text-sm text-text-2">{t.desc}</p>
                      <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <span>Effort: {t.effort}</span>
                        {t.resource && <a href={t.resource.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-cyan hover:underline">{t.resource.name}<ExternalLink className="size-3" /></a>}
                      </div>
                    </div>
                  </li>))}</ul>
              </Glass>
            );
          })}
        </div>
        <aside className="space-y-5 xl:sticky xl:top-6 xl:h-fit">
          <Glass className="text-center">
            <ProgressRing value={p.pct} size={150} stroke={12} />
            <p className="mt-3 text-sm text-text-2">{p.done} of {p.total} tasks complete</p>
            <p className="text-xs text-muted-foreground">Current phase: {PHASES[p.phase - 1]}</p>
            <Button className="mt-4 w-full" onClick={goNext} disabled={!next}>{next ? <>Continue Learning<ArrowRight className="size-4" /></> : "All tasks complete 🎉"}</Button>
          </Glass>
          <Glass><h2 className="font-display text-base font-semibold">Remaining tasks</h2>
            {roadmap.tasks.filter((t) => !t.done).length === 0 ? <p className="mt-2 text-sm text-success">Nothing left — time to reflect and choose your next step.</p> :
              <ul className="mt-2 space-y-1.5 text-sm text-text-2">{roadmap.tasks.filter((t) => !t.done).map((t) => <li key={t.id}>• {t.title}</li>)}</ul>}
          </Glass>
          <p className="text-xs text-muted-foreground">Effort estimates are approximate. Completing this roadmap is a learning step — it doesn't guarantee employment, a qualification or any salary.</p>
        </aside>
      </div>
    </AppShell>
  );
}
