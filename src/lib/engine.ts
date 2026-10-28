// Deterministic, rule-based Demo Mode engine. Illustrative matching rules only —
// NOT a validated psychological assessment.
import { CAREERS, getCareer, RESOURCES, type Career } from "./careers";
import type { DiscoveryAnswers, Roadmap, Task } from "./store";

const SIGNALS: Record<string, string[]> = {
  Mathematics: ["math", "logic"], "Computer Science": ["cs", "tech"], Physics: ["math", "logic"],
  "Art & Design": ["design", "art", "visual"], English: ["english", "communication"], Economics: ["economics", "business"],
  "Business Studies": ["business"], Psychology: ["psychology", "people"], Biology: ["research"],
  Coding: ["cs", "build"], Gaming: ["tech", "logic"], Drawing: ["art", "visual", "creative"], Writing: ["english", "communication", "creative"],
  "Social media": ["social", "communication"], Puzzles: ["logic", "problem"], "Investigating mysteries": ["investigate", "safety"],
  Photography: ["visual", "creative"], Debating: ["communication", "people"], "Building things": ["build"],
  "Solving logical problems": ["logic", "problem"], "Designing visuals": ["design", "visual"], "Working with data": ["data", "analyse"],
  "Talking to people": ["people", "communication"], "Protecting systems": ["safety", "investigate"], "Running campaigns": ["social", "business", "creative"],
  "Basic programming": ["cs", "build"], Spreadsheets: ["data", "analyse"], Sketching: ["design", "art"], "Public speaking": ["communication"],
  Creativity: ["creative", "design"], "Problem-solving": ["problem", "logic"], Impact: ["people", "safety"], Stability: ["data", "cs"],
  Flexibility: ["build", "social"],
};

export type Recommendation = { career: Career; reasons: string[] };

export function recommend(a: DiscoveryAnswers): Recommendation[] {
  const picks = ["subjects", "interests", "work", "skills", "priorities"].flatMap((k) => (Array.isArray(a[k]) ? (a[k] as string[]) : []));
  const curious = Array.isArray(a.curious) ? (a.curious as string[]) : [];
  const scored = CAREERS.map((c) => {
    const reasons: string[] = [];
    let score = 0;
    for (const p of picks) {
      const hits = (SIGNALS[p] ?? []).filter((t) => c.tags.includes(t)).length;
      if (hits) { score += hits; if (reasons.length < 3) reasons.push(p); }
    }
    if (curious.includes(c.id)) { score += 3; reasons.unshift("You said you're curious about it"); }
    return { career: c, score, reasons };
  });
  scored.sort((x, y) => y.score - x.score || x.career.name.localeCompare(y.career.name));
  const top = scored.filter((s) => s.score > 0).slice(0, 5);
  const list = top.length >= 3 ? top : scored.slice(0, 3);
  return list.map(({ career, reasons }) => ({
    career,
    reasons: reasons.length ? reasons.map((r) => r.startsWith("You") ? r : `You selected “${r}”`) : ["A broad starting point while you explore your interests"],
  }));
}

export type PlanInput = { careerId: string; level: string; budget: number; hours: number; device: string; format: string; outcome: string };
export type Plan = {
  career: Career; learn: string[]; free: typeof RESOURCES[keyof typeof RESOURCES][];
  optional: { item: string; note: string }[]; extra: { item: string; note: string }[];
  weeks: number; schedule: string; project: string; budgetNote: string; withinBudget: boolean; warnings: string[];
};

