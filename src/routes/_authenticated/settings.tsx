import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Glass, PageHeader, Button, Notice, DemoBadge, btnClass } from "@/components/ui-kit";
import { actions, useApp } from "@/lib/store";
import { useUser } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [
      { title: "Account settings — Futuroute" },
      {
        name: "description",
        content: "Manage your Futuroute account, personal data and learning preferences.",
      },
      { property: "og:title", content: "Account settings — Futuroute" },
      { property: "og:description", content: "Manage your account and personal data." },
    ],
  }),
  component: Settings,
});

const formatDate = (value?: string | null) => {
  if (!value) return "—";
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? "—"
    : d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

function Settings() {
  const s = useApp();
  const { user } = useUser();
  const nav = useNavigate();
  const [msg, setMsg] = useState("");

  const exportData = () => {
    const blob = new Blob([JSON.stringify(s, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "futuroute-data.json";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const clearData = () => {
    if (
      !confirm(
        "Delete the careers, comparisons, roadmap and challenge progress saved for this account in this browser?",
      )
    )
      return;
    actions.reset();
    setMsg("Your exploration data for this account has been cleared.");
    toast.success("Exploration data cleared");
  };

  return (
    <AppShell>
      <PageHeader
        title="Account settings"
        text="Your account, your exploration data and how recommendations work."
      />

      <div className="grid max-w-3xl gap-5">
        <Glass>
          <h2 className="font-display text-lg font-semibold">Account</h2>
          <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground">Email</dt>
              <dd className="truncate">{user?.email ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Member since</dt>
              <dd>{formatDate(user?.created_at)}</dd>
            </div>
          </dl>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link to="/profile" className={btnClass("soft")}>
              Edit profile & password
            </Link>
            <Button
              variant="outline"
              onClick={async () => {
                await supabase.auth.signOut();
                nav({ to: "/", replace: true });
              }}
            >
              Sign out
            </Button>
          </div>
        </Glass>

        <Glass>
          <h2 className="font-display text-lg font-semibold">Your exploration data</h2>
          <p className="mt-2 text-sm text-text-2">
            Saved careers ({s.saved.length}), comparisons ({s.comparedCount}), challenges (
            {Object.keys(s.challenges).length}), roadmap tasks (
            {s.roadmap ? s.roadmap.tasks.length : 0}) and activity ({s.activity.length}) are stored
            for this account in this browser.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            They survive signing out and back in on this device, and are kept separate from other
            accounts using the same browser. Cloud sync across devices isn't enabled yet.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="outline" onClick={exportData}>
              Download my data
            </Button>
            <Button variant="outline" onClick={clearData}>
              Clear exploration data
            </Button>
          </div>
          {msg && (
            <div className="mt-3" role="status">
              <Notice tone="success">{msg}</Notice>
            </div>
          )}
        </Glass>

        <Glass>
          <h2 className="font-display text-lg font-semibold">How recommendations work</h2>
          <div className="mt-3">
            <DemoBadge />
          </div>
          <p className="mt-2 text-sm text-text-2">
            Career suggestions come from a transparent rule engine over your interests, strengths,
            subjects and constraints, using curated career descriptions. They're starting points for
            exploration — not scientific predictions, and no guarantee of admission, employment or
            salary.
          </p>
          <Link
            to="/about"
            hash="privacy"
            className="mt-3 inline-block text-sm text-lavender-bright hover:underline"
          >
            Privacy notice
          </Link>
        </Glass>
      </div>
    </AppShell>
  );
}
