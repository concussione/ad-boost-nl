// All demo numbers live here. Edit freely — nothing is fetched from a server.

export type Package = {
  id: "start" | "growth" | "full";
  name: string;
  monthlyFee: number; // € per month, our fee
  adBudget: number; // € per month that goes to advertising
  description: string;
  reachLow: number;
  reachHigh: number;
  mostChosen?: boolean;
};

export const PACKAGES: Package[] = [
  {
    id: "start",
    name: "Start",
    monthlyFee: 99,
    adBudget: 300,
    description: "For a quiet local area or a single service.",
    reachLow: 8000,
    reachHigh: 15000,
  },
  {
    id: "growth",
    name: "Growth",
    monthlyFee: 149,
    adBudget: 600,
    description: "For a normal town or city area.",
    reachLow: 16000,
    reachHigh: 30000,
    mostChosen: true,
  },
  {
    id: "full",
    name: "Full",
    monthlyFee: 249,
    adBudget: 1200,
    description: "For a competitive area or several services.",
    reachLow: 32000,
    reachHigh: 60000,
  },
];

export const euro = (n: number) => `€${n.toLocaleString("en-US")}`;

/** Nearest tier at or below the amount; below the smallest tier we use the smallest. */
export function tierForAmount(amount: number): Package {
  const sorted = [...PACKAGES].sort((a, b) => a.adBudget - b.adBudget);
  let match = sorted[0]!;
  for (const p of sorted) if (amount >= p.adBudget) match = p;
  return match;
}

export const BUSINESS_TYPES = [
  { value: "restaurant", label: "Restaurant or café" },
  { value: "hair-salon", label: "Hair salon" },
  { value: "plumber", label: "Plumber" },
  { value: "dentist", label: "Dentist" },
  { value: "shop", label: "Shop" },
  { value: "gym", label: "Gym" },
  { value: "other", label: "Something else" },
];


export const dashboardStats = {
  peopleReached: 12340,
  taps: 298,
  calls: 18,
  whatsapps: 11,
  spent: 140,
  bestPlatform: "Instagram",
};

export const weeklyContacts = [
  { day: "Mon", contacts: 3 },
  { day: "Tue", contacts: 5 },
  { day: "Wed", contacts: 2 },
  { day: "Thu", contacts: 6 },
  { day: "Fri", contacts: 8 },
  { day: "Sat", contacts: 4 },
  { day: "Sun", contacts: 1 },
];

export type Transaction = {
  id: string;
  date: string;
  label: string;
  amount: number; // positive = added, negative = spent
};

export const mockTransactions: Transaction[] = [
  { id: "t1", date: "28 Aug", label: "Ads yesterday", amount: -20 },
  { id: "t2", date: "27 Aug", label: "Ads", amount: -20 },
  { id: "t3", date: "26 Aug", label: "Ads", amount: -20 },
  { id: "t4", date: "25 Aug", label: "Ads", amount: -20 },
  { id: "t5", date: "24 Aug", label: "Ads", amount: -20 },
  { id: "t6", date: "23 Aug", label: "Ads", amount: -20 },
  { id: "t7", date: "22 Aug", label: "Ads", amount: -20 },
];

export const supportWhatsApp = "+31 6 12 34 56 78";
