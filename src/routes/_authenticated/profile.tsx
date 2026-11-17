import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PageHeader, Glass, btnClass } from "@/components/ui-kit";
import { ProfileForm } from "@/components/ProfileForm";
import { AccountPanel } from "@/components/AccountPanel";
import { useUser } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "My profile — Futuroute" },
      {
        name: "description",
        content: "Update your name, interests, strengths, learning budget and goals.",
      },
      { property: "og:title", content: "My profile — Futuroute" },
      { property: "og:description", content: "Manage your Futuroute account and profile." },
    ],
  }),
  component: Profile,
});

function Profile() {
  const { user } = useUser();
  return (
    <AppShell>
      <PageHeader
        title="My profile"
        text={
          user?.email
            ? `Signed in as ${user.email}`
            : "Manage your details and how Futuroute matches careers to you."
        }
      >
        <Link to="/settings" className={btnClass("outline")}>
          Account settings
        </Link>
      </PageHeader>
      <div className="grid max-w-5xl gap-6">
        <section aria-labelledby="profile-details">
          <h2 id="profile-details" className="mb-3 font-display text-xl font-semibold">
            Career profile
          </h2>
          {user && <ProfileForm userId={user.id} submitLabel="Save changes" />}
        </section>
        <section aria-labelledby="account-security">
          <h2 id="account-security" className="mb-3 font-display text-xl font-semibold">
            Account
          </h2>
          <div className="max-w-3xl">
            <AccountPanel />
          </div>
        </section>
        {!user && (
          <Glass>
            <p className="text-sm text-text-2">Loading your account…</p>
          </Glass>
        )}
      </div>
    </AppShell>
  );
}
