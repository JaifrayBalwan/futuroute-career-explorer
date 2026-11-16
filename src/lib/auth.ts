import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => { setUser(data.user); setLoading(false); });
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null));
    return () => data.subscription.unsubscribe();
  }, []);
  return { user, loading };
}

export const safeNext = (n: unknown) => (typeof n === "string" && n.startsWith("/") && !n.startsWith("//") ? n : "/dashboard");

export const INTERESTS: [string, string][] = [["sports","Sports and Football"],["gaming","Gaming"],["technology","Technology"],["ai","Artificial Intelligence"],["business","Business and Entrepreneurship"],["music","Music"],["art_design","Art and Design"],["writing","Writing"],["history","History"],["science","Science"],["mathematics","Mathematics"],["travel","Travelling"],["social","Social Activities"],["healthcare","Healthcare"],["law","Law"],["environment","Nature and Environment"],["media","Media and Entertainment"],["teaching","Teaching and Education"]];
export const CAPABILITIES: [string, string][] = [["leadership","Leadership"],["communication","Communication"],["creativity","Creativity"],["analytical","Analytical Thinking"],["problem_solving","Problem Solving"],["mathematics","Mathematics"],["teamwork","Teamwork"],["observation","Observation"],["public_speaking","Public Speaking"],["writing","Writing"],["research","Research"],["fitness","Physical Fitness"],["organisation","Organisation"],["critical_thinking","Critical Thinking"],["technical","Technical Skills"]];
export const SUBJECTS = ["Mathematics","Physics","Chemistry","Biology","Computer Science","English","Hindi / Regional language","History","Geography","Economics","Business Studies","Accountancy","Political Science","Psychology","Fine Arts","Physical Education","Music"];
