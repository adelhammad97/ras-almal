import { NextResponse } from "next/server";
import { defaultFeatureState } from "@/lib/features";

export async function GET() {
  return NextResponse.json({ ok: true, features: defaultFeatureState, generatedAt: new Date().toISOString() });
}
