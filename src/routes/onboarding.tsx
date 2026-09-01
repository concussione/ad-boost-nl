import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, MessageSquare, MapPin, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BUSINESS_TYPES } from "@/data/mockData";
import { useDemo } from "@/lib/prototype-state";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Set up your ads — AdBoost" },
      {
        name: "description",
        content: "A few simple questions about your business so we can run the right local ads for you.",
      },
      { property: "og:title", content: "Set up your ads — AdBoost" },
      {
        property: "og:description",
        content: "A few simple questions so we can run the right local ads for you.",
      },
    ],
  }),
  component: Onboarding,
});

const TOTAL = 8; // 7 questions + summary

function Onboarding() {
  const { state, updateAnswers, update } = useDemo();
  const a = state.answers;
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const back = () => (step === 0 ? navigate({ to: "/" }) : setStep((s) => s - 1));
  const next = () => setStep((s) => Math.min(s + 1, TOTAL - 1));

  const canContinue = [
    !!a.businessType,
    !!a.city.trim(),
    !!a.promote.trim(),
    !!a.goal,
    a.phone.trim().length >= 6,
    a.whatsapp.trim().length >= 6,
    true,
    true,
  ][step];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-5 pb-8 pt-6">
        <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
          <button
            onClick={back}
            aria-label="Go back"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${((step + 1) / TOTAL) * 100}%` }}
            />
          </div>
        </div>

        <div className="mt-10 flex-1">
          {step === 0 && (
            <Question
              title="What kind of business do you have?"
              hint="This helps us show your ads to the right people nearby."
            >
              <Select
                value={a.businessType}
                onValueChange={(v) => updateAnswers({ businessType: v })}
              >
                <SelectTrigger className="h-14 rounded-2xl text-base">
                  <SelectValue placeholder="Choose your business" />
                </SelectTrigger>
                <SelectContent>
                  {BUSINESS_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value} className="text-base">
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Question>
          )}

          {step === 1 && (
            <Question
              title="Where are you, and how far do you travel?"
              hint="We only show your ads to people inside this area, so no money is spent on people too far away."
            >
              <Input
                value={a.city}
                onChange={(e) => updateAnswers({ city: e.target.value })}
                placeholder="Your city or town"
                className="h-14 rounded-2xl text-base"
              />
              <div className="mt-8 rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" /> Area around you
                  </span>
                  <span className="text-lg font-bold text-foreground">{a.radiusKm} km</span>
                </div>
                <Slider
                  className="mt-5"
                  min={1}
                  max={50}
                  step={1}
                  value={[a.radiusKm]}
                  onValueChange={(v) => updateAnswers({ radiusKm: v[0] ?? 10 })}
                />
              </div>
            </Question>
          )}

          {step === 2 && (
            <Question
              title="What would you like to promote?"
              hint="In your own words. A dish, a treatment, a service, an offer."
            >
              <Textarea
                value={a.promote}
                onChange={(e) => updateAnswers({ promote: e.target.value })}
                placeholder="For example: emergency repairs, evening menu, first haircut half price"
                className="min-h-32 rounded-2xl text-base"
              />
              <label className="mt-4 flex cursor-pointer items-center justify-between rounded-2xl border border-dashed border-border bg-card px-5 py-4">
                <span className="min-w-0 truncate text-sm text-muted-foreground">
                  {a.imageName || "Add a photo (optional)"}
                </span>
                <span className="shrink-0 text-sm font-semibold text-primary">Choose</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    updateAnswers({ imageName: e.target.files?.[0]?.name ?? "" })
                  }
                />
              </label>
            </Question>
          )}

          {step === 3 && (
            <Question title="What do you want most?" hint="You can change this later.">
              <div className="space-y-4">
                {[
                  {
                    id: "contacts",
                    title: "More calls & messages",
                    body: "We aim your ads at people ready to get in touch today.",
                  },
                  {
                    id: "awareness",
                    title: "Get seen locally",
                    body: "We show your business to more people close to you.",
                  },
                ].map((g) => (
                  <button
                    key={g.id}
                    onClick={() => updateAnswers({ goal: g.id })}
                    className={`w-full rounded-3xl border-2 p-6 text-left transition-colors ${
                      a.goal === g.id
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card"
                    }`}
                  >
                    <p className="text-lg font-bold text-foreground">{g.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{g.body}</p>
                  </button>
                ))}
              </div>
            </Question>
          )}

          {step === 4 && (
            <Question
              title="What number should people call?"
              hint="This is the number shown on your ads."
            >
              <Input
                type="tel"
                value={a.phone}
                onChange={(e) => updateAnswers({ phone: e.target.value })}
                placeholder="06 12 34 56 78"
                className="h-14 rounded-2xl text-base"
              />
            </Question>
          )}

          {step === 5 && (
            <Question
              title="Which WhatsApp number can people message?"
              hint="Many people prefer messaging over calling."
            >
              <Input
                type="tel"
                value={a.whatsapp}
                onChange={(e) => updateAnswers({ whatsapp: e.target.value })}
                placeholder="06 12 34 56 78"
                className="h-14 rounded-2xl text-base"
              />
              <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-2xl border border-border bg-card px-5 py-4">
                <Checkbox
                  checked={!!a.phone && a.whatsapp === a.phone}
                  onCheckedChange={(c) =>
                    updateAnswers({ whatsapp: c ? a.phone : "" })
                  }
                />
                <span className="text-base text-foreground">Same as my phone number</span>
              </label>
            </Question>
          )}

          {step === 6 && (
            <Question
              title="Do you have a website?"
              hint="No website is fine — your ads work without one."
            >
              <Input
                value={a.website}
                onChange={(e) => updateAnswers({ website: e.target.value })}
                placeholder="www.yourbusiness.nl"
                className="h-14 rounded-2xl text-base"
              />
            </Question>
          )}

          {step === 7 && (
            <Question
              title="Here's what we have"
              hint="Check it over. You can change anything later in Settings."
            >
              <div className="divide-y divide-border overflow-hidden rounded-3xl border border-border bg-card">
                <Row
                  label="Business"
                  value={
                    BUSINESS_TYPES.find((t) => t.value === a.businessType)?.label || "—"
                  }
                />
                <Row label="Area" value={`${a.city || "—"} · ${a.radiusKm} km around you`} />
                <Row label="Promoting" value={a.promote || "—"} />
                {a.imageName ? <Row label="Photo" value={a.imageName} /> : null}
                <Row
                  label="Goal"
                  value={a.goal === "awareness" ? "Get seen locally" : "More calls & messages"}
                />
                <Row label="Phone" value={a.phone || "—"} />
                <Row label="WhatsApp" value={a.whatsapp || "—"} />
                <Row label="Website" value={a.website || "Not now"} />
              </div>
              <p className="mt-5 text-sm text-muted-foreground">
                Nothing starts until you add credit, and you can pause your ads at any
                moment.
              </p>
            </Question>
          )}
        </div>

        <div className="mt-8 space-y-3">
          {step === 6 && (
            <Button
              variant="ghost"
              className="h-12 w-full rounded-2xl text-base"
              onClick={next}
            >
              Skip for now
            </Button>
          )}
          <Button
            size="lg"
            disabled={!canContinue}
            className="h-14 w-full rounded-2xl text-base font-semibold"
            onClick={() => {
              if (step === TOTAL - 1) {
                update({ onboarded: true });
                navigate({ to: "/dashboard" });
              } else {
                next();
              }
            }}
          >
            {step === TOTAL - 1 ? (
              <>
                <Check className="mr-2 h-5 w-5" /> All set
              </>
            ) : (
              "Continue"
            )}
          </Button>
          {step === 5 && (
            <p className="flex items-center justify-center gap-2 text-center text-xs text-muted-foreground">
              <MessageSquare className="h-3.5 w-3.5" /> We never message your customers
              ourselves.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function Question({
  title,
  hint,
  children,
}: {
  title: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h1 className="text-2xl font-bold leading-snug text-foreground">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{hint}</p>
      <div className="mt-7">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[7rem_minmax(0,1fr)] gap-3 px-5 py-4">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="min-w-0 break-words text-sm font-medium text-foreground">
        {value}
      </span>
    </div>
  );
}
