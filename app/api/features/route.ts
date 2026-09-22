import { NextResponse } from "next/server";
import { featureCatalog, defaultFeatureState } from "@/lib/features";
export async function GET() { return NextResponse.json({ ok: true, total: featureCatalog.length, enabled: Object.keys(defaultFeatureState).length, groups: [...new Set(featureCatalog.map((feature) => feature.group))], features: defaultFeatureState, generatedAt: new Date().toISOString() }); }
