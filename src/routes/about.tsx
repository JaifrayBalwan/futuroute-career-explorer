import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Glass, PageHeader, btnClass } from "@/components/ui-kit";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Futuroute — How it works" },
      { name: "description", content: "What Futuroute is, how it works, what runs in demo mode, privacy and contact." },
      { property: "og:title", content: "About Futuroute" },
      { property: "og:description", content: "An AI-ready career exploration platform for students — university project." },
    ],
  }),
  component: About,
});

const STATUS = [
  ["Working now", "Questionnaire, rule-based recommendations, career comparison, budget planner, mini-challenges, roadmap tracking, dashboard — all saved in your browser."],
  ["Demo Mode", "Recommendations and career information are curated samples and simple illustrative rules — not live AI and not a validated assessment."],
  ["Future integration", "Secure server-side AI using prepared prompt templates, optional accounts and cloud sync across devices."],
];

function About() {
  return (
    <AppShell>
      <PageHeader eyebrow="About" title="Your future isn't a single decision." text="It's a path you can explore. Discover career possibilities, understand what they involve, try small practical challenges and build a realistic plan for your next step." />
      <div className="grid gap-5 lg:grid-cols-2">
        <Glass><h2 className="font-display text-xl font-semibold">How it works</h2>
          <ol className="mt-3 space-y-3 text-text-2">
            {["Tell us about your interests and goals in Discover.", "Explore and compare career possibilities side by side.", "Try a 5-minute challenge to feel what the work is like.", "Plan learning within your budget and time, then track it."].map((s, i) => <li key={s} className="flex gap-3"><span className="grid size-7 shrink-0 place-items-center rounded-full bg-brand text-sm text-primary-foreground">{i + 1}</span>{s}</li>)}
          </ol>
          <Link to="/discover" className={btnClass("primary", "mt-5")}>Start exploring</Link>
        </Glass>
        <Glass><h2 className="font-display text-xl font-semibold">What's real, what's demo</h2>
          <dl className="mt-3 space-y-3">{STATUS.map(([t, d]) => <div key={t}><dt className="font-medium text-cyan">{t}</dt><dd className="text-sm text-text-2">{d}</dd></div>)}</dl>
        </Glass>
        <Glass><h2 id="privacy" className="font-display text-xl font-semibold">Privacy</h2><p className="mt-2 text-sm text-text-2">Futuroute has no accounts and no server database. Your answers and progress stay in this browser's local storage, and you can clear them anytime in Settings.</p></Glass>
        <Glass><h2 id="contact" className="font-display text-xl font-semibold">Contact</h2><p className="mt-2 text-sm text-text-2">Futuroute is a B.Tech Computer Science and Engineering university project at The NorthCap University, Gurugram. For questions, contact the project author through the university.</p></Glass>
      </div>
    </AppShell>
  );
}
