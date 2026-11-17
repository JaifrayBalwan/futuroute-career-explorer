import { createFileRoute, redirect } from "@tanstack/react-router";

/** Legacy entry point: old links and bookmarks to /auth now go to the sign-in page. */
export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>) => ({
    next: typeof s["next"] === "string" ? s["next"] : undefined,
  }),
  beforeLoad: ({ search }) => {
    throw redirect({ to: "/login", search: { next: search.next }, replace: true });
  },
});
