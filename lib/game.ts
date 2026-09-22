export type Job = { id: string; name: string; requiredLevel: number; salary: number; xp: number };
export type Business = { id: string; name: string; description: string; cost: number; income: number; owned: number; level: number };
export type Stock = { id: string; name: string; symbol: string; price: number; previousPrice: number; owned: number };
export type Mission = { id: string; title: string; description: string; target: number; progress: number; reward: number; done: boolean };
export type GameState = { cash: number; bank: number; level: number; xp: number; salary: number; reputation: number; streak: number; lastDaily: string | null; jobs: Job[]; businesses: Business[]; stocks: Stock[]; missions: Mission[]; logs: string[] };

export const jobsSeed: Job[] = [
  { id: "worker", name: "عامل يومي", requiredLevel: 1, salary: 120, xp: 12 },
  { id: "clerk", name: "موظف مكتبي", requiredLevel: 2, salary: 280, xp: 22 },
  { id: "manager", name: "مدير فرع", requiredLevel: 4, salary: 650, xp: 35 },
  { id: "ceo", name: "الرئيس التنفيذي", requiredLevel: 6, salary: 1400, xp: 50 },
  { id: "tycoon", name: "بارون المال", requiredLevel: 10, salary: 3500, xp: 80 },
];
export const businessesSeed: Business[] = [
  { id: "coffee", name: "كشك قهوة", description: "مشروع بداية سريع", cost: 220, income: 30, owned: 0, level: 1 },
  { id: "market", name: "سوبر ماركت", description: "تجارة يومية مستقرة", cost: 720, income: 140, owned: 0, level: 1 },
  { id: "factory", name: "مصنع صغير", description: "إنتاج صناعي", cost: 1800, income: 420, owned: 0, level: 1 },
  { id: "hotel", name: "فندق فاخر", description: "دخل سياحي قوي", cost: 4800, income: 1200, owned: 0, level: 1 },
  { id: "space", name: "شركة فضاء", description: "استثمار طويل الأمد", cost: 25000, income: 8000, owned: 0, level: 1 },
];
export const stocksSeed: Stock[] = [
  { id: "tech", symbol: "TEX", name: "TechX", price: 120, previousPrice: 120, owned: 0 },
  { id: "oil", symbol: "OIL", name: "OilPro", price: 180, previousPrice: 180, owned: 0 },
  { id: "bank", symbol: "BGD", name: "BankGold", price: 95, previousPrice: 95, owned: 0 },
  { id: "air", symbol: "SKY", name: "SkyAir", price: 150, previousPrice: 150, owned: 0 },
];
export const DEFAULT_GAME_STATE: GameState = {
  cash: 1200, bank: 500, level: 1, xp: 0, salary: 120, reputation: 0, streak: 0, lastDaily: null,
  jobs: jobsSeed, businesses: businessesSeed, stocks: stocksSeed,
  missions: [
    { id: "business", title: "رائد أعمال", description: "امتلك مشروعين", target: 2, progress: 0, reward: 500, done: false },
    { id: "trade", title: "متداول نشط", description: "نفّذ 5 صفقات أسهم", target: 5, progress: 0, reward: 300, done: false },
    { id: "wealth", title: "أول ثروة", description: "حقق صافي ثروة 10,000", target: 10000, progress: 0, reward: 1000, done: false },
  ],
  logs: ["🚀 مرحبًا بك في رأس المال.", "💡 ابدأ باستلام راتبك ثم ابنِ أول مشروع."],
};
export function cloneState(state: GameState): GameState { return JSON.parse(JSON.stringify(state)) as GameState; }
export function calculateNetWorth(state: GameState) { return state.cash + state.bank + state.stocks.reduce((sum, stock) => sum + stock.owned * stock.price, 0) + state.businesses.reduce((sum, business) => sum + business.owned * business.cost, 0); }
export function nextLevelXp(level: number) { return 100 + (level - 1) * 80; }
export function getAvailableJob(level: number) { return jobsSeed.filter((job) => job.requiredLevel <= level).at(-1) ?? jobsSeed[0]; }
export function getPassiveIncome(businesses: Business[]) { return businesses.reduce((sum, business) => sum + business.owned * business.income, 0); }
