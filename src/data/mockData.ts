// All demo numbers live here. Edit freely — nothing is fetched from a server.

export const DAILY_SPEND = 20; // € of ad spend per day

export const BUSINESS_TYPES = [
  { value: "restaurant", label: "Restaurant or café" },
  { value: "hair-salon", label: "Hair salon" },
  { value: "plumber", label: "Plumber" },
  { value: "dentist", label: "Dentist" },
  { value: "shop", label: "Shop" },
  { value: "gym", label: "Gym" },
  { value: "other", label: "Something else" },
];

export const TOPUP_PRESETS = [200, 400, 600];

export const dashboardStats = {
  peopleReached: 4820,
  taps: 312,
  calls: 18,
  whatsapps: 11,
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
];

export const supportWhatsApp = "+31 6 12 34 56 78";
