import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

/**
 * Every page under this layout needs a signed-in account. The check runs before the
 * page renders, so a private URL can't be opened without a valid session, and the
 * visitor is sent back to the page they asked for once they sign in.
 */
export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      throw redirect({ to: "/login", search: { next: location.href }, replace: true });
    }
  },
  component: () => <Outlet />,
});
