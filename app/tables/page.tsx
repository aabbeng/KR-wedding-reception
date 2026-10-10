"use client";
import { useEffect, useState } from "react";
import { Check, Circle } from "lucide-react";
import { ErrorMessage } from "@/components/error-message";
import { requestJson } from "@/lib/client-api";
import type { WeddingTable } from "@/lib/types";

export default function TablesPage() {
  const [tables, setTables] = useState<WeddingTable[]>([]);
  const [error, setError] = useState("");
  async function load() { try { setError(""); const data = await requestJson<{ tables?: WeddingTable[] }>("/api/tables", { cache: "no-store" }); setTables(data.tables ?? []); } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to load tables."); } }
  useEffect(() => { void load(); }, []);
  return <div><div className="mb-16 border-b border-[#1A1A1A]/15 pb-8"><p className="mb-4 flex items-center gap-3 text-xs font-medium uppercase tracking-[.3em] text-[#6C6863]"><span className="h-px w-10 bg-[#D4AF37]" />Floor overview</p><h1 className="font-serif text-5xl font-normal leading-[.95] tracking-tight md:text-7xl">Tables</h1><p className="mt-5 max-w-md text-base leading-relaxed text-[#6C6863]">A complete seating reference for the reception desk.</p></div>{error && <ErrorMessage message={error} onRetry={() => void load()} />}<div className="grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">{tables.map((table) => { const arrived = table.guests.filter((g) => g.attendance_status === "arrived").length; return <section key={table.id} className="border-t border-[#1A1A1A] pt-6"><div className="flex items-end justify-between border-b border-[#1A1A1A]/15 pb-4"><div><p className="text-[10px] font-medium uppercase tracking-[.3em] text-[#6C6863]">Table</p><h2 className="mt-2 font-serif text-5xl font-normal text-[#1A1A1A]">{table.table_number}</h2></div><p className="text-xs font-medium uppercase tracking-[.18em] text-[#6C6863]">{arrived} / {table.guests.length}</p></div><ul className="mt-5 space-y-1">{table.guests.map((guest) => { const present = guest.attendance_status === "arrived"; return <li key={guest.id} className={`flex items-center gap-3 border-b border-[#1A1A1A]/10 py-3 ${present ? "text-[#1A1A1A]" : "text-[#6C6863]"}`}>{present ? <Check size={16} strokeWidth={1.5} className="text-[#D4AF37]" /> : <Circle size={12} strokeWidth={1.5} />}<span className="text-sm font-medium">{guest.name}</span><span className="ml-auto text-[10px] uppercase tracking-[.15em]">Seat {guest.seat_number ?? "—"}</span></li>; })}</ul>{table.name && <p className="mt-4 text-xs uppercase tracking-[.2em] text-[#6C6863]">{table.name}</p>}</section>; })}</div>{!error && tables.length === 0 && <p className="border-t border-[#1A1A1A] py-8 text-center text-[#6C6863]">Loading tables…</p>}</div>;
}
