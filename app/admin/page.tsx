"use client";

import { useEffect, useMemo, useState } from "react";
import { DEFAULT_GAME_STATE, calculateNetWorth, getAvailableJob, getPassiveIncome, nextLevelXp, type GameState } from "@/lib/game";

function formatMoney(value: number) {
  return `$${Math.round(value).toLocaleString("en-US")}`;
}

function cloneState(state: GameState): GameState {
  return JSON.parse(JSON.stringify(state));
}

export default function HomePage() {
  const [game, setGame] = useState<GameState>(DEFAULT_GAME_STATE);

  useEffect(() => {
    const stored = localStorage.getItem("ras-almal-state");
    if (stored) {
      setGame(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("ras-almal-state", JSON.stringify(game));
  }, [game]);

  useEffect(() => {
    const interval = setInterval(() => {
      setGame((prev) => {
        const next = cloneState(prev);
        const passive = getPassiveIncome(next.businesses);
        next.cash += passive;
        next.bank += next.bank * 0.015;
        next.xp += Math.max(1, Math.floor(passive / 20));

        while (next.xp >= nextLevelXp(next.level)) {
          next.xp -= nextLevelXp(next.level);
          next.level += 1;
          next.logs.unshift(`🎉 تم الوصول إلى المستوى ${next.level}`);
        }

        next.salary = getAvailableJob(next.level).salary;
        next.logs = next.logs.slice(0, 12);
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setGame((prev) => {
        const next = cloneState(prev);
        next.stocks = next.stocks.map((stock) => {
          const drift = (Math.random() - 0.5) * 18;
          return { ...stock, price: Math.max(25, Number((stock.price + drift).toFixed(2))) };
        });
        return next;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const netWorth = useMemo(() => calculateNetWorth(game), [game]);

  const collectSalary = () => {
    setGame((prev) => {
      const next = cloneState(prev);
      const currentJob = getAvailableJob(next.level);
      next.cash += currentJob.salary;
      next.xp += currentJob.xp;
      next.salary = currentJob.salary;
      next.logs.unshift(`💸 تم تحصيل راتب ${currentJob.name}: ${formatMoney(currentJob.salary)}`);

      while (next.xp >= nextLevelXp(next.level)) {
        next.xp -= nextLevelXp(next.level);
        next.level += 1;
        next.logs.unshift(`🎉 تم الوصول إلى المستوى ${next.level}`);
      }

      next.logs = next.logs.slice(0, 12);
      return next;
    });
  };

  const buyBusiness = (businessId: string) => {
    setGame((prev) => {
      const next = cloneState(prev);
      const business = next.businesses.find((item) => item.id === businessId);
      if (!business) return prev;
      if (next.cash < business.cost) {
        next.logs.unshift(`⚠️ لا يوجد رصيد كافٍ لشراء ${business.name}`);
        return next;
      }

      next.cash -= business.cost;
      business.owned += 1;
      business.cost = Math.round(business.cost * 1.2);
      next.logs.unshift(`✅ تم شراء ${business.name} (${business.owned} قطعة)`);
      next.logs = next.logs.slice(0, 12);
      return next;
    });
  };

  const buyStock = (stockId: string) => {
    setGame((prev) => {
      const next = cloneState(prev);
      const stock = next.stocks.find((item) => item.id === stockId);
      if (!stock) return prev;
      if (next.cash < stock.price) {
        next.logs.unshift(`⚠️ لا يوجد رصيد كافٍ لشراء ${stock.name}`);
        return next;
      }

      next.cash -= stock.price;
      stock.owned += 1;
      next.logs.unshift(`📈 تم شراء سهم ${stock.name}`);
      next.logs = next.logs.slice(0, 12);
      return next;
    });
  };

  const sellStock = (stockId: string) => {
    setGame((prev) => {
      const next = cloneState(prev);
      const stock = next.stocks.find((item) => item.id === stockId);
      if (!stock || stock.owned <= 0) return prev;
      next.cash += stock.price;
      stock.owned -= 1;
      next.logs.unshift(`💰 تم بيع سهم ${stock.name}`);
      next.logs = next.logs.slice(0, 12);
      return next;
    });
  };

  const currentJob = getAvailableJob(game.level);

  return (
    <main className="min-h-screen bg-[#07111d] text-slate-100">
      <div className="mx-auto max-w-7xl p-5">
        <header className="mb-6 flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/80 p-5 shadow-game">
          <div>
            <div className="text-xs text-slate-400">لعبة</div>
            <h1 className="text-3xl font-black text-amber-400">رأس المال</h1>
          </div>
          <a href="/admin" className="rounded-xl bg-cyan-500 px-4 py-2 font-bold text-slate-950 transition hover:bg-cyan-400">
            لوحة الإدارة
          </a>
        </header>

        <section className="mb-6 grid gap-4 md:grid-cols-5">
          {[
            { label: "النقد", value: formatMoney(game.cash) },
            { label: "البنك", value: formatMoney(game.bank) },
            { label: "صافي الثروة", value: formatMoney(netWorth) },
            { label: "الراتب", value: formatMoney(game.salary) },
            { label: "المستوى", value: `${game.level}` },
          ].map((card) => (
            <div key={card.label} className="rounded-2xl border border-white/10 bg-slate-900 p-4 shadow-game">
              <div className="text-xs text-slate-400">{card.label}</div>
              <div className="mt-2 text-2xl font-black">{card.value}</div>
            </div>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.3fr_0.95fr_0.9fr]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-slate-900 p-5 shadow-game">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold">الوظائف</h2>
                <span className="text-xs text-slate-400">وظيفة حالية: {currentJob.name}</span>
              </div>

              {game.jobs.map((job) => {
                const unlocked = job.requiredLevel <= game.level;
                return (
                  <div key={job.id} className="mb-3 rounded-xl border border-white/10 bg-slate-800/60 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="font-bold">{job.name}</div>
                        <div className="text-xs text-slate-400">راتب {formatMoney(job.salary)} • XP {job.xp}</div>
                      </div>
                      <button
                        onClick={collectSalary}
                        disabled={!unlocked}
                        className={`rounded-xl px-3 py-2 font-bold ${
                          unlocked ? "bg-amber-400 text-slate-950 hover:bg-amber-300" : "cursor-not-allowed bg-slate-700 text-slate-400"
                        }`}
                      >
                        {unlocked ? "استلام الراتب" : `المستوى ${job.requiredLevel}`}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900 p-5 shadow-game">
              <h2 className="mb-4 text-xl font-bold">الأعمال</h2>
              {game.businesses.map((business) => (
                <div key={business.id} className="mb-3 rounded-xl border border-white/10 bg-slate-800/60 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="font-bold">{business.name}</div>
                      <div className="text-xs text-slate-400">دخل: {formatMoney(business.income)} • ملكية: {business.owned}</div>
                    </div>
                    <button
                      onClick={() => buyBusiness(business.id)}
                      className="rounded-xl bg-emerald-500 px-3 py-2 font-bold text-slate-950 hover:bg-emerald-400"
                    >
                      شراء {formatMoney(business.cost)}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900 p-5 shadow-game">
            <h2 className="mb-4 text-xl font-bold">السوق</h2>
            {game.stocks.map((stock) => (
              <div key={stock.id} className="mb-3 rounded-xl border border-white/10 bg-slate-800/60 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-bold">{stock.name}</div>
                    <div className="text-xs text-slate-400">السعر: {formatMoney(stock.price)} • المملوك: {stock.owned}</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => buyStock(stock.id)} className="rounded-xl bg-cyan-500 px-3 py-2 font-bold text-slate-950 hover:bg-cyan-400">
                      شراء
                    </button>
                    <button onClick={() => sellStock(stock.id)} className="rounded-xl bg-red-500 px-3 py-2 font-bold text-white hover:bg-red-400">
                      بيع
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-slate-900 p-5 shadow-game">
              <h2 className="mb-4 text-xl font-bold">سجل الأحداث</h2>
              <ul className="space-y-2 text-sm text-slate-300">
                {game.logs.map((log, index) => (
                  <li key={`${log}-${index}`} className="rounded-lg border border-white/10 bg-slate-800/60 p-2">
                    {log}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900 p-5 shadow-game">
              <h2 className="mb-4 text-xl font-bold">الترتيب</h2>
              <ul className="space-y-2 text-sm">
                {[
                  { name: "أنت", score: netWorth },
                  { name: "الملك الأول", score: 150000 },
                  { name: "مستثمر حر", score: 120000 },
                  { name: "بطل المال", score: 90000 },
                ]
                  .sort((a, b) => b.score - a.score)
                  .map((entry, index) => (
                    <li key={entry.name} className="flex items-center justify-between rounded-lg border border-white/10 bg-slate-800/60 p-2">
                      <span>{index + 1}. {entry.name}</span>
                      <strong>{formatMoney(entry.score)}</strong>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
