import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";
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
import { DAILY_SPEND, TOPUP_PRESETS } from "@/data/mockData";

export const Route = createFileRoute("/wallet")({
  head: () => ({
    meta: [
      { title: "Your credit — AdBoost" },
      {
        name: "description",
        content: "Add credit for your local ads and see exactly how many days it lasts.",
      },
      { property: "og:title", content: "Your credit — AdBoost" },
      {
        property: "og:description",
        content: "Add credit and see exactly how many days of ads it pays for.",
      },
    ],
  }),
  component: WalletPage,
});

function daysLabel(amount: number) {
  const days = Math.floor(amount / DAILY_SPEND);
  if (days >= 30) {
    const months = Math.floor(days / 30);
    return months === 1 && days < 45 ? "1 month of ads" : `${days} days of ads`;
  }
  return `${days} ${days === 1 ? "day" : "days"} of ads`;
}

function WalletPage() {
  const { state, hydrated, topUp } = useDemo();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<number>(TOPUP_PRESETS[0] ?? 200);
  const [custom, setCustom] = useState("");
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (hydrated && !state.onboarded) navigate({ to: "/" });
  }, [hydrated, state.onboarded, navigate]);

  const customValue = Number(custom) || 0;
  const amount = custom ? customValue : selected;
  const valid = amount >= DAILY_SPEND;

  return (
    <AppShell title="Your credit">
      <div className="rounded-3xl bg-primary p-6 text-primary-foreground">
        <p className="text-sm opacity-90">Credit available</p>
        <p className="mt-1 text-4xl font-bold tracking-tight">€{state.balance}</p>
        <p className="mt-2 text-sm opacity-90">
          {state.balance > 0
            ? `That's ${daysLabel(state.balance)} at €${DAILY_SPEND} a day.`
            : `Ads cost €${DAILY_SPEND} a day. Add credit whenever you're ready.`}
        </p>
      </div>

      <div className="space-y-3">
        <p className="font-semibold text-foreground">Add credit</p>
        {TOPUP_PRESETS.map((p) => {
          const active = !custom && selected === p;
          return (
            <button
              key={p}
              onClick={() => {
                setCustom("");
                setSelected(p);
              }}
              className={`grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-3xl border-2 px-6 py-5 text-left transition-colors ${
                active ? "border-primary bg-primary/5" : "border-border bg-card"
              }`}
            >
              <span className="text-xl font-bold text-foreground">€{p}</span>
              <span className="shrink-0 text-sm text-muted-foreground">{daysLabel(p)}</span>
            </button>
          );
        })}

        <div className="rounded-3xl border border-border bg-card p-5">
          <label className="text-sm font-medium text-foreground">Or your own amount</label>
          <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <Input
              inputMode="numeric"
              value={custom}
              onChange={(e) => setCustom(e.target.value.replace(/[^0-9]/g, ""))}
              placeholder="€ amount"
              className="h-14 rounded-2xl text-base"
            />
            <span className="shrink-0 text-sm text-muted-foreground">
              {customValue >= DAILY_SPEND ? daysLabel(customValue) : "—"}
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
        Top up €{amount || 0}
      </Button>

      <p className="flex items-start gap-2 text-xs text-muted-foreground">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
        Your credit is only used to run your ads. Stop whenever you like and whatever is
        left stays yours.
      </p>

      <div className="rounded-3xl border border-border bg-card">
        <p className="px-5 pt-5 font-semibold text-foreground">History</p>
        <div className="mt-2 divide-y divide-border">
          {state.transactions.map((t) => (
            <div
              key={t.id}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-5 py-4"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{t.label}</p>
                <p className="text-xs text-muted-foreground">{t.date}</p>
              </div>
              <span
                className={`shrink-0 text-sm font-semibold ${
                  t.amount > 0 ? "text-primary" : "text-foreground"
                }`}
              >
                {t.amount > 0 ? "+" : "−"}€{Math.abs(t.amount)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle>{done ? "Credit added" : `Add €${amount} credit`}</DialogTitle>
            <DialogDescription>
              {done
                ? "Your ads can now run. Nothing was charged — this is a demo."
                : "This is a demo. No money is charged and no card details are needed."}
            </DialogDescription>
          </DialogHeader>
          {!done ? (
            <div className="space-y-3">
              <div className="rounded-2xl bg-secondary p-4 text-sm text-muted-foreground">
                €{amount} covers {daysLabel(amount)} at €{DAILY_SPEND} a day.
              </div>
              <Button
                className="h-14 w-full rounded-2xl text-base font-semibold"
                onClick={() => {
                  topUp(amount);
                  setDone(true);
                  setCustom("");
                }}
              >
                Simulate payment
              </Button>
            </div>
          ) : (
            <Button
              variant="secondary"
              className="h-14 w-full rounded-2xl text-base font-semibold"
              onClick={() => setOpen(false)}
            >
              Done
            </Button>
          )}
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
