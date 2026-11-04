import { createFileRoute, Link } from "@tanstack/react-router";
import { Bookmark, GitCompareArrows } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Glass, PageHeader, EmptyState, btnClass } from "@/components/ui-kit";
import { CareerCard } from "@/components/CareerParts";
import { getCareer } from "@/lib/careers";
import { actions, useApp } from "@/lib/store";

export const Route = createFileRoute("/saved")({
  head: () => ({
    meta: [
      { title: "Saved Careers — Futuroute" },
      { name: "description", content: "Careers you've saved to explore and compare." },
      { property: "og:title", content: "Saved Careers — Futuroute" },
      { property: "og:description", content: "Your saved career shortlist." },
    ],
  }),
  component: Saved,
});

function Saved() {
  const { saved } = useApp();
  const list = saved.map(getCareer).filter(Boolean);
  return (
    <AppShell>
      <PageHeader title="Saved Careers" text="Your shortlist. Compare any of them side by side.">
        {saved.length >= 2 && <Link to="/compare" onClick={() => actions.setCompare(saved.slice(0, 3))} className={btnClass("primary")}><GitCompareArrows className="size-4" />Compare saved</Link>}
      </PageHeader>
      {list.length === 0 ? <Glass><EmptyState icon={<Bookmark className="size-5" />} title="No saved careers" text="Save careers from Discover, Compare or any career profile." action={{ label: "Discover careers", to: "/discover" }} /></Glass>
        : <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{list.map((c) => <CareerCard key={c!.id} career={c!} />)}</div>}
    </AppShell>
  );
}
