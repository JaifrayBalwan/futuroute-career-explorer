import { createFileRoute, Link } from "@tanstack/react-router";
import { Bookmark, GitCompareArrows, Map, FlaskConical, Activity as ActIcon, Compass, Wallet, ArrowRight } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Glass, ProgressRing, btnClass, EmptyState, Chip, DemoBadge } from "@/components/ui-kit";
import { RouteMap, SaveButton } from "@/components/CareerParts";
import { getCareer } from "@/lib/careers";
import { roadmapProgress, useApp } from "@/lib/store";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "My Dashboard — Futuroute" },
      { name: "description", content: "Your saved careers, comparisons, roadmap progress and challenges in one place." },
      { property: "og:title", content: "My Dashboard — Futuroute" },
      { property: "og:description", content: "Track your career exploration progress." },
    ],
  }),
  component: Dashboard,
});

const ago = (t: number) => {
  const m = Math.round((Date.now() - t) / 60000);
  return m < 1 ? "just now" : m < 60 ? `${m} min ago` : m < 1440 ? `${Math.round(m / 60)} h ago` : `${Math.round(m / 1440)} d ago`;
};

function Dashboard() {
  const s = useApp();
  const p = roadmapProgress(s.roadmap);
  const challenges = Object.values(s.challenges).filter((c) => c.answer);
  const reflections = Object.entries(s.challenges).filter(([, c]) => c.enjoy || c.reflection);
  const firstVisit = s.saved.length === 0 && !s.roadmap && challenges.length === 0 && s.comparedCount === 0 && !s.discovery;
  const next = s.roadmap?.tasks.find((t) => !t.done);
  const roadCareer = s.roadmap && getCareer(s.roadmap.careerId);

  const stats = [
    { icon: Bookmark, label: "Saved Careers", value: s.saved.length, hint: "Careers you've bookmarked" },
    { icon: GitCompareArrows, label: "Careers Compared", value: s.comparedCount, hint: "Comparisons you've reviewed" },
    { icon: Map, label: "Roadmap Progress", value: `${p.pct}%`, hint: s.roadmap ? `${p.done} of ${p.total} tasks done` : "No roadmap yet" },
    { icon: FlaskConical, label: "Challenges Completed", value: `${challenges.length}/5`, hint: "Mini career challenges" },
  ];

  return (
    <AppShell greeting>
      {firstVisit && (
        <Glass className="mb-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-display text-xl font-semibold">Welcome to Futuroute 👋</h2>
              <p className="mt-1 text-text-2">You haven't explored anything yet. Pick a first step — everything you do is saved in this browser.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link to="/discover" className={btnClass("primary")}><Compass className="size-4" />Start career discovery</Link>
              <Link to="/compare" className={btnClass("outline")}><GitCompareArrows className="size-4" />Compare two careers</Link>
              <Link to="/planner" className={btnClass("outline")}><Wallet className="size-4" />Create a learning plan</Link>
              <Link to="/try" className={btnClass("outline")}><FlaskConical className="size-4" />Try a challenge</Link>
            </div>
          </div>
        </Glass>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ icon: I, label, value, hint }) => (
          <Glass key={label} className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-text-2">{label}</p>
              <span className="grid size-9 place-items-center rounded-xl bg-accent text-lavender-bright"><I className="size-4" /></span>
            </div>
            <p className="mt-3 font-display text-3xl font-semibold">{value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
          </Glass>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <Glass>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-semibold">My Career Exploration</h2>
              <p className="text-sm text-muted-foreground">Select a path to see what it involves.</p>
            </div>
            <Link to="/compare" className={btnClass("soft")}><GitCompareArrows className="size-4" />Compare careers</Link>
          </div>
          <RouteMap className="mt-4 max-h-[340px]" />
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-turquoise" />Saved</span>
            <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-cyan" />Recently explored</span>
            <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-lavender" />Not yet explored</span>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="mb-2 text-sm font-medium text-text-2">Saved career options</h3>
              {s.saved.length === 0 ? <p className="text-sm text-muted-foreground">Nothing saved yet.</p> : (
                <ul className="space-y-2">{s.saved.map((id) => { const c = getCareer(id); return c && (
                  <li key={id} className="glass-soft flex items-center justify-between gap-2 px-3 py-2">
                    <Link to="/careers/$id" params={{ id }} className="text-sm hover:text-lavender-bright">{c.name}</Link>
                    <SaveButton career={c} compact />
                  </li>); })}</ul>
              )}
            </div>
            <div>
              <h3 className="mb-2 text-sm font-medium text-text-2">Recently explored</h3>
              {s.recent.length === 0 ? <p className="text-sm text-muted-foreground">Open a career to see it here.</p> : (
                <div className="flex flex-wrap gap-2">{s.recent.map((id) => <Link key={id} to="/careers/$id" params={{ id }}><Chip>{getCareer(id)?.name}</Chip></Link>)}</div>
              )}
            </div>
          </div>
        </Glass>

        <div className="flex flex-col gap-6">
          <Glass>
            <h2 className="font-display text-xl font-semibold">My Roadmap</h2>
            {s.roadmap ? (
              <>
                <div className="mt-4 flex items-center gap-5">
                  <ProgressRing value={p.pct} />
                  <div className="space-y-1 text-sm">
                    <p className="font-medium">{roadCareer?.name}</p>
                    <p className="text-text-2">Current phase: {p.phase}</p>
                    <p className="text-success">{p.done} completed</p>
                    <p className="text-muted-foreground">{p.total - p.done} remaining</p>
                  </div>
                </div>
                {next && <p className="mt-4 text-sm text-text-2">Next: <span className="text-foreground">{next.title}</span></p>}
                <Link to="/roadmap" className={btnClass("primary", "mt-4 w-full")}>Continue Roadmap <ArrowRight className="size-4" /></Link>
              </>
            ) : <div className="mt-4"><EmptyState icon={<Map className="size-5" />} title="No roadmap yet" text="Create a budget-aware plan and turn it into tasks you can tick off." action={{ label: "Create a plan", to: "/planner" }} /></div>}
          </Glass>

          <Glass>
            <h2 className="font-display text-lg font-semibold">Recent activity</h2>
            {s.activity.length === 0 ? (
              <div className="mt-4"><EmptyState icon={<ActIcon className="size-5" />} title="Your journey starts here" text="Save a career, try a challenge or tick off a task — it'll show up here." /></div>
            ) : (
              <ul className="mt-3 space-y-2">{s.activity.slice(0, 6).map((a) => (
                <li key={a.id} className="flex items-start justify-between gap-3 text-sm">
                  <span className="flex items-start gap-2 text-text-2"><span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-cyan" />{a.text}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">{ago(a.at)}</span>
                </li>))}</ul>
            )}
          </Glass>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Glass>
          <h2 className="font-display text-lg font-semibold">Challenge reflections</h2>
          {reflections.length === 0 ? <p className="mt-2 text-sm text-muted-foreground">Complete a challenge and share how it felt.</p> : (
            <ul className="mt-3 space-y-2">{reflections.map(([id, c]) => (
              <li key={id} className="glass-soft px-3 py-2 text-sm">
                <span className="font-medium capitalize">{id}</span>
                {c.enjoy && <span className="ml-2 text-xs text-cyan">{{ enjoyed: "Enjoyed it", okay: "It was okay", not: "Not for me" }[c.enjoy]}</span>}
                {c.reflection && <p className="mt-1 text-text-2">“{c.reflection}”</p>}
              </li>))}</ul>
          )}
        </Glass>
        <Glass>
          <h2 className="font-display text-lg font-semibold">Continue where you left off</h2>
          <div className="mt-3 flex flex-col gap-2">
            {next && <Link to="/roadmap" className={btnClass("outline", "justify-between")}>Roadmap: {next.title}<ArrowRight className="size-4" /></Link>}
            {s.compare.length >= 2 && <Link to="/compare" className={btnClass("outline", "justify-between")}>Comparison shortlist: {s.compare.map((id) => getCareer(id)?.name).join(" vs ")}<ArrowRight className="size-4" /></Link>}
            {s.discovery ? <Link to="/discover" className={btnClass("outline", "justify-between")}>View your exploration report<ArrowRight className="size-4" /></Link>
              : <Link to="/discover" className={btnClass("outline", "justify-between")}>Start career discovery<ArrowRight className="size-4" /></Link>}
          </div>
          <DemoBadge className="mt-4" />
        </Glass>
      </div>
    </AppShell>
  );
}
