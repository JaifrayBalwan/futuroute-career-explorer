import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/ui-kit";
import { ProfileForm } from "@/components/ProfileForm";
import { useUser } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({ meta: [
    { title: "My profile — Futuroute" },
    { name: "description", content: "Update your interests, strengths, budget and goals." },
    { property: "og:title", content: "My profile — Futuroute" },
    { property: "og:description", content: "Manage your Futuroute profile." },
  ] }),
  component: Profile,
});

function Profile() {
  const { user } = useUser();
  return (
    <AppShell>
      <PageHeader title="My profile" text={user?.email ? `Signed in as ${user.email}` : ""} />
      <div className="max-w-3xl">{user && <ProfileForm userId={user.id} submitLabel="Save changes" />}</div>
    </AppShell>
  );
}
