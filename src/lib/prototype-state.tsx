import * as React from "react";
import { mockTransactions, type Transaction } from "@/data/mockData";

export type Answers = {
  businessType: string;
  city: string;
  radiusKm: number;
  promote: string;
  imageName: string;
  goal: string;
  phone: string;
  whatsapp: string;
  website: string;
};

export type DemoState = {
  onboarded: boolean;
  answers: Answers;
  balance: number;
  transactions: Transaction[];
  paused: boolean;
};

const emptyAnswers: Answers = {
  businessType: "",
  city: "",
  radiusKm: 10,
  promote: "",
  imageName: "",
  goal: "",
  phone: "",
  whatsapp: "",
  website: "",
};

const initialState: DemoState = {
  onboarded: false,
  answers: emptyAnswers,
  balance: 0,
  transactions: mockTransactions,
  paused: false,
};

const STORAGE_KEY = "adboost-demo-v1";

type Ctx = {
  state: DemoState;
  hydrated: boolean;
  update: (patch: Partial<DemoState>) => void;
  updateAnswers: (patch: Partial<Answers>) => void;
  topUp: (amount: number) => void;
  reset: () => void;
};

const DemoContext = React.createContext<Ctx | null>(null);

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<DemoState>(initialState);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...initialState, ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  React.useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state, hydrated]);

  const value = React.useMemo<Ctx>(
    () => ({
      state,
      hydrated,
      update: (patch) => setState((s) => ({ ...s, ...patch })),
      updateAnswers: (patch) =>
        setState((s) => ({ ...s, answers: { ...s.answers, ...patch } })),
      topUp: (amount) =>
        setState((s) => ({
          ...s,
          balance: s.balance + amount,
          transactions: [
            {
              id: `t-${Date.now()}`,
              date: new Date().toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
              }),
              label: "Credit added (demo)",
              amount,
            },
            ...s.transactions,
          ],
        })),
      reset: () => {
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch {
          /* ignore */
        }
        setState(initialState);
      },
    }),
    [state, hydrated],
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const ctx = React.useContext(DemoContext);
  if (!ctx) throw new Error("useDemo must be used inside DemoProvider");
  return ctx;
}
