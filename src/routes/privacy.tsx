import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy — AdBoost" },
      { name: "description", content: "How AdBoost handles your business details." },
      { property: "og:title", content: "Privacy — AdBoost" },
      { property: "og:description", content: "How AdBoost handles your business details." },
    ],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-md px-5 py-8">
        <Link to="/settings" className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <h1 className="mt-6 text-2xl font-bold text-foreground">Privacy</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          This page is empty for now. It will explain what we store and why.
        </p>
      </div>
    </div>
  );
}
