import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seed() {
  await prisma.user.createMany({
    data: [
      {
        username: "دكتور المال",
        email: "doctor@rasalmal.com",
        passwordHash: "demo-hash",
        level: 9,
        experience: 3200,
      },
      {
        username: "الاستراتيجي",
        email: "strategy@rasalmal.com",
        passwordHash: "demo-hash",
        level: 7,
        experience: 2500,
      },
      {
        username: "رجل الأسهم",
        email: "stocks@rasalmal.com",
        passwordHash: "demo-hash",
        level: 6,
        experience: 2100,
      },
    ],
    skipDuplicates: true,
  });
}

seed()
  .catch((error) => {
    console.error("seed failed", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
