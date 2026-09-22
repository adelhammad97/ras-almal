import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 });
  const body = await request.json() as { stockId?: string; side?: "BUY" | "SELL"; type?: "MARKET" | "LIMIT"; quantity?: number; limitPrice?: number };
  const quantity = Math.floor(Number(body.quantity));
  if (!body.stockId || !body.side || !body.type || !Number.isInteger(quantity) || quantity < 1 || quantity > 100000) return NextResponse.json({ error: "بيانات الأمر غير صحيحة" }, { status: 400 });
  const stock = await prisma.stock.findUnique({ where: { id: body.stockId } });
  if (!stock) return NextResponse.json({ error: "السهم غير موجود" }, { status: 404 });
  if (body.type === "LIMIT" && (!body.limitPrice || body.limitPrice <= 0)) return NextResponse.json({ error: "حدد سعرًا صالحًا" }, { status: 400 });
  const price = Number(stock.price); const total = price * quantity;
  try {
    const result = await prisma.$transaction(async (tx) => {
      if (body.type === "LIMIT") return tx.order.create({ data: { userId: user.id, stockId: stock.id, side: body.side!, type: body.type!, quantity, limitPrice: body.limitPrice } });
      const wallet = await tx.wallet.findUnique({ where: { userId: user.id } });
      const holding = await tx.stockHolding.findUnique({ where: { userId_stockId: { userId: user.id, stockId: stock.id } } });
      if (body.side === "BUY") {
        if (!wallet || Number(wallet.cash) < total) throw new Error("رصيد غير كافٍ");
        await tx.wallet.update({ where: { userId: user.id }, data: { cash: { decrement: total } } });
        const oldQuantity = holding?.quantity ?? 0; const oldAverage = Number(holding?.averagePrice ?? 0); const average = (oldQuantity * oldAverage + total) / (oldQuantity + quantity);
        await tx.stockHolding.upsert({ where: { userId_stockId: { userId: user.id, stockId: stock.id } }, update: { quantity: { increment: quantity }, averagePrice: average }, create: { userId: user.id, stockId: stock.id, quantity, averagePrice: price } });
      } else {
        if (!holding || holding.quantity < quantity) throw new Error("الكمية المملوكة غير كافية");
        await tx.wallet.update({ where: { userId: user.id }, data: { cash: { increment: total } } });
        await tx.stockHolding.update({ where: { userId_stockId: { userId: user.id, stockId: stock.id } }, data: { quantity: { decrement: quantity } } });
      }
      await tx.transaction.create({ data: { userId: user.id, type: body.side === "BUY" ? "STOCK_BUY" : "STOCK_SELL", amount: total, balanceBefore: wallet?.cash ?? 0, balanceAfter: body.side === "BUY" ? Number(wallet?.cash ?? 0) - total : Number(wallet?.cash ?? 0) + total, reference: stock.symbol } });
      return { executed: true, side: body.side, quantity, price, total };
    });
    return NextResponse.json({ ok: true, order: result });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "فشل تنفيذ الأمر" }, { status: 400 }); }
}

export async function GET() { const user = await getCurrentUser(); if (!user) return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 }); return NextResponse.json({ orders: await prisma.order.findMany({ where: { userId: user.id }, include: { stock: true }, orderBy: { createdAt: "desc" }, take: 100 }) }); }