export function buildPlan(i: PlanInput): Plan {
  const career = getCareer(i.careerId) ?? CAREERS[0];
  const base = { beginner: 1, some: 0.7, comfortable: 0.5 }[i.level as "beginner"] ?? 1;
  const outcomeHours = i.outcome === "project" ? 60 : i.outcome === "portfolio" ? 100 : 35;
  const totalHours = Math.round(outcomeHours * base * (0.8 + career.commitmentLevel * 0.1));
  const weeks = Math.max(2, Math.ceil(totalHours / Math.max(1, i.hours)));
  const warnings: string[] = [];
  if (i.device === "phone" && ["software-developer", "web-developer", "ai-ml-engineer", "cybersecurity-analyst"].includes(career.id))
    warnings.push("Coding and security labs are difficult on a phone. Start with theory and quizzes on your phone, and use a college/school lab or library computer for practice.");
  if (i.hours < 3) warnings.push("With under 3 hours a week, progress will be slow — short daily sessions (20–30 min) help keep momentum.");
  const optional = [
    { item: "Paid certificate for a course you audit", note: "Optional — the learning itself is free. Check the current price on the provider's site." },
    { item: "A beginner book on the topic", note: "Optional — library or second-hand copies reduce cost. Price not estimated." },
  ];
  const extra = [
    { item: "Internet data", note: "Uses your existing plan; video lessons use more data." },
    ...(i.device === "phone" ? [{ item: "Computer access", note: "Use school/college labs or a library rather than buying a device." }] : []),
  ];
  const withinBudget = true; // core plan uses only free resources: ₹0 required spend
  const budgetNote = i.budget === 0
    ? "This plan needs ₹0. Every core resource is free."
    : `Required spend: ₹0. Your budget of ₹${i.budget.toLocaleString("en-IN")} stays available for optional extras — you don't need to spend it.`;
  return {
    career, learn: career.skills, free: career.resources, optional, extra, weeks,
    schedule: `About ${totalHours} hours in total ≈ ${weeks} weeks at ${i.hours} h/week (approximate, not a guarantee).`,
    project: career.projects[0], budgetNote, withinBudget, warnings,
  };
}

export function buildRoadmap(i: PlanInput): Roadmap {
  const c = getCareer(i.careerId) ?? CAREERS[0];
  const r = c.resources;
  const eff = (h: number) => `${Math.max(1, Math.round(h))} h · ~${Math.max(1, Math.ceil(h / Math.max(1, i.hours)))} wk`;
  const scale = i.level === "comfortable" ? 0.6 : i.level === "some" ? 0.8 : 1;
  const t = (phase: number, title: string, desc: string, h: number, res?: { name: string; url: string }): Task => ({
    id: `${phase}-${title}`.toLowerCase().replace(/[^a-z0-9]+/g, "-"), phase, title, desc, effort: eff(h * scale), resource: res ? { name: res.name, url: res.url } : undefined, done: false,
  });
  const tasks: Task[] = [
    t(1, `What does a ${c.name} do?`, c.day, 2),
    t(1, `Foundations: ${c.skills[0]}`, `Learn the basics of ${c.skills[0].toLowerCase()} using a free resource.`, 8, r[0]),
    t(1, `Foundations: ${c.skills[1]}`, `Get comfortable with ${c.skills[1].toLowerCase()}.`, 8, r[1] ?? r[0]),
    t(2, `Core skill: ${c.skills[2]}`, `Practise ${c.skills[2].toLowerCase()} with small exercises.`, 10, r[2] ?? r[0]),
    t(2, `Core skill: ${c.skills[3]}`, `Apply ${c.skills[3].toLowerCase()} to a tiny example.`, 10, r[0]),
    t(3, "Plan your beginner project", `Outline: ${i.project || c.projects[0]}. Write down goals and features.`, 2),
    t(3, "Build your beginner project", `Build a first working version of “${i.project || c.projects[0]}”.`, 15),
    t(3, "Get feedback", "Show your work to a friend, teacher or online community and note feedback.", 2),
    t(4, "Reflect on the experience", "Did you enjoy it? What felt hard? Note it in your journal.", 1),
    t(4, "Decide your next step", "Continue deeper, try a related career, or compare with another path.", 1),
  ];
  return { careerId: c.id, level: i.level, hours: i.hours, budget: i.budget, format: i.format, project: i.project || c.projects[0], createdAt: Date.now(), tasks };
}
