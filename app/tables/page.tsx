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
  return <div><div className="mb-7"><p className="mb-1 text-sm font-bold uppercase tracking-[.15em] text-[#8B6B4A]">Floor overview</p><h1 className="font-serif text-4xl font-semibold">Tables</h1><p className="mt-2 text-[#8B6B4A]">Guests are listed by table below.</p></div>{error && <ErrorMessage message={error} onRetry={() => void load()} />}<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{tables.map((table) => { const arrived = table.guests.filter((g) => g.attendance_status === "arrived").length; return <section key={table.id} className="rounded-2xl border border-[#D8C3A5] bg-white p-5 shadow-sm"><div className="flex items-end justify-between border-b border-[#D8C3A5] pb-3"><div><p className="text-sm font-bold uppercase tracking-[.12em] text-[#8B6B4A]">Table</p><h2 className="font-serif text-4xl font-semibold text-[#6B2C2C]">{table.table_number}</h2></div><p className="font-bold text-[#8B6B4A]">{arrived} / {table.guests.length}</p></div><ul className="mt-3 space-y-2">{table.guests.map((guest) => { const present = guest.attendance_status === "arrived"; return <li key={guest.id} className={`flex items-center gap-2 rounded-lg px-2 py-2 ${present ? "bg-[#D8C3A5] text-[#6B2C2C]" : "text-[#3E2723]"}`}>{present ? <Check size={18} strokeWidth={3} /> : <Circle size={14} className="text-[#8B6B4A]" />}<span className="font-semibold">{guest.name}</span><span className="ml-auto text-sm text-[#8B6B4A]">Seat {guest.seat_number ?? "—"}</span></li>; })}</ul>{table.name && <p className="mt-3 text-sm font-semibold text-[#8B6B4A]">{table.name}</p>}</section>; })}</div>{!error && tables.length === 0 && <p className="rounded-2xl bg-white p-8 text-center text-[#8B6B4A]">Loading tables…</p>}</div>;
}
