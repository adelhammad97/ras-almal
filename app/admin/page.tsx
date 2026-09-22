"use client";
import { useMemo, useState } from "react";
import { adminIcons as icon } from "@/lib/icons";
import { featureCatalog } from "@/lib/features";
import { playSound, setMuted } from "@/lib/sound";

type Player = { id: number; name: string; level: number; wealth: number; status: "نشط" | "معلق" | "محظور"; lastSeen: string };
const initialPlayers: Player[] = [
  { id: 1, name: "أحمد المال", level: 9, wealth: 220000, status: "نشط", lastSeen: "الآن" },
  { id: 2, name: "سارة الاستراتيجية", level: 8, wealth: 190000, status: "نشط", lastSeen: "منذ 4 دقائق" },
  { id: 3, name: "يوسف الأسهم", level: 7, wealth: 150000, status: "معلق", lastSeen: "منذ يوم" },
  { id: 4, name: "ليلى العقارات", level: 6, wealth: 130000, status: "نشط", lastSeen: "منذ 8 دقائق" },
];
const money = (value: number) => `$${value.toLocaleString("en-US")}`;
const nav = [
  ["dashboard", "نظرة عامة", icon.dashboard], ["players", "اللاعبون", icon.players], ["economy", "الاقتصاد", icon.economy], ["businesses", "الشركات", icon.businesses], ["stocks", "الأسهم", icon.stocks], ["jobs", "الوظائف", icon.jobs], ["missions", "المهام", icon.missions], ["features", "المزايا", icon.features], ["content", "المحتوى", icon.content], ["security", "الأمان", icon.security], ["reports", "البلاغات", icon.reports], ["audit", "سجل العمليات", icon.audit], ["settings", "الإعدادات", icon.settings],
] as const;

export default function AdminPage() {
  const [section, setSection] = useState("dashboard");
  const [players, setPlayers] = useState(initialPlayers);
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const [muted, setMute] = useState(false);
  const [maintenance, setMaintenance] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const enabledFeatures = useMemo(() => featureCatalog.length, []);
  const filtered = players.filter((player) => player.name.includes(query));
  const action = (message: string, sound: "success" | "warning" = "success") => { setNotice(message); playSound(sound); window.setTimeout(() => setNotice(""), 2500); };
  const toggleMute = () => { const next = !muted; setMute(next); setMuted(next); if (!next) playSound("success"); };
  const togglePlayer = (id: number) => setPlayers((current) => current.map((player) => player.id === id ? { ...player, status: player.status === "نشط" ? "معلق" : "نشط" } : player));
  const sectionTitle = nav.find(([id]) => id === section)?.[1] ?? "الإدارة";

  return <main className="min-h-screen bg-[#07111d] text-slate-100"><div className="mx-auto max-w-[1600px] p-4 md:p-6">
    <header className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-900 p-5 shadow-game"><div><p className="text-xs text-slate-400">{icon.online} النظام يعمل</p><h1 className="text-3xl font-black text-cyan-400">لوحة التحكم الشاملة</h1></div><div className="flex gap-2"><button onClick={toggleMute} className="rounded-xl bg-slate-700 px-4 py-2 font-bold">{muted ? "🔇 الصوت مغلق" : "🔊 الصوت مفتوح"}</button><a href="/dashboard" className="rounded-xl bg-amber-400 px-4 py-2 font-bold text-slate-950">🎮 اللعبة</a></div></header>
    {notice && <div className="mb-4 rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-3 text-emerald-300">{icon.success} {notice}</div>}
    <div className="grid gap-5 lg:grid-cols-[230px_1fr]">
      <aside className="h-fit rounded-2xl border border-white/10 bg-slate-900 p-3 lg:sticky lg:top-4"><p className="mb-2 px-3 text-xs text-slate-500">مركز العمليات</p>{nav.map(([id, label, emoji]) => <button key={id} onClick={() => { setSection(id); playSound("click"); }} className={`mb-1 flex w-full items-center gap-3 rounded-xl p-3 text-right font-bold ${section === id ? "bg-cyan-500 text-slate-950" : "text-slate-300 hover:bg-white/10"}`}><span>{emoji}</span>{label}</button>)}</aside>
      <section className="space-y-5"><div className="flex items-center justify-between"><h2 className="text-2xl font-black">{sectionTitle}</h2><span className="text-xs text-slate-500">آخر تحديث: الآن</span></div>
        {section === "dashboard" && <Overview onAction={action} />}
        {section === "players" && <Players players={filtered} query={query} setQuery={setQuery} toggle={togglePlayer} onAction={action} />}
        {section === "economy" && <Tools title="تحكم الاقتصاد" items={["تغيير فائدة البنك", "إطلاق حدث تضاعف الأرباح", "إعادة حساب صافي الثروة", "تحديث أسعار السوق", "ضبط معدل التضخم", "مراجعة القروض المتأخرة"]} onAction={action} />}
        {section === "businesses" && <Tools title="إدارة الشركات" items={["إضافة شركة جديدة", "تعديل أسعار الشركات", "تعديل الدخل السلبي", "ترقية جماعية للشركات", "إيقاف شركة مؤقتًا"]} onAction={action} />}
        {section === "stocks" && <Tools title="إدارة سوق الأسهم" items={["إضافة سهم", "تعديل سعر سهم", "تعديل التذبذب", "إيقاف التداول", "إطلاق خبر سوق عاجل"]} onAction={action} />}
        {section === "jobs" && <Tools title="الوظائف والمسار المهني" items={["إضافة وظيفة", "تعديل الراتب", "تعديل XP", "تغيير مستوى الفتح", "إعادة توزيع الوظائف"]} onAction={action} />}
        {section === "missions" && <Tools title="المهام والإنجازات" items={["إنشاء مهمة يومية", "إنشاء إنجاز موسمي", "منح مكافأة جماعية", "تصفير تقدم المهام", "تفعيل بطولة"]} onAction={action} />}
        {section === "features" && <FeaturePanel count={enabledFeatures} onAction={action} />}
        {section === "content" && <ContentPanel announcement={announcement} setAnnouncement={setAnnouncement} onAction={action} />}
        {section === "security" && <SecurityPanel onAction={action} />}
        {section === "reports" && <Tools title="البلاغات ومكافحة الغش" items={["مراجعة البلاغات الجديدة", "كشف العمليات المشبوهة", "حظر الحسابات عالية الخطورة", "تصدير تقرير الغش", "مسح التنبيهات القديمة"]} onAction={action} />}
        {section === "audit" && <Audit />}
        {section === "settings" && <Settings maintenance={maintenance} setMaintenance={setMaintenance} onAction={action} />}
      </section>
    </div>
  </div></main>;
}

