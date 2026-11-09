import { useSyncExternalStore } from "react";

export type Task = { id: string; phase: number; title: string; desc: string; effort: string; resource?: { name: string; url: string } | undefined; done: boolean };
export type Roadmap = { careerId: string; level: string; hours: number; budget: number; format: string; project: string; createdAt: number; tasks: Task[] };
export type ChallengeResult = { correct: boolean; answer: string; enjoy?: "enjoyed" | "okay" | "not"; reflection?: string; at: number };
export type Activity = { id: string; text: string; at: number; kind: "save" | "compare" | "task" | "challenge" | "roadmap" | "discover" };
export type DiscoveryAnswers = Record<string, string | string[] | number>;

export type AppState = {
  saved: string[];
  compare: string[];
  recent: string[];
  comparedCount: number;
  activity: Activity[];
  discovery?: { answers: DiscoveryAnswers; results: string[]; at: number };
  challenges: Record<string, ChallengeResult>;
  roadmap?: Roadmap;
};

const KEY = "futuroute:v1";
const DEFAULT: AppState = { saved: [], compare: ["software-developer", "ui-ux-designer"], recent: [], comparedCount: 0, activity: [], challenges: {} };

let state: AppState = DEFAULT;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) state = { ...DEFAULT, ...JSON.parse(raw) };
  } catch {
    state = DEFAULT;
  }
}

export function setState(fn: (s: AppState) => AppState) {
  load();
  state = fn(state);
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* storage full or blocked */ }
  listeners.forEach((l) => l());
}

export function useApp(): AppState {
  return useSyncExternalStore(
    (l) => { load(); listeners.add(l); queueMicrotask(l); return () => listeners.delete(l); },
    () => state,
    () => DEFAULT,
  );
}

const uid = () => Math.random().toString(36).slice(2, 10);
export const log = (s: AppState, text: string, kind: Activity["kind"]): AppState => ({
  ...s,
  activity: [{ id: uid(), text, at: Date.now(), kind }, ...s.activity].slice(0, 30),
});

export const actions = {
  toggleSave(id: string, name: string) {
    setState((s) => s.saved.includes(id)
      ? log({ ...s, saved: s.saved.filter((x) => x !== id) }, `Removed ${name} from saved careers`, "save")
      : log({ ...s, saved: [...s.saved, id] }, `Saved ${name}`, "save"));
  },
  visit(id: string) {
    setState((s) => ({ ...s, recent: [id, ...s.recent.filter((x) => x !== id)].slice(0, 6) }));
  },
  setCompare(ids: string[]) { setState((s) => ({ ...s, compare: ids.slice(0, 3) })); },
  markCompared(names: string[]) {
    setState((s) => log({ ...s, comparedCount: s.comparedCount + 1 }, `Compared ${names.join(" vs ")}`, "compare"));
  },
  setDiscovery(answers: DiscoveryAnswers, results: string[]) {
    setState((s) => log({ ...s, discovery: { answers, results, at: Date.now() } }, "Completed career discovery", "discover"));
  },
  setChallenge(id: string, r: Partial<ChallengeResult>, label?: string) {
    setState((s) => {
      const next = { ...s, challenges: { ...s.challenges, [id]: { ...(s.challenges[id] ?? { correct: false, answer: "", at: Date.now() }), ...r } } };
      return label ? log(next, label, "challenge") : next;
    });
  },
  setRoadmap(r: Roadmap, name: string) { setState((s) => log({ ...s, roadmap: r }, `Created a roadmap for ${name}`, "roadmap")); },
  toggleTask(taskId: string) {
    setState((s) => {
      if (!s.roadmap) return s;
      const tasks = s.roadmap.tasks.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t));
      const t = tasks.find((x) => x.id === taskId)!;
      return log({ ...s, roadmap: { ...s.roadmap, tasks } }, `${t.done ? "Completed" : "Reopened"} task: ${t.title}`, "task");
    });
  },
  reset() { setState(() => DEFAULT); },
};

export function roadmapProgress(r?: Roadmap) {
  if (!r || r.tasks.length === 0) return { done: 0, total: 0, pct: 0, phase: 0 };
  const done = r.tasks.filter((t) => t.done).length;
  const next = r.tasks.find((t) => !t.done);
  return { done, total: r.tasks.length, pct: Math.round((done / r.tasks.length) * 100), phase: next ? next.phase : 4 };
}
