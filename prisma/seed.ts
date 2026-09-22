import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const jobs = [
    { name: "عامل يومي", requiredLevel: 1, salary: 120, xpReward: 12 },
    { name: "موظف مكتبي", requiredLevel: 2, salary: 280, xpReward: 22 },
    { name: "مدير فرع", requiredLevel: 4, salary: 650, xpReward: 35 },
    { name: "الرئيس التنفيذي", requiredLevel: 6, salary: 1400, xpReward: 50 },
  ];

  for (const job of jobs) {
    await prisma.job.upsert({
      where: { id: job.name },
      update: {},
      create: {
        id: job.name,
        name: job.name,
        requiredLevel: job.requiredLevel,
        salary: job.salary,
        xpReward: job.xpReward,
      },
    });
  }

  const businesses = [
    { name: "كشك قهوة", description: "تدفق مالي صغير", basePrice: 220, baseIncome: 30 },
    { name: "سوبر ماركت", description: "مبيعات كبيرة", basePrice: 720, baseIncome: 140 },
    { name: "مصنع صغير", description: "إنتاج ثابت", basePrice: 1800, baseIncome: 420 },
    { name: "فندق", description: "دخل استثماري عال", basePrice: 4800, baseIncome: 1200 },
  ];

  for (const business of businesses) {
    await prisma.business.upsert({
      where: { id: business.name },
      update: {},
      create: {
        id: business.name,
        name: business.name,
        description: business.description,
        basePrice: business.basePrice,
        baseIncome: business.baseIncome,
      },
    });
  }

  const stocks = [
    { symbol: "TEX", name: "TechX", price: 120, volatility: 0.12 },
    { symbol: "OIL", name: "OilPro", price: 180, volatility: 0.16 },
    { symbol: "BGD", name: "BankGold", price: 95, volatility: 0.1 },
    { symbol: "SKY", name: "SkyAir", price: 150, volatility: 0.14 },
  ];

  for (const stock of stocks) {
    await prisma.stock.upsert({
      where: { symbol: stock.symbol },
      update: {},
      create: {
        id: stock.symbol,
        symbol: stock.symbol,
        name: stock.name,
        price: stock.price,
        volatility: stock.volatility,
      },
    });
  }
}

main()
  .then(() => console.log("✅ تمت تهيئة بيانات اللعبة."))
  .catch((e) => {
    console.error("❌ فشل التهيئة:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
