// Prompt templates prepared for a future secure server-side AI integration.
// Not called anywhere yet: the app runs in Demo Mode (rule-based engine in engine.ts).
// When adding live AI, call these from a createServerFn handler — never from the browser —
// and validate the JSON response before rendering it.

export const AI_CONFIGURED = false;

const RULES = `Never invent salaries, prices, statistics or compatibility percentages. Present suggestions as starting points for exploration, not decisions. Respond ONLY with valid JSON matching the schema.`;

export const prompts = {
  discovery: (answers: unknown) => `You are a career exploration guide for Indian school and college students. ${RULES}
Student answers: ${JSON.stringify(answers)}
Return {"careers":[{"id":string,"whyAligned":string[],"activities":string[],"skills":string[],"routes":string[],"pros":string[],"cons":string[],"trial":string,"nextSteps":string[]}]} with 3-5 careers.`,
  comparison: (careerIds: string[]) => `Compare these careers for a student: ${careerIds.join(", ")}. ${RULES} Do not declare a winner.
Return {"summary":string,"tradeoffs":string[],"tryFirst":[{"careerId":string,"activity":string}]}.`,
  roadmap: (input: unknown) => `Create a budget-aware beginner roadmap. Prefer free resources; only include URLs you are certain exist, otherwise set "url": null. ${RULES}
Input: ${JSON.stringify(input)}
Return {"phases":[{"phase":1|2|3|4,"tasks":[{"title":string,"desc":string,"hours":number,"resource":{"name":string,"url":string|null}|null}]}]}.`,
  challenge: (careerId: string) => `Design one short beginner challenge (under 10 minutes) for ${careerId}. ${RULES}
Return {"instructions":string,"options":string[],"answerIndex":number,"explanation":string,"skills":string[],"reflection":string}.`,
};
