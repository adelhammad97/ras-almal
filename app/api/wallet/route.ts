import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 });
  const [wallet, accounts, transactions, holdings] = await Promise.all([
    prisma.wallet.findUnique({ where: { userId: user.id } }),
    prisma.bankAccount.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" } }),
    prisma.transaction.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 50 }),
    prisma.stockHolding.findMany({ where: { userId: user.id }, include: { stock: true } }),
  ]);
  return NextResponse.json({ wallet, accounts, transactions, holdings });
}
