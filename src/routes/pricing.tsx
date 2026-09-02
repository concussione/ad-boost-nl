import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, KeyRound, Eye, CalendarX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PACKAGES, euro, type Package } from "@/data/mockData";
import { strings } from "@/data/strings";
import { useDemo } from "@/lib/prototype-state";

type Search = { from?: "welcome" | "settings" };

export const Route = createFileRoute("/pricing")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    from: search["from"] === "settings" ? "settings" : "welcome",
  }),
  head: () => ({
    meta: [
      { title: strings.pricing.metaTitle },
      { name: "description", content: strings.pricing.metaDescription },
      { property: "og:title", content: strings.pricing.metaTitle },
      { property: "og:description", content: strings.pricing.metaDescription },
    ],
  }),
  component: PricingPage,
});

const trustIcons = [KeyRound, Eye, CalendarX];

function PricingPage() {
  const { from } = Route.useSearch();
  const navigate = useNavigate();
  const { state, update } = useDemo();
  const t = strings.pricing;

  const choose = (p: Package) => {
    update({ selectedPackage: p.id });
    if (state.onboarded) navigate({ to: "/wallet" });
    else navigate({ to: "/onboarding" });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-md px-5 pb-16 pt-6">
        <button
          onClick={() => navigate({ to: from === "settings" ? "/settings" : "/" })}
          aria-label={t.back}
          className="grid h-12 w-12 place-items-center rounded-2xl border border-border bg-card"
        >
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>

        <h1 className="mt-6 text-3xl font-bold tracking-tight text-foreground">{t.heading}</h1>
        <p className="mt-2 text-base text-muted-foreground">{t.subheading}</p>

        <div className="mt-7 space-y-4">
          {PACKAGES.map((p) => (
            <div
              key={p.id}
              className={`rounded-3xl bg-card p-6 ${
                p.mostChosen ? "border-2 border-primary" : "border border-border"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-muted-foreground">{p.name}</p>
                {p.mostChosen && (
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                    {t.mostChosen}
                  </span>
                )}
              </div>

              <p className="mt-3 text-4xl font-bold tabular-nums tracking-tight text-foreground">
                {euro(p.monthlyFee)}{" "}
                <span className="text-base font-medium text-muted-foreground">{t.perMonth}</span>
              </p>

              <div className="my-5 h-px w-full bg-border" />

              <p className="text-2xl font-semibold tabular-nums text-foreground">
                {t.budgetPrefix} {euro(p.adBudget)}
              </p>
              <p className="mt-1 text-base text-muted-foreground">{t.budgetSuffix}</p>

              <p className="mt-4 text-base text-foreground">{p.description}</p>

              <Button
                className="mt-6 h-14 w-full rounded-2xl text-base font-semibold"
                variant={p.mostChosen ? "default" : "secondary"}
                onClick={() => choose(p)}
              >
                {t.chooseLabel(p.name)}
              </Button>
            </div>
          ))}
        </div>

        <ul className="mt-9 space-y-5">
          {t.trustLines.map((line, i) => {
            const Icon = trustIcons[i] ?? KeyRound;
            return (
              <li key={line} className="flex items-start gap-3">
                <Icon className="mt-1 h-5 w-5 shrink-0 text-muted-foreground" strokeWidth={1.5} />
                <span className="text-base leading-relaxed text-foreground">{line}</span>
              </li>
            );
          })}
        </ul>

        <p className="mt-8 text-sm text-muted-foreground">{t.footnote}</p>
      </div>
    </div>
  );
}
