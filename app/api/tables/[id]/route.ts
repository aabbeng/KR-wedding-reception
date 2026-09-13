import { NextResponse } from "next/server";
import { listTables } from "@/lib/repository";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const table = (await listTables()).find((item) => item.id === id);
    return table ? NextResponse.json({ table }) : NextResponse.json({ error: "Table not found" }, { status: 404 });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to load table" }, { status: 500 }); }
}
