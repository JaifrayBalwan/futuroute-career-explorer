import { Link, useNavigate } from "@tanstack/react-router";
import { Bookmark, BookmarkCheck, ArrowRight } from "lucide-react";
import { CAREERS, HUE_CLASS, type Career } from "@/lib/careers";
import { actions, useApp } from "@/lib/store";
import { Chip, btnClass } from "./ui-kit";
import { cn } from "@/lib/utils";

export function SaveButton({ career, compact }: { career: Career; compact?: boolean }) {
  const { saved } = useApp();
  const on = saved.includes(career.id);
  return (
    <button type="button" onClick={() => actions.toggleSave(career.id, career.name)} aria-pressed={on}
      aria-label={on ? `Remove ${career.name} from saved` : `Save ${career.name}`}
      className={cn("inline-flex min-h-10 items-center gap-1.5 rounded-xl border px-3 text-sm transition",
        on ? "border-turquoise/40 bg-turquoise/15 text-turquoise" : "border-glass-border bg-secondary text-text-2 hover:text-foreground")}>
      {on ? <BookmarkCheck className="size-4" /> : <Bookmark className="size-4" />}
      {!compact && (on ? "Saved" : "Save")}
    </button>
  );
}

export function CareerCard({ career }: { career: Career }) {
  const h = HUE_CLASS[career.hue];
  return (
    <article className="glass flex flex-col gap-4 p-5 transition hover:-translate-y-0.5 hover:border-lavender/40">
      <div className="flex items-start justify-between gap-3">
        <span className={cn("grid size-10 place-items-center rounded-xl border font-display font-semibold", h.bg, h.border, h.text)}>{career.name[0]}</span>
        <SaveButton career={career} compact />
      </div>
      <div>
        <h3 className="font-display text-lg font-semibold">{career.name}</h3>
        <p className="mt-1 text-sm text-text-2">{career.short}</p>
      </div>
      <div className="flex flex-wrap gap-1.5">{career.skills.slice(0, 3).map((s) => <Chip key={s} className="text-xs">{s}</Chip>)}</div>
      <Link to="/careers/$id" params={{ id: career.id }} className={btnClass("outline", "mt-auto")}>Explore Career <ArrowRight className="size-4" /></Link>
    </article>
  );
}

const NODES = [
  { id: "software-developer", x: 300, y: 50 },
  { id: "ai-ml-engineer", x: 340, y: 120 },
  { id: "data-analyst", x: 330, y: 195 },
  { id: "ui-ux-designer", x: 300, y: 265 },
  { id: "cybersecurity-analyst", x: 170, y: 290 },
  { id: "digital-marketer", x: 160, y: 20 },
];

export function RouteMap({ className }: { className?: string }) {
  const nav = useNavigate();
  const { saved, recent } = useApp();
  const o = { x: 60, y: 160 };
  return (
    <svg viewBox="0 0 420 320" className={cn("h-auto w-full", className)} role="group" aria-label="Career branching map — select a career to explore">
      <defs>
        <linearGradient id="rm-line" x1="0" x2="1">
          <stop offset="0" stopColor="var(--lavender-bright)" />
          <stop offset="1" stopColor="var(--cyan)" />
        </linearGradient>
        <radialGradient id="rm-glow"><stop offset="0" stopColor="var(--lavender)" stopOpacity="0.6" /><stop offset="1" stopColor="var(--lavender)" stopOpacity="0" /></radialGradient>
      </defs>
      {NODES.map((n) => {
        const mx = (o.x + n.x) / 2;
        return <path key={n.id} d={`M${o.x},${o.y} C${mx},${o.y} ${mx},${n.y} ${n.x},${n.y}`} stroke="url(#rm-line)" strokeWidth="1.5" fill="none" opacity="0.7" className="route-dash" />;
      })}
      <circle cx={o.x} cy={o.y} r="34" fill="url(#rm-glow)" />
      <circle cx={o.x} cy={o.y} r="9" fill="var(--lavender-bright)" />
      <text x={o.x} y={o.y + 28} textAnchor="middle" fontSize="11" fill="var(--text-2)">You</text>
      {NODES.map((n) => {
        const c = CAREERS.find((x) => x.id === n.id)!;
        const isSaved = saved.includes(n.id);
        const seen = recent.includes(n.id);
        return (
          <g key={n.id} role="button" tabIndex={0} aria-label={`Open ${c.name}`} className="cursor-pointer outline-none [&:focus-visible>rect]:stroke-[var(--cyan)]"
            onClick={() => nav({ to: "/careers/$id", params: { id: n.id } })}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); nav({ to: "/careers/$id", params: { id: n.id } }); } }}>
            <rect x={n.x - 64} y={n.y - 14} width="128" height="28" rx="14" fill="oklch(0.27 0.08 285 / 0.85)" stroke={isSaved ? "var(--turquoise)" : "oklch(1 0 0 / 0.25)"} />
            <circle cx={n.x - 50} cy={n.y} r="4" fill={isSaved ? "var(--turquoise)" : seen ? "var(--cyan)" : "var(--lavender)"} />
            <text x={n.x - 40} y={n.y + 4} fontSize="11" fill="var(--foreground)">{c.name.replace(" Analyst", "").replace(" Engineer", "")}</text>
          </g>
        );
      })}
    </svg>
  );
}
