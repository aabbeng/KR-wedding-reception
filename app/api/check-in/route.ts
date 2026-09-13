import { NextRequest, NextResponse } from "next/server";
import { checkInGuest, undoCheckIn } from "@/lib/repository";

export async function POST(request: NextRequest) {
  try {
    const { guestId, undo = false } = await request.json() as { guestId?: string; undo?: boolean };
    if (!guestId) return NextResponse.json({ error: "Guest ID is required" }, { status: 400 });
    return NextResponse.json({ guest: undo ? await undoCheckIn(guestId) : await checkInGuest(guestId) });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to update guest" }, { status: 500 }); }
}
