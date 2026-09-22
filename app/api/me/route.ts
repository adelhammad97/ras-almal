import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 });
  const [profile, wallet, transactions, activity, logins, companies, realEstate, vehicles, friends] = await Promise.all([
    prisma.user.findUnique({ where: { id: user.id }, select: { id:true, username:true, email:true, phone:true, avatarUrl:true, avatarFrame:true, profileBackground:true, bio:true, title:true, level:true, experience:true, reputation:true, creditScore:true, vipLevel:true, role:true, createdAt:true, lastSeenAt:true } }),
    prisma.wallet.findUnique({ where: { userId: user.id } }),
    prisma.transaction.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 50 }),
    prisma.activity.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 30 }),
    prisma.loginEvent.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 20 }),
    prisma.company.findMany({ where: { ownerId: user.id }, select: { id:true, name:true, sector:true, city:true, capital:true, value:true, reputation:true } }),
    prisma.realEstate.findMany({ where: { ownerId: user.id }}),
    prisma.vehicle.findMany({ where: { ownerId: user.id }}),
    prisma.friendship.findMany({ where: { OR: [{ senderId:user.id }, { receiverId:user.id }], status:"ACCEPTED" }, include: { sender: { select:{ username:true } }, receiver:{ select:{ username:true } } } }),
  ]);
  return NextResponse.json({ profile, wallet, transactions, activity, logins, companies, realEstate, vehicles, friends });
}

export async function PATCH(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 });
  const body = await request.json() as Record<string, unknown>;
  const data = {
    ...(typeof body.username === "string" ? { username: body.username.trim().slice(0,24) } : {}),
    ...(typeof body.bio === "string" ? { bio: body.bio.slice(0,300) } : {}),
    ...(typeof body.title === "string" ? { title: body.title.slice(0,60) } : {}),
    ...(typeof body.avatarUrl === "string" ? { avatarUrl: body.avatarUrl.slice(0,500) } : {}),
    ...(typeof body.avatarFrame === "string" ? { avatarFrame: body.avatarFrame.slice(0,60) } : {}),
    ...(typeof body.profileBackground === "string" ? { profileBackground: body.profileBackground.slice(0,120) } : {}),
  };
  try { const profile = await prisma.user.update({ where: { id:user.id }, data, select: { id:true, username:true, email:true, phone:true, avatarUrl:true, avatarFrame:true, profileBackground:true, bio:true, title:true, level:true, experience:true, reputation:true, creditScore:true, vipLevel:true, createdAt:true } }); await prisma.activity.create({ data:{ userId:user.id, type:"PROFILE_UPDATE", message:"تم تحديث الملف الشخصي" } }); return NextResponse.json({ ok:true, profile }); } catch { return NextResponse.json({ error:"اسم المستخدم مستخدم أو البيانات غير صحيحة" }, { status:409 }); }
}
