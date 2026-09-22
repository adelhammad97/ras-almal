import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";

async function admin() { const user = await getCurrentUser(); return user && (user.role === "ADMIN" || user.role === "MODERATOR") ? user : null; }
export async function GET() { const user = await admin(); if (!user) return NextResponse.json({ error: "صلاحية المشرف مطلوبة" }, { status: 403 }); const players = await prisma.user.findMany({ select: { id: true, username: true, email: true, role: true, level: true, experience: true, isBanned: true, creditScore: true, lastSeenAt: true, createdAt: true, wallet: { select: { cash: true, bankBalance: true } } }, orderBy: { createdAt: "desc" }, take: 100 }); return NextResponse.json({ players }); }
