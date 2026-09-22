import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSessionToken, hashPassword, SESSION_COOKIE, tokenHash, validEmail, validUsername } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json() as { username?: string; email?: string; password?: string; phone?: string };
    const username = body.username?.trim(); const email = body.email?.trim().toLowerCase(); const password = body.password ?? "";
    if (!username || !validUsername(username)) return NextResponse.json({ error: "اسم المستخدم غير صالح" }, { status: 400 });
    if (!email || !validEmail(email)) return NextResponse.json({ error: "البريد الإلكتروني غير صالح" }, { status: 400 });
    if (password.length < 8) return NextResponse.json({ error: "كلمة المرور يجب أن تكون 8 أحرف على الأقل" }, { status: 400 });
    const exists = await prisma.user.findFirst({ where: { OR: [{ username }, { email }] }, select: { id: true } });
    if (exists) return NextResponse.json({ error: "اسم المستخدم أو البريد مستخدم بالفعل" }, { status: 409 });
    const user = await prisma.user.create({ data: { username, email, phone: body.phone?.trim() || null, passwordHash: hashPassword(password), wallet: { create: {} }, lastSeenAt: new Date() }, select: { id: true, username: true, email: true, level: true, createdAt: true } });
    const rawToken = createSessionToken();
    await prisma.session.create({ data: { tokenHash: tokenHash(rawToken), userId: user.id, expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) } });
    const response = NextResponse.json({ ok: true, user }); response.cookies.set(SESSION_COOKIE, rawToken, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 30 }); return response;
  } catch { return NextResponse.json({ error: "تعذر إنشاء الحساب" }, { status: 500 }); }
}
