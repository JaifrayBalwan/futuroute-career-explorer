import { beforeEach, describe, expect, it } from "vitest";

import { checkPassword, safeNext, signInError, signUpError } from "@/lib/auth";
import { actions, setDataOwner } from "@/lib/store";

describe("safeNext", () => {
  it("keeps same-site paths", () => {
    expect(safeNext("/roadmap?tab=2")).toBe("/roadmap?tab=2");
  });

  it("rejects protocol-relative and external redirects", () => {
    expect(safeNext("//evil.example")).toBe("/dashboard");
    expect(safeNext("https://evil.example")).toBe("/dashboard");
    expect(safeNext(undefined)).toBe("/dashboard");
  });
});

describe("checkPassword", () => {
  it("requires length, a letter and a number", () => {
    expect(checkPassword("short1").valid).toBe(false);
    expect(checkPassword("allletters").valid).toBe(false);
    expect(checkPassword("12345678").valid).toBe(false);
    expect(checkPassword("futuroute1").valid).toBe(true);
  });

  it("scores stronger passwords higher", () => {
    expect(checkPassword("futuroute1").score).toBeLessThan(checkPassword("Futuroute-2026!").score);
    expect(checkPassword("Futuroute-2026!").label).toBe("Very strong");
  });
});

describe("auth error messages", () => {
  it("explains wrong credentials and unconfirmed email", () => {
    expect(signInError("Invalid login credentials")).toContain("incorrect");
    expect(signInError("Email not confirmed")).toContain("confirm your email");
  });

  it("explains duplicate registration", () => {
    expect(signUpError("User already registered")).toContain("already exists");
    expect(signUpError("", true)).toContain("already exists");
  });
});

describe("per-account exploration data", () => {
  beforeEach(() => localStorage.clear());

  it("keeps each account's saved careers separate", () => {
    setDataOwner("user-a");
    actions.toggleSave("data-analyst", "Data Analyst");

    setDataOwner("user-b");
    actions.toggleSave("ui-ux-designer", "UI/UX Designer");

    setDataOwner("user-a");
    actions.toggleSave("cybersecurity-analyst", "Cybersecurity Analyst");

    const a = JSON.parse(localStorage.getItem("futuroute:v1:user:user-a") ?? "{}") as {
      saved: string[];
    };
    const b = JSON.parse(localStorage.getItem("futuroute:v1:user:user-b") ?? "{}") as {
      saved: string[];
    };
    expect(a.saved).toContain("data-analyst");
    expect(a.saved).toContain("cybersecurity-analyst");
    expect(a.saved).not.toContain("ui-ux-designer");
    expect(b.saved).toContain("ui-ux-designer");
    expect(b.saved).not.toContain("data-analyst");
  });

  it("hands guest progress to the first account that signs in", () => {
    setDataOwner(null);
    actions.toggleSave("ai-ml-engineer", "AI/ML Engineer");

    setDataOwner("user-c");
    actions.toggleSave("web-developer", "Web Developer");

    const claimed = localStorage.getItem("futuroute:v1:user:user-c") ?? "";
    expect(claimed).toContain("ai-ml-engineer");
    expect(claimed).toContain("web-developer");
    expect(localStorage.getItem("futuroute:v1")).toBeNull();
  });
});
