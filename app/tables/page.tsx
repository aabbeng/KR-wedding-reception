"use client";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { ErrorMessage } from "@/components/error-message";
import { requestJson } from "@/lib/client-api";
import type { WeddingTable } from "@/lib/types";

export default function TablesPage() {
  const [tables, setTables] = useState<WeddingTable[]>([]);
  const [error, setError] = useState("");
  async function load() { try { setError(""); const data = await requestJson<{ tables?: WeddingTable[] }>("/api/tables", { cache: "no-store" }); setTables(data.tables ?? []); } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to load tables."); } }
  useEffect(() => { void load(); }, []);
  return <div><div className="mb-7"><p className="mb-1 text-sm font-bold uppercase tracking-[.15em] text-[#8B6B4A]">Floor overview</p><h1 className="font-serif text-4xl font-semibold">Tables</h1></div>{error && <ErrorMessage message={error} onRetry={() => void load()} />}<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{tables.map((table) => { const arrived = table.guests.filter((g) => g.attendance_status === "arrived").length; const total = table.guests.length; const pct = total ? Math.round(arrived / total * 100) : 0; return <button type="button" key={table.id} onClick={() => window.location.assign(`/tables/${table.id}`)} className="group rounded-2xl border border-[#D8C3A5] bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"><div className="flex items-start justify-between"><div><p className="text-sm font-bold uppercase tracking-[.12em] text-[#8B6B4A]">Table</p><h2 className="text-5xl font-extrabold text-[#6B2C2C]">{table.table_number}</h2></div><ArrowRight /></div><p className="mt-5 text-xl font-bold"><span className="text-[#8B6B4A]">{arrived}</span> <span className="text-[#8B6B4A]">/ {total} arrived</span></p><div className="mt-3 h-3 overflow-hidden rounded-full bg-[#D8C3A5]"><div className="h-full rounded-full bg-[#8B6B4A]" style={{ width: `${pct}%` }} /></div>{table.name && <p className="mt-3 text-sm font-semibold text-[#8B6B4A]">{table.name}</p>}</button>; })}</div>{!error && tables.length === 0 && <p className="rounded-2xl bg-white p-8 text-center text-[#8B6B4A]">Loading tables…</p>}</div>;
}



