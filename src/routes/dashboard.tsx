import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Eye, Hand, Phone, Wallet as WalletIcon, PauseCircle } from "lucide-react";
import { AppShell } from "@/components/BottomTabs";
import { useDemo } from "@/lib/prototype-state";
import { dashboardStats, weeklyContacts, DAILY_SPEND } from "@/data/mockData";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Your results — AdBoost" },
      {
        name: "description",
        content: "See how many people saw your business, tapped your ad, and got in touch this week.",
      },
      { property: "og:title", content: "Your results — AdBoost" },
      {
        property: "og:description",
        content: "People who saw you, people who tapped, and people who got in touch.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { state, hydrated } = useDemo();
  const navigate = useNavigate();
  const [celebrate, setCelebrate] = useState(false);

  useEffect(() => {
    if (hydrated && !state.onboarded) navigate({ to: "/" });
  }, [hydrated, state.onboarded, navigate]);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("adboost-celebrate")) {
        sessionStorage.removeItem("adboost-celebrate");
        setCelebrate(true);
        const t = setTimeout(() => setCelebrate(false), 4000);
        return () => clearTimeout(t);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const hasCredit = state.balance > 0;
  const contacts = dashboardStats.calls + dashboardStats.whatsapps;
  const live = hasCredit && !state.paused;
  const daysLeft = Math.floor(state.balance / DAILY_SPEND);
  const max = Math.max(...weeklyContacts.map((d) => d.contacts), 1);
  const dash = "—";

  return (
    <AppShell title="Your results">
      <span className="inline-block rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
        Simulated results — demo only
      </span>

      {celebrate && (
        <div className="animate-in fade-in slide-in-from-top-2 rounded-3xl border-2 border-primary bg-primary/5 p-5 duration-500">
          <p className="text-lg font-bold text-foreground">Your ads are starting now 🎉</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Your credit is in. Below is what your ads are bringing in.
          </p>
        </div>
      )}

      <div
        className={`rounded-3xl p-5 transition-colors duration-500 ${
          live ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
        }`}
      >
        <div className="flex min-w-0 items-center gap-3">
          {live ? (
            <span className="relative flex h-3 w-3 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-foreground opacity-60" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-primary-foreground" />
            </span>
          ) : (
            <PauseCircle className="h-5 w-5 shrink-0" />
          )}
          <p className="min-w-0 text-lg font-bold">
            {state.paused
              ? "Your ads are paused"
              : state.balance > 0
                ? "Your ads are live"
                : "Add credit to start your ads"}
          </p>
        </div>
        <p className="mt-2 text-sm opacity-90">
          {live
            ? `We're spending €${DAILY_SPEND} a day on Facebook, Instagram and Google for you. Enough for ${daysLeft} more ${daysLeft === 1 ? "day" : "days"}.`
            : hasCredit
              ? "Nothing is being spent right now. You can start again whenever you want."
              : "Your ads haven't started yet. Add credit and we'll start showing your business to people nearby."}
        </p>
        {!hasCredit && (
          <Link
            to="/wallet"
            className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-2xl bg-primary px-6 text-base font-semibold text-primary-foreground"
          >
            Add credit
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Metric
          icon={Eye}
          label="People who saw you"
          value={hasCredit ? dashboardStats.peopleReached.toLocaleString("nl-NL") : dash}
          note={hasCredit ? "in your area this week" : "starts when your ads run"}
        />
        <Metric
          icon={Hand}
          label="People who tapped"
          value={hasCredit ? dashboardStats.taps.toString() : dash}
          note={hasCredit ? "wanted to know more" : "starts when your ads run"}
        />
        <Metric
          icon={Phone}
          label="People who got in touch"
          value={hasCredit ? contacts.toString() : dash}
          note={
            hasCredit
              ? `${dashboardStats.calls} calls · ${dashboardStats.whatsapps} WhatsApp`
              : "starts when your ads run"
          }
        />
        <Metric
          icon={WalletIcon}
          label="Credit left"
          value={`€${state.balance}`}
          note={
            hasCredit
              ? `about ${daysLeft} ${daysLeft === 1 ? "day" : "days"} of ads`
              : "no credit added yet"
          }
        />
      </div>

      {hasCredit && (
        <div className="rounded-3xl border border-border bg-card p-5">
          <p className="font-semibold text-foreground">People who got in touch this week</p>
          <div className="mt-6 flex items-end justify-between gap-2">
            {weeklyContacts.map((d) => (
              <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-xs font-semibold text-foreground">{d.contacts}</span>
                <div
                  className="w-full rounded-t-xl bg-primary/80 transition-all duration-700"
                  style={{ height: `${Math.max((d.contacts / max) * 110, 6)}px` }}
                />
                <span className="text-xs text-muted-foreground">{d.day}</span>
              </div>
            ))}
          </div>
        </div>
      )}


      <div className="rounded-3xl border border-border bg-card p-5">
        <p className="font-semibold text-foreground">Where your money goes</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Every euro of your credit is spent on showing your ads on Facebook, Instagram and
          Google. You can pause at any time in{" "}
          <Link to="/settings" className="font-medium text-primary underline">
            Settings
          </Link>{" "}
          and your remaining credit simply stays where it is.
        </p>
      </div>
    </AppShell>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
  note,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="rounded-3xl border border-border bg-card p-5">
      <Icon className="h-5 w-5 text-primary" />
      <p className="mt-3 text-3xl font-bold tracking-tight text-foreground">{value}</p>
      <p className="mt-1 text-sm font-medium text-foreground">{label}</p>
      <p className="mt-1 text-xs text-muted-foreground">{note}</p>
    </div>
  );
}
