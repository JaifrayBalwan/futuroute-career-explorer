import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Compass, GitCompareArrows, Map, ArrowRight, Menu, X } from "lucide-react";
import { Logo, btnClass, Chip, ProgressRing } from "@/components/ui-kit";
import { CareerCard } from "@/components/CareerParts";
import { CAREERS } from "@/lib/careers";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Futuroute — Your future isn't one-size-fits-all" },
      { name: "description", content: "Explore career paths, compare what they involve, try small challenges and plan learning within your time and budget." },
      { property: "og:title", content: "Futuroute — Your future isn't one-size-fits-all" },
      { property: "og:description", content: "Discover, compare and try careers. Plan your next step." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const POPULAR = ["software-developer", "ai-ml-engineer", "data-analyst", "ui-ux-designer", "cybersecurity-analyst", "digital-marketer"];

function HeroArt() {
  const [hover, setHover] = useState<string | null>(null);
  const items = [
    { id: "software-developer", label: "Software Dev", x: 78, y: 14, skill: "Logic" },
    { id: "ui-ux-designer", label: "UI/UX Design", x: 86, y: 44, skill: "Empathy" },
    { id: "data-analyst", label: "Data Analytics", x: 74, y: 76, skill: "SQL" },
    { id: "cybersecurity-analyst", label: "Cybersecurity", x: 40, y: 88, skill: "Networks" },
  ];
  return (
    <div className="relative aspect-[5/4] w-full">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
        {items.map((i) => (
          <path key={i.id} d={`M22,50 C${(22 + i.x) / 2},50 ${(22 + i.x) / 2},${i.y} ${i.x},${i.y}`} fill="none" vectorEffect="non-scaling-stroke"
            stroke={hover === i.id ? "var(--cyan)" : "var(--lavender)"} strokeWidth={hover === i.id ? 2.5 : 1.3} opacity="0.8" className="route-dash" />
        ))}
      </svg>
      <div className="glass absolute left-[22%] top-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-3 text-center glow">
        <p className="text-xs text-muted-foreground">Start here</p>
        <p className="font-display font-semibold">Your Interests</p>
      </div>
      {items.map((i, k) => (
        <Link key={i.id} to="/careers/$id" params={{ id: i.id }} onMouseEnter={() => setHover(i.id)} onMouseLeave={() => setHover(null)}
          onFocus={() => setHover(i.id)} onBlur={() => setHover(null)}
          className="glass floaty absolute -translate-x-1/2 -translate-y-1/2 px-3 py-2 text-sm transition hover:border-cyan/60"
          style={{ left: `${i.x}%`, top: `${i.y}%`, animationDelay: `${k * 0.8}s` }}>
          <span className="block font-medium">{i.label}</span>
          <span className="mt-1 inline-block rounded-full bg-cyan/15 px-2 py-0.5 text-[11px] text-cyan">{i.skill}</span>
        </Link>
      ))}
      <div className="glass absolute left-[2%] top-[6%] hidden items-center gap-3 p-3 sm:flex">
        <ProgressRing value={40} size={48} stroke={5} label={<span className="text-[10px]">40%</span>} />
        <div className="text-xs"><p className="font-medium">Example roadmap</p><p className="text-muted-foreground">Illustration only</p></div>
      </div>
    </div>
  );
}

function Home() {
  const [menu, setMenu] = useState(false);
  const links = [
    { to: "/", label: "Home" }, { to: "/discover", label: "Discover Careers" }, { to: "/compare", label: "Compare Careers" },
    { to: "/about", label: "How It Works" }, { to: "/about", label: "About" },
  ] as const;
  return (
    <div className="ambient min-h-screen">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
        <Link to="/"><Logo /></Link>
        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {links.map((l) => <Link key={l.label} to={l.to} className={btnClass("ghost")}>{l.label}</Link>)}
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/dashboard" className={btnClass("primary", "hidden sm:inline-flex")}>Start Exploring</Link>
          <button type="button" className="grid size-10 place-items-center rounded-xl border border-glass-border md:hidden" aria-label={menu ? "Close menu" : "Open menu"} aria-expanded={menu} onClick={() => setMenu(!menu)}>
            {menu ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </header>
      {menu && (
        <nav aria-label="Mobile" className="glass mx-5 mb-4 flex flex-col p-2 md:hidden">
          {links.map((l) => <Link key={l.label} to={l.to} className={btnClass("ghost", "justify-start")}>{l.label}</Link>)}
          <Link to="/dashboard" className={btnClass("primary", "mt-2")}>Start Exploring</Link>
        </nav>
      )}

      <main>
        <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-20 pt-8 lg:grid-cols-2 lg:pt-16">
          <div>
            <p className="mb-4 text-sm text-cyan">Explore possibilities. Test your potential. Plan your future.</p>
            <h1 className="font-display text-4xl font-semibold leading-[1.05] sm:text-6xl">Your Future Isn't <span className="text-gradient">One-Size-Fits-All.</span></h1>
            <p className="mt-6 max-w-xl text-lg text-text-2">Explore career paths that match your interests, compare what they really involve, and build a learning plan that fits your time, skills and budget.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/discover" className={btnClass("primary", "h-12 px-6")}>Discover My Path <ArrowRight className="size-4" /></Link>
              <Link to="/compare" className={btnClass("outline", "h-12 px-6")}>Compare Careers</Link>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">Explore possibilities. Understand your options. Take your next step.</p>
          </div>
          <HeroArt />
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16">
          <h2 className="font-display text-3xl font-semibold">Feeling unsure about your future?</h2>
          <p className="mt-3 max-w-2xl text-text-2">Many students have several interests and don't know what different careers actually involve day to day. Futuroute gives you a calm space to explore before you commit.</p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              { icon: Compass, t: "Discover", d: "Explore possible career paths based on what you enjoy.", to: "/discover" },
              { icon: GitCompareArrows, t: "Compare", d: "Understand differences, trade-offs and required skills.", to: "/compare" },
              { icon: Map, t: "Plan", d: "Build realistic next steps based on available time and budget.", to: "/planner" },
            ].map(({ icon: I, t, d, to }) => (
              <Link key={t} to={to} className="glass block p-6 transition hover:border-lavender/40">
                <I className="size-6 text-lavender-bright" aria-hidden />
                <h3 className="mt-4 font-display text-xl font-semibold">{t}</h3>
                <p className="mt-2 text-text-2">{d}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16">
          <h2 className="font-display text-3xl font-semibold">How Futuroute works</h2>
          <ol className="mt-8 grid gap-4 md:grid-cols-3">
            {["Tell us about your interests and goals.", "Explore, compare and test career possibilities.", "Build a realistic learning roadmap."].map((s, i) => (
              <li key={s} className="glass-soft flex gap-4 p-5">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brand font-display font-semibold text-primary-foreground">{i + 1}</span>
                <p className="pt-2 text-text-2">{s}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-3xl font-semibold">Explore popular careers</h2>
            <div className="flex flex-wrap gap-2">{["Logic", "Design", "Data", "Communication"].map((c) => <Chip key={c}>{c}</Chip>)}</div>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {POPULAR.map((id) => <CareerCard key={id} career={CAREERS.find((c) => c.id === id)!} />)}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16">
          <div className="glass relative overflow-hidden p-10 text-center sm:p-14">
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">Don't guess your future. Start exploring it.</h2>
            <Link to="/discover" className={btnClass("primary", "mt-8 h-12 px-6")}>Explore My Options</Link>
          </div>
        </section>
      </main>

      <footer className="mx-auto flex max-w-7xl flex-col gap-6 border-t border-glass-border px-5 py-10 md:flex-row md:items-center md:justify-between">
        <Logo />
        <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-text-2">
          <Link to="/about" className="hover:text-foreground">About Futuroute</Link>
          <Link to="/about" className="hover:text-foreground">How It Works</Link>
          <Link to="/discover" className="hover:text-foreground">Discover Careers</Link>
          <Link to="/compare" className="hover:text-foreground">Compare Careers</Link>
          <Link to="/about" hash="privacy" className="hover:text-foreground">Privacy</Link>
          <Link to="/about" hash="contact" className="hover:text-foreground">Contact</Link>
        </nav>
        <p className="text-xs text-muted-foreground">University project · The NorthCap University</p>
      </footer>
    </div>
  );
}
