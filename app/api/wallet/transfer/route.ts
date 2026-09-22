import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE, tokenHash } from "@/lib/auth";
import { getCurrentUser } from "@/lib/current-user";

export async function POST(request: Request) {
  const user = await getCurrentUser(); if (!user) return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 });
  const body = await request.json() as { receiverUsername?: string; amount?: number; note?: string }; const amount = Number(body.amount);
  if (!body.receiverUsername || !Number.isFinite(amount) || amount <= 0 || amount > 1_000_000) return NextResponse.json({ error: "بيانات التحويل غير صحيحة" }, { status: 400 });
  const receiver = await prisma.user.findUnique({ where: { username: body.receiverUsername }, include: { wallet: true } });
  if (!receiver || receiver.id === user.id || !receiver.wallet) return NextResponse.json({ error: "المستلم غير موجود" }, { status: 404 });
  const fee = Math.max(1, Math.round(amount * 0.01));
  try {
    const result = await prisma.$transaction(async (tx) => {
      const senderWallet = await tx.wallet.findUnique({ where: { userId: user.id } });
      if (!senderWallet || Number(senderWallet.cash) < amount + fee) throw new Error("رصيد غير كافٍ");
      await tx.wallet.update({ where: { userId: user.id }, data: { cash: { decrement: amount + fee } } });
      await tx.wallet.update({ where: { userId: receiver.id }, data: { cash: { increment: amount } } });
      await tx.transfer.create({ data: { senderId: user.id, receiverId: receiver.id, amount, fee, note: body.note?.slice(0, 200) } });
      await tx.transaction.create({ data: { userId: user.id, type: "TRANSFER", amount: amount + fee, balanceBefore: senderWallet.cash, balanceAfter: Number(senderWallet.cash) - amount - fee, reference: receiver.id } });
      await tx.transaction.create({ data: { userId: receiver.id, type: "TRANSFER", amount, balanceBefore: receiver.wallet!.cash, balanceAfter: Number(receiver.wallet!.cash) + amount, reference: user.id } });
      return { amount, fee };
    });
    return NextResponse.json({ ok: true, transfer: result });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "فشل التحويل" }, { status: 400 }); }
}
