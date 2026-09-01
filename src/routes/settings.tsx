import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { MessageCircle, RotateCcw, Store, Wallet, Megaphone, LayoutDashboard } from "lucide-react";
import { AppShell } from "@/components/BottomTabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDemo } from "@/lib/prototype-state";
import { BUSINESS_TYPES, supportWhatsApp } from "@/data/mockData";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings & help — AdBoost" },
      {
        name: "description",
        content: "Update your business details, pause your ads at any time, or message us for help.",
      },
      { property: "og:title", content: "Settings & help — AdBoost" },
      {
        property: "og:description",
        content: "Change your details, pause your ads, or ask us anything.",
      },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { state, hydrated, updateAnswers, update, reset } = useDemo();
  const a = state.answers;
  const navigate = useNavigate();

  useEffect(() => {
    if (hydrated && !state.onboarded) navigate({ to: "/" });
  }, [hydrated, state.onboarded, navigate]);

  return (
    <AppShell title="Settings & help">
      <div className="space-y-4 rounded-3xl border border-border bg-card p-5">
        <p className="font-semibold text-foreground">Your business</p>

        <Field label="Business type">
          <Select
            value={a.businessType}
            onValueChange={(v) => updateAnswers({ businessType: v })}
          >
            <SelectTrigger className="h-12 rounded-2xl text-base">
              <SelectValue placeholder="Choose" />
            </SelectTrigger>
            <SelectContent>
              {BUSINESS_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="City">
          <Input
            value={a.city}
            onChange={(e) => updateAnswers({ city: e.target.value })}
            className="h-12 rounded-2xl text-base"
          />
        </Field>

        <Field label="What you promote">
          <Input
            value={a.promote}
            onChange={(e) => updateAnswers({ promote: e.target.value })}
            className="h-12 rounded-2xl text-base"
          />
        </Field>

        <Field label="Phone">
          <Input
            value={a.phone}
            onChange={(e) => updateAnswers({ phone: e.target.value })}
            className="h-12 rounded-2xl text-base"
          />
        </Field>

        <Field label="WhatsApp">
          <Input
            value={a.whatsapp}
            onChange={(e) => updateAnswers({ whatsapp: e.target.value })}
            className="h-12 rounded-2xl text-base"
          />
        </Field>

        <Field label="Website">
          <Input
            value={a.website}
            onChange={(e) => updateAnswers({ website: e.target.value })}
            placeholder="Not now"
            className="h-12 rounded-2xl text-base"
          />
        </Field>
      </div>

      <div className="rounded-3xl border border-border bg-card p-5">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
          <div className="min-w-0">
            <p className="font-semibold text-foreground">Pause my ads</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Stops all spending straight away. Your credit stays yours and you can start
              again with one tap.
            </p>
          </div>
          <Switch
            checked={state.paused}
            onCheckedChange={(v) => update({ paused: v })}
            className="shrink-0"
          />
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-card p-5">
        <p className="font-semibold text-foreground">How this works</p>
        <ol className="mt-4 space-y-3">
          <Step number={1} icon={Store} text="You tell us about your business" />
          <Step number={2} icon={Wallet} text="You add credit" />
          <Step number={3} icon={Megaphone} text="We build and run your ads on Facebook, Instagram and Google" />
          <Step number={4} icon={LayoutDashboard} text="You see the results here, and you can pause anytime" />
        </ol>
      </div>

      <div className="rounded-3xl border border-border bg-card p-5">
        <p className="font-semibold text-foreground">Need a hand?</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Message a real person. We usually reply the same day.
        </p>
        <Button
          className="mt-4 h-14 w-full rounded-2xl text-base font-semibold"
          onClick={() => alert(`Demo only — this would open WhatsApp with ${supportWhatsApp}`)}
        >
          <MessageCircle className="mr-2 h-5 w-5" /> Message us on WhatsApp
        </Button>
      </div>

      <div className="flex gap-4 px-1 text-sm text-muted-foreground">
        <Link to="/terms" className="underline">
          Terms
        </Link>
        <Link to="/privacy" className="underline">
          Privacy
        </Link>
      </div>

      <Button
        variant="outline"
        className="h-12 w-full rounded-2xl"
        onClick={() => {
          reset();
          navigate({ to: "/" });
        }}
      >
        <RotateCcw className="mr-2 h-4 w-4" /> Reset demo
      </Button>
    </AppShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-sm text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}

function Step({
  number,
  icon: Icon,
  text,
}: {
  number: number;
  icon: React.ElementType;
  text: string;
}) {
  return (
    <li className="flex items-start gap-3">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">
        {number}
      </span>
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
      <span className="text-sm text-foreground">{text}</span>
    </li>
  );
}
