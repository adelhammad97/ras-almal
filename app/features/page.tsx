"use client";
import { useEffect, useMemo, useState } from "react";
import { defaultFeatureState, featureCatalog, type FeatureGroup, type FeatureState } from "@/lib/features";

const groups: Array<FeatureGroup | "الكل"> = ["الكل", "اقتصاد", "اجتماعي", "تقدم", "إدارة", "أمان", "تجربة"];
export default function FeaturesPage() {
  const [state, setState] = useState<FeatureState>(defaultFeatureState);
  const [group, setGroup] = useState<FeatureGroup | "الكل">("الكل");
  useEffect(() => { const raw = localStorage.getItem("ras-almal-features"); if (raw) setState({ ...defaultFeatureState, ...JSON.parse(raw) }); }, []);
  const visible = useMemo(() => featureCatalog.filter((x) => group === "الكل" || x.group === group), [group]);
  const enabled = featureCatalog.filter((x) => state[x.id]).length;
  return <main className="min-h-screen bg-[#07111d] p-5 text-slate-100"><div className="mx-auto max-w-7xl"><header className="mb-5 flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900 p-5"><div><p className="text-xs text-slate-400">مركز المزايا</p><h1 className="text-3xl font-black text-amber-400">مزايا رأس المال</h1></div><a href="/dashboard" className="rounded-xl bg-cyan-500 px-4 py-2 font-bold text-slate-950">العودة للعبة</a></header><div className="mb-5 grid gap-3 sm:grid-cols-3"><Stat label="إجمالي المزايا" value={featureCatalog.length.toString()} /><Stat label="المفعلة" value={enabled.toString()} /><Stat label="المجموعات" value={groups.length - 1 + " مجموعات"} /></div><div className="mb-4 flex flex-wrap gap-2">{groups.map((item) => <button key={item} onClick={() => setGroup(item)} className={`rounded-xl px-3 py-2 font-bold ${group === item ? "bg-cyan-500 text-slate-950" : "bg-slate-900 text-slate-300"}`}>{item}</button>)}</div><div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">{visible.map((feature) => <article key={feature.id} className="rounded-2xl border border-white/10 bg-slate-900 p-4"><div className="mb-2 flex items-center justify-between gap-2"><h2 className="font-bold">{feature.name}</h2><span className={`rounded-full px-2 py-1 text-xs ${state[feature.id] ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-700 text-slate-400"}`}>{state[feature.id] ? "متاحة" : "مغلقة"}</span></div><p className="mb-3 text-sm text-slate-400">{feature.description}</p><span className="text-xs text-cyan-300">{feature.group}</span></article>)}</div></div></main>;
}
function Stat({ label, value }: { label: string; value: string }) { return <div className="rounded-2xl border border-white/10 bg-slate-900 p-4"><p className="text-xs text-slate-400">{label}</p><b className="mt-2 block text-2xl">{value}</b></div>; }
