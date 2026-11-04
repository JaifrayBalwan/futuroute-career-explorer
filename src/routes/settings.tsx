import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Glass, PageHeader, Button, Notice, DemoBadge } from "@/components/ui-kit";
import { actions, useApp } from "@/lib/store";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Futuroute" },
      { name: "description", content: "Manage your Futuroute demo data stored in this browser." },
      { property: "og:title", content: "Settings — Futuroute" },
      { property: "og:description", content: "Manage local demo data." },
    ],
  }),
  component: Settings,
});

function Settings() {
  const s = useApp();
  const [msg, setMsg] = useState("");
  const exportData = () => {
    const blob = new Blob([JSON.stringify(s, null, 2)], { type: "application/json" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "futuroute-data.json"; a.click();
  };
  return (
    <AppShell>
      <PageHeader title="Settings" text="Futuroute currently runs as a demonstration. There are no accounts." />
      <div className="grid max-w-3xl gap-5">
        <Glass><h2 className="font-display text-lg font-semibold">Your data</h2>
          <p className="mt-2 text-sm text-text-2">Everything is saved in this browser's local storage: {s.saved.length} saved careers, {Object.keys(s.challenges).length} challenges, {s.roadmap ? s.roadmap.tasks.length : 0} roadmap tasks, {s.activity.length} activity events. Nothing is sent to a server.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="outline" onClick={exportData}>Download my data</Button>
            <Button variant="outline" onClick={() => { if (confirm("Delete all Futuroute data in this browser?")) { actions.reset(); setMsg("All local data cleared."); } }}>Reset all data</Button>
          </div>
          {msg && <div className="mt-3"><Notice tone="success">{msg}</Notice></div>}
        </Glass>
        <Glass><h2 className="font-display text-lg font-semibold">AI status</h2><div className="mt-3"><DemoBadge /></div>
          <p className="mt-2 text-sm text-text-2">Recommendations use transparent rule-based matching and curated sample content. Prompt templates are prepared for a future secure server-side AI integration.</p></Glass>
      </div>
    </AppShell>
  );
}
