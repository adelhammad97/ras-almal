import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE, tokenHash } from "@/lib/auth";

export async function getCurrentUser() { const token = cookies().get(SESSION_COOKIE)?.value; if (!token) return null; const session = await prisma.session.findUnique({ where: { tokenHash: tokenHash(token) }, include: { user: true } }); if (!session || session.expiresAt < new Date() || session.user.isBanned) return null; return session.user; }