function Overview({ onAction }: { onAction: (message: string) => void }) { const cards = [["👥", "اللاعبون", "1,284"], ["🟢", "نشطون الآن", "876"], ["💰", "حجم الاقتصاد", "$4.8M"], ["📈", "المعاملات اليوم", "18,492"], ["🚨", "بلاغات مفتوحة", "7"], ["🧩", "المزايا", "60+"]]; return <><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{cards.map(([emoji, label, value]) => <div key={label} className="rounded-2xl border border-white/10 bg-slate-900 p-5 shadow-game"><span className="text-2xl">{emoji}</span><p className="mt-3 text-xs text-slate-400">{label}</p><b className="mt-1 block text-2xl">{value}</b></div>)}</div><div className="grid gap-5 xl:grid-cols-2"><Tools title="إجراءات سريعة" items={["📣 نشر إعلان عام", "🎁 توزيع مكافأة للاعبين", "🔧 تفعيل وضع الصيانة", "💾 إنشاء نسخة احتياطية", "📊 تصدير التحليلات", "🔔 إرسال تنبيه عاجل"]} onAction={onAction} /><div className="rounded-2xl border border-white/10 bg-slate-900 p-5"><h3 className="mb-4 text-xl font-bold">صحة الخدمات</h3>{["قاعدة البيانات", "سوق الأسهم", "خدمة الإشعارات", "واجهة API", "نظام المعاملات"].map((name) => <div key={name} className="mb-3 flex justify-between rounded-xl bg-slate-800/70 p-3"><span>{name}</span><span className="text-emerald-300">🟢 يعمل</span></div>)}</div></div></>; }
function Players({ players, query, setQuery, toggle, onAction }: { players: Player[]; query: string; setQuery: (value: string) => void; toggle: (id: number) => void; onAction: (message: string) => void }) { return <div className="rounded-2xl border border-white/10 bg-slate-900 p-5"><div className="mb-4 flex flex-wrap justify-between gap-3"><h3 className="text-xl font-bold">👥 إدارة اللاعبين</h3><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="🔎 ابحث عن لاعب" className="rounded-xl border border-white/10 bg-slate-800 px-3 py-2 outline-none focus:border-cyan-400" /></div><div className="overflow-x-auto"><table className="min-w-full text-right text-sm"><thead><tr className="border-b border-white/10 text-slate-400">{["اللاعب", "المستوى", "الثروة", "النشاط", "الحالة", "إجراءات"].map((x) => <th className="p-3" key={x}>{x}</th>)}</tr></thead><tbody>{players.map((player) => <tr key={player.id} className="border-b border-white/10"><td className="p-3 font-bold">{player.name}</td><td className="p-3">{player.level}</td><td className="p-3">{money(player.wealth)}</td><td className="p-3 text-slate-400">{player.lastSeen}</td><td className="p-3"><span className="rounded-full bg-emerald-500/20 px-2 py-1 text-xs text-emerald-300">{player.status}</span></td><td className="flex gap-2 p-3"><button onClick={() => onAction(`تم فتح ملف ${player.name}`)} className="rounded-lg bg-cyan-500 px-3 py-1 font-bold text-slate-950">عرض</button><button onClick={() => { toggle(player.id); onAction("تم تحديث حالة اللاعب",); }} className="rounded-lg bg-slate-700 px-3 py-1">تبديل</button></td></tr>)}</tbody></table></div></div>; }
function Tools({ title, items, onAction }: { title: string; items: string[]; onAction: (message: string) => void }) { return <div className="rounded-2xl border border-white/10 bg-slate-900 p-5"><h3 className="mb-5 text-xl font-bold">{title}</h3><div className="grid gap-3 sm:grid-cols-2">{items.map((item) => <button key={item} onClick={() => onAction(`تم تنفيذ: ${item}`)} className="rounded-xl border border-white/10 bg-slate-800/70 p-5 text-right font-bold hover:border-cyan-400">{item}<span className="float-left text-cyan-300">←</span></button>)}</div></div>; }
function FeaturePanel({ count, onAction }: { count: number; onAction: (message: string) => void }) { return <div className="rounded-2xl border border-white/10 bg-slate-900 p-5"><div className="mb-5 flex flex-wrap justify-between gap-3"><h3 className="text-xl font-bold">🧩 مركز المزايا ({count})</h3><a href="/admin/features" className="rounded-xl bg-cyan-500 px-4 py-2 font-bold text-slate-950">فتح مدير المزايا</a></div><p className="mb-5 text-slate-400">تحكم مركزي في الاقتصاد والاجتماعيات والأمان وتجربة اللاعب.</p><Tools title="إجراءات المزايا" items={["تفعيل المزايا الجديدة", "تعطيل ميزة طارئة", "مراجعة إعدادات الأمان", "تصدير قائمة المزايا"]} onAction={onAction} /></div>; }
function ContentPanel({ announcement, setAnnouncement, onAction }: { announcement: string; setAnnouncement: (value: string) => void; onAction: (message: string) => void }) { return <div className="rounded-2xl border border-white/10 bg-slate-900 p-5"><h3 className="mb-4 text-xl font-bold">📝 المحتوى والإعلانات</h3><textarea value={announcement} onChange={(event) => setAnnouncement(event.target.value)} placeholder="اكتب إعلانًا للاعبين..." className="mb-3 min-h-32 w-full rounded-xl border border-white/10 bg-slate-800 p-3 outline-none" /><button onClick={() => onAction("تم نشر الإعلان العام")} className="rounded-xl bg-amber-400 px-4 py-3 font-bold text-slate-950">📣 نشر الإعلان</button></div>; }
function SecurityPanel({ onAction }: { onAction: (message: string) => void }) { return <div className="grid gap-5 md:grid-cols-2"><Tools title="🛡️ الأمان" items={["تفعيل تحديد الطلبات", "فحص الحسابات عالية المخاطر", "إجبار المشرفين على 2FA", "تدوير مفاتيح الجلسات"]} onAction={onAction} /><Tools title="💾 البيانات" items={["إنشاء نسخة احتياطية", "فحص سلامة دفتر المعاملات", "تصدير سجل التدقيق", "استعادة آخر نسخة"]} onAction={onAction} /></div>; }
function Audit() { return <div className="rounded-2xl border border-white/10 bg-slate-900 p-5"><h3 className="mb-4 text-xl font-bold">📜 سجل عمليات الإدارة</h3>{["تم فتح لوحة الإدارة", "تم تحديث أسعار الأسهم", "تمت مراجعة بلاغ #1042", "تم تفعيل نظام المكافآت", "تم إنشاء نسخة احتياطية"].map((event, index) => <div key={event} className="mb-2 flex justify-between rounded-xl bg-slate-800/70 p-3"><span>{event}</span><span className="text-xs text-slate-500">منذ {index + 1} دقيقة</span></div>)}</div>; }
function Settings({ maintenance, setMaintenance, onAction }: { maintenance: boolean; setMaintenance: (value: boolean) => void; onAction: (message: string) => void }) { return <div className="rounded-2xl border border-white/10 bg-slate-900 p-5"><h3 className="mb-5 text-xl font-bold">⚙️ إعدادات النظام</h3><div className="mb-3 flex items-center justify-between rounded-xl bg-slate-800/70 p-4"><span>🔧 وضع الصيانة</span><button onClick={() => { setMaintenance(!maintenance); onAction(maintenance ? "تم إيقاف وضع الصيانة" : "تم تفعيل وضع الصيانة"); }} className={`rounded-xl px-4 py-2 font-bold ${maintenance ? "bg-red-500" : "bg-emerald-500 text-slate-950"}`}>{maintenance ? "مفعل" : "متوقف"}</button></div><Tools title="إعدادات إضافية" items={["تغيير اسم اللعبة", "تعديل المنطقة الزمنية", "إدارة اللغات", "ضبط الإشعارات", "حفظ الإعدادات"]} onAction={onAction} /></div>; }
