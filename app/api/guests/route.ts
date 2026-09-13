import { NextRequest, NextResponse } from "next/server";
import { dataMode, listGuests } from "@/lib/repository";

export async function GET(request: NextRequest) {
  try { return NextResponse.json({ guests: await listGuests(request.nextUrl.searchParams.get("q") ?? ""), mode: dataMode() }); }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to load guests" }, { status: 500 }); }
}
