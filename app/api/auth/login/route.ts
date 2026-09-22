import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE, tokenHash, verifyPassword, createSessionToken } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json() as { login?: string; password?: string }; const login = body.login?.trim().toLowerCase();
  if (!login || !body.password) return NextResponse.json({ error: "أدخل بيانات الدخول" }, { status: 400 });
  const user = await prisma.user.findFirst({ where: { OR: [{ email: login }, { username: login }, { phone: login }] } });
  if (!user?.passwordHash || !verifyPassword(body.password, user.passwordHash)) return NextResponse.json({ error: "بيانات الدخول غير صحيحة" }, { status: 401 });
  if (user.isBanned) return NextResponse.json({ error: "الحساب محظور" }, { status: 403 });
  const rawToken = createSessionToken(); await prisma.session.create({ data: { tokenHash: tokenHash(rawToken), userId: user.id, expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) } });
  await prisma.user.update({ where: { id: user.id }, data: { lastSeenAt: new Date() } });
  const response = NextResponse.json({ ok: true, user: { id: user.id, username: user.username, level: user.level } }); response.cookies.set(SESSION_COOKIE, rawToken, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 30 }); return response;
}
