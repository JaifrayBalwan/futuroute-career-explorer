import { describe, expect, it } from "vitest";
import { recommend, buildPlan, buildRoadmap } from "@/lib/engine";

describe("demo engine", () => {
  it("prioritises UI/UX for design + psychology answers", () => {
    const r = recommend({ subjects: ["Art & Design", "Psychology"], work: ["Designing visuals"] });
    expect(r[0]!.career.id).toBe("ui-ux-designer");
  });
  it("prioritises cybersecurity for investigation + safety answers", () => {
    const r = recommend({ interests: ["Investigating mysteries"], work: ["Protecting systems"] });
    expect(r[0]!.career.id).toBe("cybersecurity-analyst");
  });
  it("returns between 3 and 5 careers", () => {
    expect(recommend({}).length).toBe(3);
  });
  it("core plan needs ₹0 and so fits a zero budget", () => {
    const p = buildPlan({ careerId: "data-analyst", level: "beginner", budget: 0, hours: 5, device: "laptop", format: "mixed", outcome: "fundamentals" });
    expect(p.withinBudget).toBe(true);
    expect(p.free.every((r) => r.url.startsWith("https://"))).toBe(true);
  });
  it("roadmap covers four phases with no tasks done", () => {
    const r = buildRoadmap({ careerId: "web-developer", level: "beginner", budget: 0, hours: 5, device: "laptop", format: "mixed", outcome: "project" });
    expect(new Set(r.tasks.map((t) => t.phase))).toEqual(new Set([1, 2, 3, 4]));
    expect(r.tasks.some((t) => t.done)).toBe(false);
  });
});
