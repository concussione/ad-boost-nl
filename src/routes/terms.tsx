import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms — AdBoost" },
      { name: "description", content: "Terms for the AdBoost managed local ads service." },
      { property: "og:title", content: "Terms — AdBoost" },
      { property: "og:description", content: "Terms for the AdBoost managed local ads service." },
    ],
  }),
  component: Terms,
});

function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-md px-5 py-8">
        <Link to="/settings" className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <h1 className="mt-6 text-2xl font-bold text-foreground">Terms</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          This page is empty for now. It will hold the terms of the service.
        </p>
      </div>
    </div>
  );
}
