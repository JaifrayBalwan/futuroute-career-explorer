<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Futuroute architecture
- Accounts, profiles and preferences live in Lovable Cloud (RLS per user; careers public-read, admin-write via user_roles/has_role). Sign-in is Supabase email/password (confirmation required by the project) plus Google OAuth; `/login`, `/register`, `/forgot-password` and `/reset-password` share the components in `src/components/auth/`.
- Signed-in-only pages live under `src/routes/_authenticated/` (client-only gate to `/login?next=…`). Exploration progress (saved careers, comparisons, roadmap, challenges) is kept per account in `src/lib/store.ts` localStorage via `setDataOwner`, which follows the session; moving it into the `saved_careers`/`roadmaps` tables is still open.
- Recommendations/plans come from the deterministic rule engine in `src/lib/engine.ts`; AI prompt templates in `src/lib/ai-prompts.ts` must only be called from a server function when live AI is added.
- Career content is curated in `src/lib/careers.ts`; only add resource URLs that have been checked to load.
- App pages wrap content in `AppShell`; the public homepage (`/`) has its own header.
