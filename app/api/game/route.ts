import { NextResponse } from "next/server";
import { DEFAULT_GAME_STATE } from "@/lib/game";
export async function GET(){return NextResponse.json({ok:true,data:DEFAULT_GAME_STATE,serverTime:new Date().toISOString()});}
