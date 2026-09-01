import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ClipboardList, Wallet, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDemo } from "@/lib/prototype-state";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AdBoost — Local ads, run for you" },
      {
        name: "description",
        content:
          "AdBoost runs Facebook, Instagram and Google ads for small local businesses in the Netherlands. Add credit, see what it brings, stop anytime.",
      },
      { property: "og:title", content: "AdBoost — Local ads, run for you" },
      {
        property: "og:description",
        content:
          "Add credit, we run your Facebook, Instagram and Google ads, and you see the results in plain language.",
      },
    ],
  }),
  component: Welcome,
});

const cards = [
  {
    icon: ClipboardList,
    title: "Tell us about your business",
    body: "A few simple questions. What you do, where you are, and what you want more of. Takes about two minutes.",
  },
  {
    icon: Wallet,
    title: "Add your budget",
    body: "You decide the amount. Your money goes straight into your ads — nothing is taken until your ads run, and you can stop anytime.",
  },
  {
    icon: LineChart,
    title: "We run your ads and show you the results",
    body: "Facebook, Instagram and Google. You just see how many people saw you, tapped, and got in touch.",
  },
];

function Welcome() {
  const { state, hydrated } = useDemo();
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (hydrated && state.onboarded) navigate({ to: "/dashboard" });
  }, [hydrated, state.onboarded, navigate]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-5 pb-10 pt-10">
        <p className="text-sm font-semibold tracking-wide text-primary">AdBoost</p>

        <h1 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-foreground">
          €20 a day gets your business seen locally
        </h1>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          No setup, no contracts, and you never spend more than you put in.
        </p>

        <div
          className="mt-7 snap-x snap-mandatory overflow-x-auto scroll-smooth"
          onScroll={(e) => {
            const el = e.currentTarget;
            setIndex(Math.round(el.scrollLeft / el.clientWidth));
          }}
        >
          <div className="flex">
            {cards.map(({ icon: Icon, title, body }) => (
              <div key={title} className="w-full shrink-0 snap-center pr-0">
                <div className="rounded-3xl border border-border bg-card p-7">
                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/10">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                  <h2 className="mt-6 text-2xl font-bold leading-snug text-foreground">
                    {title}
                  </h2>
                  <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                    {body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-2">
          {cards.map((c, i) => (
            <span
              key={c.title}
              className={`h-2 rounded-full transition-all ${
                i === index ? "w-6 bg-primary" : "w-2 bg-border"
              }`}
            />
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Swipe to read. No contract, stop whenever you like.
        </p>

        <Button
          size="lg"
          className="mt-4 h-14 w-full rounded-2xl text-base font-semibold"
          onClick={() => navigate({ to: "/onboarding" })}
        >
          Get started
        </Button>
      </div>
    </div>
  );
}
