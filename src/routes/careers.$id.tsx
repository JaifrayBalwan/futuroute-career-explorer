import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { ExternalLink, GitCompareArrows, FlaskConical, Wallet } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Glass, Chip, btnClass, PageHeader, Bar } from "@/components/ui-kit";
import { SaveButton } from "@/components/CareerParts";
import { getCareer } from "@/lib/careers";
import { actions, useApp } from "@/lib/store";

export const Route = createFileRoute("/careers/$id")({
  loader: ({ params }) => { const c = getCareer(params.id); if (!c) throw notFound(); return { name: c.name, short: c.short }; },
  head: ({ loaderData }) => ({
    meta: loaderData ? [
      { title: `${loaderData.name} — Futuroute` },
      { name: "description", content: loaderData.short },
      { property: "og:title", content: `${loaderData.name} — Futuroute` },
      { property: "og:description", content: loaderData.short },
    ] : [{ title: "Career unavailable — Futuroute" }, { name: "robots", content: "noindex" }],
  }),
  component: CareerPage,
});

function List({ title, items }: { title: string; items: string[] }) {
  return <div><h3 className="mb-2 text-sm font-medium text-cyan">{title}</h3><ul className="space-y-1.5 text-sm text-text-2">{items.map((i) => <li key={i} className="flex gap-2"><span className="mt-2 size-1 shrink-0 rounded-full bg-lavender" />{i}</li>)}</ul></div>;
}

function CareerPage() {
  const { id } = Route.useParams();
  const c = getCareer(id)!;
  const { compare } = useApp();
  const nav = useNavigate();
  useEffect(() => { actions.visit(id); }, [id]);
  const addCompare = () => {
    const next = compare.includes(id) ? compare : [...compare.filter((x) => x !== id), id].slice(-3);
    actions.setCompare(next);
    nav({ to: "/compare" });
  };
  return (
    <AppShell>
      <PageHeader eyebrow="Career profile · sample information" title={c.name} text={c.short}>
        <div className="flex flex-wrap gap-2">
          <SaveButton career={c} />
          <button type="button" onClick={addCompare} className={btnClass("outline")}><GitCompareArrows className="size-4" />Add to comparison</button>
        </div>
      </PageHeader>
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Glass className="space-y-6">
          <div><h2 className="mb-2 font-display text-lg font-semibold">A typical day</h2><p className="text-text-2">{c.day}</p></div>
          <div className="grid gap-6 sm:grid-cols-2">
            <List title="Main responsibilities" items={c.responsibilities} />
            <List title="Common education routes" items={c.pathways} />
            <List title="Advantages" items={c.pros} />
            <List title="Challenges" items={c.cons} />
          </div>
          <div><h3 className="mb-2 text-sm font-medium text-cyan">Beginner projects</h3><div className="flex flex-wrap gap-2">{c.projects.map((p) => <Chip key={p}>{p}</Chip>)}</div></div>
        </Glass>
        <div className="space-y-6">
          <Glass>
            <h2 className="font-display text-lg font-semibold">Skills worth exploring</h2>
            <div className="mt-3 flex flex-wrap gap-2">{c.skills.map((s) => <Chip key={s}>{s}</Chip>)}</div>
            <h3 className="mt-5 text-sm font-medium text-text-2">Useful school subjects</h3>
            <p className="text-sm text-muted-foreground">{c.subjects.join(" · ")}</p>
            <h3 className="mt-5 text-sm font-medium text-text-2">Relative learning commitment (illustrative)</h3>
            <div className="mt-2 flex items-center gap-3"><Bar value={c.commitmentLevel} /><span className="text-xs text-muted-foreground">{c.commitment}</span></div>
          </Glass>
          <Glass>
            <h2 className="font-display text-lg font-semibold">Free learning resources</h2>
            <ul className="mt-3 space-y-2">{c.resources.map((r) => (
              <li key={r.url}><a href={r.url} target="_blank" rel="noreferrer" className="glass-soft flex items-center justify-between gap-2 px-3 py-2 text-sm hover:border-cyan/40">
                <span><span className="font-medium">{r.name}</span><span className="block text-xs text-muted-foreground">{r.cost} · {r.note}</span></span><ExternalLink className="size-4 shrink-0 text-cyan" /></a></li>))}</ul>
          </Glass>
          <Glass>
            <h2 className="font-display text-lg font-semibold">Try it first</h2>
            <p className="mt-2 text-sm text-text-2">{c.trial}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link to="/try" search={{ c: c.challengeId }} className={btnClass("primary")}><FlaskConical className="size-4" />Try challenge</Link>
              <Link to="/planner" search={{ career: c.id }} className={btnClass("outline")}><Wallet className="size-4" />Plan learning</Link>
            </div>
          </Glass>
        </div>
      </div>
    </AppShell>
  );
}
