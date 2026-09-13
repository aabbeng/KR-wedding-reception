import { NextResponse } from "next/server";
import { listTables } from "@/lib/repository";

export async function GET() {
  try { return NextResponse.json({ tables: await listTables() }); }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to load tables" }, { status: 500 }); }
}
