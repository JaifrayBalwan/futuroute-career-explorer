import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Bell, Bookmark, Compass, FlaskConical, GitCompareArrows, LayoutGrid, Map, Menu, Search, Settings, Wallet, X, Info } from "lucide-react";
import { Logo, btnClass, DemoBadge } from "./ui-kit";
import { cn } from "@/lib/utils";
import { CAREERS } from "@/lib/careers";
import { useApp } from "@/lib/store";

const NAV = [
  { to: "/dashboard", label: "Overview", icon: LayoutGrid },
  { to: "/discover", label: "Discover Careers", icon: Compass },
  { to: "/compare", label: "Compare My Futures", icon: GitCompareArrows },
  { to: "/planner", label: "Budget-to-Skill Planner", icon: Wallet },
  { to: "/try", label: "Try Before You Choose", icon: FlaskConical },
  { to: "/roadmap", label: "My Roadmap", icon: Map },
  { to: "/saved", label: "Saved Careers", icon: Bookmark },
  { to: "/settings", label: "Settings", icon: Settings },
  { to: "/about", label: "About Futuroute", icon: Info },
] as const;

function SideNav({ onNavigate }: { onNavigate?: () => void }) {
  const path = useRouterState({ select: (r) => r.location.pathname });
  return (
    <nav aria-label="Main" className="flex flex-1 flex-col gap-1">
      {NAV.map(({ to, label, icon: Icon }) => {
        const active = path === to || (to !== "/dashboard" && path.startsWith(to));
        return (
          <Link key={to} to={to} onClick={onNavigate}
            className={cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
              active ? "border border-lavender/40 bg-lavender/20 text-foreground glow" : "border border-transparent text-text-2 hover:bg-secondary hover:text-foreground")}>
            <Icon className={cn("size-4", active && "text-lavender-bright")} aria-hidden />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

function DemoCard() {
  return (
    <div className="glass-soft p-4">
      <p className="text-sm font-medium">Demo profile</p>
      <p className="mt-1 text-xs text-muted-foreground">No account needed. Your progress is stored only in this browser.</p>
    </div>
  );
}

function SearchBox() {
  const [q, setQ] = useState("");
  const nav = useNavigate();
  const hits = q.trim().length < 2 ? [] : CAREERS.filter((c) => (c.name + c.skills.join(" ")).toLowerCase().includes(q.toLowerCase())).slice(0, 5);
  return (
    <div className="relative w-full max-w-xs">
      <label htmlFor="global-search" className="sr-only">Search careers and skills</label>
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
      <input id="global-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search careers & skills"
        className="h-10 w-full rounded-xl border border-glass-border bg-secondary pl-9 pr-3 text-sm placeholder:text-muted-foreground" />
      {q.trim().length >= 2 && (
        <div className="absolute z-30 mt-2 w-full rounded-xl border border-glass-border bg-popover p-1 shadow-xl">
          {hits.length === 0 ? <p className="px-3 py-2 text-sm text-muted-foreground">No matches</p> : hits.map((c) => (
            <button key={c.id} type="button" className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-accent"
              onClick={() => { setQ(""); nav({ to: "/careers/$id", params: { id: c.id } }); }}>
              {c.name}<span className="block text-xs text-muted-foreground">{c.skills.slice(0, 3).join(" · ")}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Activity() {
  const s = useApp();
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button type="button" aria-label="Recent activity" aria-expanded={open} onClick={() => setOpen(!open)}
        className="relative grid size-10 place-items-center rounded-xl border border-glass-border bg-secondary hover:bg-accent">
        <Bell className="size-4" />
        {s.activity.length > 0 && <span className="absolute right-2 top-2 size-2 rounded-full bg-cyan" />}
      </button>
      {open && (
        <div className="absolute right-0 z-30 mt-2 w-72 rounded-xl border border-glass-border bg-popover p-2 shadow-xl">
          <p className="px-2 py-1 text-xs uppercase tracking-wider text-muted-foreground">Your recent activity</p>
          {s.activity.length === 0 ? <p className="px-2 py-3 text-sm text-text-2">Nothing yet — start exploring.</p> :
            s.activity.slice(0, 6).map((a) => <p key={a.id} className="rounded-lg px-2 py-2 text-sm text-text-2">{a.text}</p>)}
        </div>
      )}
    </div>
  );
}

export function AppShell({ children, greeting }: { children: ReactNode; greeting?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="ambient flex min-h-screen w-full">
      <aside className="glass sticky top-4 m-4 hidden h-[calc(100vh-2rem)] w-64 shrink-0 flex-col gap-6 overflow-y-auto p-4 lg:flex">
        <Link to="/" className="px-2 pt-1"><Logo /></Link>
        <SideNav />
        <DemoCard />
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
          <button type="button" aria-label="Close menu" className="absolute inset-0 bg-background/70" onClick={() => setOpen(false)} />
          <div className="glass relative m-3 flex h-[calc(100vh-1.5rem)] w-72 flex-col gap-6 overflow-y-auto p-4">
            <div className="flex items-center justify-between">
              <Logo />
              <button type="button" aria-label="Close menu" onClick={() => setOpen(false)} className="grid size-9 place-items-center rounded-lg hover:bg-secondary"><X className="size-4" /></button>
            </div>
            <SideNav onNavigate={() => setOpen(false)} />
            <DemoCard />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col px-4 pb-10 lg:pl-0 lg:pr-6">
        <header className="flex flex-wrap items-center gap-3 py-4 lg:py-6">
          <button type="button" aria-label="Open menu" onClick={() => setOpen(true)} className="grid size-10 place-items-center rounded-xl border border-glass-border bg-secondary lg:hidden"><Menu className="size-4" /></button>
          <Link to="/" className="lg:hidden"><Logo size={28} /></Link>
          {greeting ? (
            <div className="order-last w-full md:order-none md:w-auto md:flex-1">
              <h1 className="font-display text-2xl font-semibold sm:text-3xl">Good to see you. Ready to explore your future?</h1>
              <p className="mt-1 text-text-2">Your next step starts with understanding your options.</p>
            </div>
          ) : <div className="hidden flex-1 md:block"><DemoBadge /></div>}
          <div className="ml-auto flex items-center gap-2">
            <div className="hidden sm:block"><SearchBox /></div>
            <Activity />
            <Link to="/settings" aria-label="Settings" className="grid size-10 place-items-center rounded-xl border border-glass-border bg-secondary hover:bg-accent"><Settings className="size-4" /></Link>
            <Link to="/discover" className={btnClass("primary", "hidden md:inline-flex")}>Start Exploring</Link>
          </div>
        </header>
        <div className="mb-4 sm:hidden"><SearchBox /></div>
        <main id="main" className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
