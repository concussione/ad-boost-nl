import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { AppShell } from "@/components/BottomTabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDemo } from "@/lib/prototype-state";
import { PACKAGES, euro, tierForAmount } from "@/data/mockData";
import { strings } from "@/data/strings";

export const Route = createFileRoute("/wallet")({
  head: () => ({
    meta: [
      { title: strings.adPackage.metaTitle },
      { name: "description", content: strings.adPackage.metaDescription },
      { property: "og:title", content: strings.adPackage.metaTitle },
      { property: "og:description", content: strings.adPackage.metaDescription },
    ],
  }),
  component: PackagePage,
});

const t = strings.adPackage;

function tierLine(amount: number) {
  const tier = tierForAmount(amount);
  return `${tier.name} · ${euro(tier.monthlyFee)} ${strings.pricing.perMonth}`;
}

function PackagePage() {
  const { state, hydrated, topUp } = useDemo();
  const navigate = useNavigate();
  const preselected = PACKAGES.find((p) => p.id === state.selectedPackage);
  const [selected, setSelected] = useState<number>(preselected?.adBudget ?? PACKAGES[0]!.adBudget);
  const [custom, setCustom] = useState("");
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (hydrated && !state.onboarded) navigate({ to: "/" });
  }, [hydrated, state.onboarded, navigate]);

  useEffect(() => {
    if (preselected) setSelected(preselected.adBudget);
  }, [preselected]);

  const customValue = Number(custom) || 0;
  const amount = custom ? customValue : selected;
  const valid = amount > 0;

  return (
    <AppShell title={t.title}>
      <Link
        to="/pricing"
        search={{ from: "settings" as const }}
        className="inline-flex items-center gap-2 text-base font-medium text-primary underline"
      >
        {t.seeAllPackages} <ArrowRight className="h-4 w-4" />
      </Link>

      <div className="rounded-3xl bg-primary p-6 text-primary-foreground">
        <p className="text-sm opacity-90">{t.leftInPackage}</p>
        <p className="mt-1 text-4xl font-bold tabular-nums tracking-tight">{euro(state.balance)}</p>
        <p className="mt-2 text-sm opacity-90">
          {state.balance > 0 ? t.activeNote : t.emptyNote}
        </p>
      </div>

      <div className="space-y-3">
        <p className="font-semibold text-foreground">{t.chooseHeading}</p>
        {PACKAGES.map((p) => {
          const active = !custom && selected === p.adBudget;
          return (
            <button
              key={p.id}
              onClick={() => {
                setCustom("");
                setSelected(p.adBudget);
              }}
              className={`w-full rounded-3xl border-2 px-6 py-5 text-left transition-colors ${
                active ? "border-primary bg-primary/5" : "border-border bg-card"
              }`}
            >
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
                <span className="text-xl font-bold tabular-nums text-foreground">
                  {euro(p.adBudget)}
                </span>
                <span className="shrink-0 text-sm text-muted-foreground">
                  {p.name} · {euro(p.monthlyFee)} {strings.pricing.perMonth}
                </span>
              </div>
              <p className="mt-2 text-sm tabular-nums text-muted-foreground">
                {t.reachPrefix} {p.reachLow.toLocaleString("en-US")}–
                {p.reachHigh.toLocaleString("en-US")} {t.reachSuffix}
              </p>
            </button>
          );
        })}

        <p className="px-1 text-xs text-muted-foreground">{t.estimateNote}</p>

        <div className="rounded-3xl border border-border bg-card p-5">
          <label className="text-base font-medium text-foreground">{t.customLabel}</label>
          <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <Input
              inputMode="numeric"
              value={custom}
              onChange={(e) => setCustom(e.target.value.replace(/[^0-9]/g, ""))}
              placeholder={t.customPlaceholder}
              className="h-14 rounded-2xl text-base"
            />
            <span className="shrink-0 text-sm text-muted-foreground">
              {customValue > 0 ? tierLine(customValue) : "—"}
            </span>
          </div>
        </div>
      </div>

      <Button
        size="lg"
        disabled={!valid}
        className="h-14 w-full rounded-2xl text-base font-semibold"
        onClick={() => {
          setDone(false);
          setOpen(true);
        }}
      >
        {t.payButton(euro(amount || 0))}
      </Button>

      <p className="flex items-start gap-2 text-xs text-muted-foreground">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
        {t.ownership}
      </p>

      <div className="rounded-3xl border border-border bg-card">
        <p className="px-5 pt-5 font-semibold text-foreground">{t.historyTitle}</p>
        <div className="mt-2 divide-y divide-border">
          {state.transactions.map((tx) => (
            <div
              key={tx.id}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-5 py-4"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{tx.label}</p>
                <p className="text-xs text-muted-foreground">{tx.date}</p>
              </div>
              <span
                className={`shrink-0 text-sm font-semibold tabular-nums ${
                  tx.amount > 0 ? "text-primary" : "text-foreground"
                }`}
              >
                {tx.amount > 0 ? "+" : "−"}
                {euro(Math.abs(tx.amount))}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle>
              {done ? t.dialogTitleDone : t.dialogTitle(euro(amount))}
            </DialogTitle>
            <DialogDescription>
              {done ? t.dialogDescriptionDone : t.dialogDescription}
            </DialogDescription>
          </DialogHeader>
          {!done ? (
            <div className="space-y-3">
              <div className="rounded-2xl bg-secondary p-4 text-sm text-muted-foreground">
                {t.dialogSummary(
                  euro(amount),
                  tierForAmount(amount).name,
                  euro(tierForAmount(amount).monthlyFee),
                )}
              </div>
              <Button
                className="h-14 w-full rounded-2xl text-base font-semibold"
                onClick={() => {
                  topUp(amount);
                  setDone(true);
                  setCustom("");
                  try {
                    sessionStorage.setItem("adboost-celebrate", "1");
                  } catch {
                    /* ignore */
                  }
                }}
              >
                {t.simulate}
              </Button>
            </div>
          ) : (
            <Button
              className="h-14 w-full rounded-2xl text-base font-semibold"
              onClick={() => {
                setOpen(false);
                navigate({ to: "/dashboard" });
              }}
            >
              {t.seeResults}
            </Button>
          )}
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
