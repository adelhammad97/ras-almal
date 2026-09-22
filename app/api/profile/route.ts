import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 });
  const profile = await prisma.user.findUnique({ where: { id: user.id }, select: { id: true, username: true, email: true, phone: true, avatarUrl: true, avatarFrame: true, bio: true, title: true, level: true, experience: true, creditScore: true, createdAt: true, lastSeenAt: true } });
  return NextResponse.json({ profile });
}

export async function PATCH(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 });
  const body = await request.json() as { username?: string; bio?: string; title?: string; avatarUrl?: string; avatarFrame?: string };
  const data = {
    ...(body.username?.trim() ? { username: body.username.trim().slice(0, 24) } : {}),
    ...(typeof body.bio === "string" ? { bio: body.bio.slice(0, 300) } : {}),
    ...(typeof body.title === "string" ? { title: body.title.slice(0, 60) } : {}),
    ...(typeof body.avatarUrl === "string" ? { avatarUrl: body.avatarUrl.slice(0, 500) } : {}),
    ...(typeof body.avatarFrame === "string" ? { avatarFrame: body.avatarFrame.slice(0, 60) } : {}),
  };
  try { const profile = await prisma.user.update({ where: { id: user.id }, data, select: { id: true, username: true, email: true, phone: true, avatarUrl: true, avatarFrame: true, bio: true, title: true, level: true, experience: true, createdAt: true } }); return NextResponse.json({ ok: true, profile }); }
  catch { return NextResponse.json({ error: "اسم المستخدم مستخدم أو البيانات غير صحيحة" }, { status: 409 }); }
}
