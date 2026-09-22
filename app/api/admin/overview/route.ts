import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";

export async function GET() { const user=await getCurrentUser(); if(!user||!['ADMIN','MODERATOR','FINANCE_SUPPORT'].includes(user.role))return NextResponse.json({error:"صلاحية المشرف مطلوبة"},{status:403}); const [players,transactions,companies,orders,reports]=await Promise.all([prisma.user.findMany({select:{id:true,username:true,email:true,phone:true,role:true,level:true,experience:true,vipLevel:true,isBanned:true,isFrozen:true,lastSeenAt:true,createdAt:true,wallet:{select:{cash:true,bankBalance:true}}},orderBy:{createdAt:'desc'},take:200}),prisma.transaction.count(),prisma.company.count(),prisma.order.count(),prisma.report.count({where:{status:'OPEN'}})]); return NextResponse.json({players,metrics:{transactions,companies,orders,reports}}); }
