export type Job = {
  id: string;
  name: string;
  requiredLevel: number;
  salary: number;
  xp: number;
};

export type Business = {
  id: string;
  name: string;
  cost: number;
  income: number;
  owned: number;
};

export type Stock = {
  id: string;
  name: string;
  price: number;
  owned: number;
};

export type GameState = {
  cash: number;
  bank: number;
  level: number;
  xp: number;
  salary: number;
  jobs: Job[];
  businesses: Business[];
  stocks: Stock[];
  logs: string[];
};

export const jobsSeed: Job[] = [
  { id: "worker", name: "عامل يومي", requiredLevel: 1, salary: 120, xp: 12 },
  { id: "clerk", name: "موظف مكتبي", requiredLevel: 2, salary: 280, xp: 22 },
  { id: "manager", name: "مدير فرع", requiredLevel: 4, salary: 650, xp: 35 },
  { id: "ceo", name: "الرئيس التنفيذي", requiredLevel: 6, salary: 1400, xp: 50 },
];

export const businessesSeed: Business[] = [
  { id: "coffee", name: "كشك قهوة", cost: 220, income: 30, owned: 0 },
  { id: "market", name: "سوبر ماركت", cost: 720, income: 140, owned: 0 },
  { id: "factory", name: "مصنع صغير", cost: 1800, income: 420, owned: 0 },
  { id: "hotel", name: "فندق", cost: 4800, income: 1200, owned: 0 },
];

export const stocksSeed: Stock[] = [
  { id: "tech", name: "TechX", price: 120, owned: 0 },
  { id: "oil", name: "OilPro", price: 180, owned: 0 },
  { id: "bank", name: "BankGold", price: 95, owned: 0 },
  { id: "air", name: "SkyAir", price: 150, owned: 0 },
];

export const DEFAULT_GAME_STATE: GameState = {
  cash: 1200,
  bank: 500,
  level: 1,
  xp: 0,
  salary: 120,
  jobs: jobsSeed,
  businesses: businessesSeed,
  stocks: stocksSeed,
  logs: [
    "🚀 تم افتتاح حسابك في رأس المال.",
    "💡 ابدأ ببدء وظيفةك الأولى وشراء أول مشروع.",
  ],
};

export function calculateNetWorth(state: GameState) {
  return state.cash + state.bank + state.stocks.reduce((sum, stock) => sum + stock.owned * stock.price, 0);
}

export function nextLevelXp(level: number) {
  return 100 + (level - 1) * 80;
}

export function getAvailableJob(level: number) {
  return jobsSeed.filter((job) => job.requiredLevel <= level).at(-1) ?? jobsSeed[0];
}

export function getPassiveIncome(businesses: Business[]) {
  return businesses.reduce((sum, business) => sum + business.owned * business.income, 0);
}
