import { useEffect, useSyncExternalStore } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

/* -------------------------------------------------------------------------- */
/* Shared auth state                                                          */
/* -------------------------------------------------------------------------- */

type Snapshot = { user: User | null; loading: boolean };
const SERVER_SNAPSHOT: Snapshot = { user: null, loading: true };

let snapshot: Snapshot = SERVER_SNAPSHOT;
const listeners = new Set<() => void>();
let started = false;

const emit = () => listeners.forEach((l) => l());
const setSnapshot = (next: Snapshot) => {
  if (snapshot.user === next.user && snapshot.loading === next.loading) return;
  snapshot = next;
  emit();
};

/** One auth subscription for the whole app, so every hook sees the same session. */
function start() {
  if (started || typeof window === "undefined") return;
  started = true;
  supabase.auth.onAuthStateChange((_event, session) => {
    setSnapshot({ user: session?.user ?? null, loading: false });
  });
  void supabase.auth
    .getUser()
    .then(({ data }) => setSnapshot({ user: data.user ?? null, loading: false }));
}

export function useUser(): Snapshot {
  useEffect(start, []);
  return useSyncExternalStore(
    (cb) => {
      start();
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => snapshot,
    () => SERVER_SNAPSHOT,
  );
}

/* -------------------------------------------------------------------------- */
/* Redirect handling                                                          */
/* -------------------------------------------------------------------------- */

const FALLBACK_PATH = "/dashboard";

/** Only allow same-site relative paths back, so `?next=` can't be used as an open redirect. */
export function safeNext(next: unknown): string {
  return typeof next === "string" && next.startsWith("/") && !next.startsWith("//")
    ? next
    : FALLBACK_PATH;
}

async function isOnboarded(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("profiles")
    .select("onboarded")
    .eq("id", userId)
    .maybeSingle();
  if (error) return false;
  return Boolean(data?.onboarded);
}

/** Where a signed-in user should land: onboarding until their profile is complete, then `next`. */
export async function destinationForUser(user: User, next?: unknown): Promise<string> {
  return (await isOnboarded(user.id)) ? safeNext(next) : "/onboarding";
}

/** Full in-app path (pathname + search) of the current page, used as `next` on redirects. */
export function currentPath(): string {
  if (typeof window === "undefined") return "/";
  return window.location.pathname + window.location.search;
}

/* -------------------------------------------------------------------------- */
/* Error messages                                                             */
/* -------------------------------------------------------------------------- */

const has = (message: string, ...needles: string[]) =>
  needles.some((n) => message.toLowerCase().includes(n));

export function signInError(message: string): string {
  if (has(message, "invalid login credentials")) {
    return "Email or password is incorrect. If you created this account with Google, use “Continue with Google”.";
  }
  if (has(message, "email not confirmed")) {
    return "Please confirm your email address first — open the confirmation link we emailed you, then sign in.";
  }
  if (has(message, "too many", "rate limit", "after", "security purposes")) {
    return "Too many attempts. Please wait a minute and try again.";
  }
  if (has(message, "failed to fetch", "network")) {
    return "We couldn't reach the sign-in service. Check your connection and try again.";
  }
  return message;
}

export function signUpError(message: string, alreadyRegistered = false): string {
  if (alreadyRegistered)
    return "An account with this email already exists. Try signing in instead.";
  if (has(message, "already registered", "already been registered")) {
    return "An account with this email already exists. Try signing in instead.";
  }
  if (has(message, "password should be", "password is too short")) {
    return "That password is too short. Use at least 8 characters with a letter and a number.";
  }
  if (has(message, "unable to validate email", "invalid email"))
    return "Please enter a valid email address.";
  if (has(message, "signups not allowed")) {
    return "New sign-ups are currently disabled for this project. Please contact the Futuroute team.";
  }
  if (has(message, "too many", "rate limit"))
    return "Too many attempts. Please wait a few minutes and try again.";
  return message;
}

export function googleError(message: string): string {
  if (has(message, "missing oauth secret", "provider is not enabled", "unsupported provider")) {
    return "Google sign-in isn't configured for this project yet. Use email and password for now — the site owner needs to add Google OAuth credentials in Lovable Cloud → Authentication → Providers.";
  }
  if (has(message, "redirect_uri", "redirect uri")) {
    return "Google sign-in can't return to this address yet. The site owner needs to allow this URL in the authentication redirect settings.";
  }
  return message;
}

/* -------------------------------------------------------------------------- */
/* Password strength                                                          */
/* -------------------------------------------------------------------------- */

export type PasswordRule = { label: string; ok: boolean; required: boolean };

export type PasswordCheck = {
  /** 0 = too weak … 4 = very strong */
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
  rules: PasswordRule[];
  valid: boolean;
};

const LABELS = ["Too weak", "Weak", "Fair", "Strong", "Very strong"] as const;

/** Rules required to create an account, plus the (recommended) extras shown in the meter. */
export function checkPassword(password: string): PasswordCheck {
  const rules: PasswordRule[] = [
    { label: "At least 8 characters", ok: password.length >= 8, required: true },
    { label: "A letter", ok: /[A-Za-z]/.test(password), required: true },
    { label: "A number", ok: /\d/.test(password), required: true },
    { label: "A symbol for extra strength", ok: /[^A-Za-z0-9]/.test(password), required: false },
  ];
  const met = rules.filter((r) => r.ok).length;
  const strongLength = password.length >= 12;
  const score = (
    password.length === 0 ? 0 : Math.min(4, met - 1 + (strongLength || rules[3]!.ok ? 1 : 0))
  ) as PasswordCheck["score"];
  return {
    score,
    label: LABELS[score] ?? LABELS[0],
    rules,
    valid: rules.filter((r) => r.required).every((r) => r.ok),
  };
}

/* -------------------------------------------------------------------------- */
/* Profile vocabularies                                                       */
/* -------------------------------------------------------------------------- */

export const INTERESTS: [string, string][] = [
  ["sports", "Sports and Football"],
  ["gaming", "Gaming"],
  ["technology", "Technology"],
  ["ai", "Artificial Intelligence"],
  ["business", "Business and Entrepreneurship"],
  ["music", "Music"],
  ["art_design", "Art and Design"],
  ["writing", "Writing"],
  ["history", "History"],
  ["science", "Science"],
  ["mathematics", "Mathematics"],
  ["travel", "Travelling"],
  ["social", "Social Activities"],
  ["healthcare", "Healthcare"],
  ["law", "Law"],
  ["environment", "Nature and Environment"],
  ["media", "Media and Entertainment"],
  ["teaching", "Teaching and Education"],
];
export const CAPABILITIES: [string, string][] = [
  ["leadership", "Leadership"],
  ["communication", "Communication"],
  ["creativity", "Creativity"],
  ["analytical", "Analytical Thinking"],
  ["problem_solving", "Problem Solving"],
  ["mathematics", "Mathematics"],
  ["teamwork", "Teamwork"],
  ["observation", "Observation"],
  ["public_speaking", "Public Speaking"],
  ["writing", "Writing"],
  ["research", "Research"],
  ["fitness", "Physical Fitness"],
  ["organisation", "Organisation"],
  ["critical_thinking", "Critical Thinking"],
  ["technical", "Technical Skills"],
];
export const SUBJECTS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
  "English",
  "Hindi / Regional language",
  "History",
  "Geography",
  "Economics",
  "Business Studies",
  "Accountancy",
  "Political Science",
  "Psychology",
  "Fine Arts",
  "Physical Education",
  "Music",
];
