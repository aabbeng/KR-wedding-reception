"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Check, LoaderCircle, RotateCcw } from "lucide-react";
import { CheckInToast } from "@/components/check-in-toast";
import type { Guest, WeddingTable } from "@/lib/types";

export default function TableDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [table, setTable] = useState<WeddingTable | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [undoGuest, setUndoGuest] = useState<Guest | null>(null);
  useEffect(() => { void (async () => { const d = await (await fetch(`/api/tables/${id}`, { cache: "no-store" })).json() as { table?: WeddingTable }; setTable(d.table ?? null); })(); }, [id]);
  async function update(guest: Guest, undo = false) { setBusyId(guest.id); const r = await fetch("/api/check-in", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ guestId: guest.id, undo }) }); const d = await r.json() as { guest: Guest }; if (r.ok && table) { setTable({ ...table, guests: table.guests.map((item) => item.id === guest.id ? d.guest : item) }); setUndoGuest(undo ? null : d.guest); } setBusyId(null); }
  if (!table) return <p className="rounded-2xl bg-white p-8 text-center text-[#8B6B4A]">Loading table…</p>;
  const arrived = table.guests.filter((g) => g.attendance_status === "arrived").length;
  return <div><Link href="/tables" className="mb-5 inline-flex min-h-12 items-center gap-2 rounded-xl px-3 font-bold text-[#6B2C2C] hover:bg-[#D8C3A5]"><ArrowLeft /> All tables</Link><div className="mb-6 flex items-end justify-between gap-4"><div><p className="text-sm font-bold uppercase tracking-[.15em] text-[#8B6B4A]">Guest list</p><h1 className="font-serif text-5xl font-semibold">Table {table.table_number}</h1></div><p className="text-right text-lg font-bold text-[#8B6B4A]"><span className="text-3xl text-[#8B6B4A]">{arrived}</span> / {table.guests.length}<span className="block text-sm">arrived</span></p></div><div className="overflow-hidden rounded-2xl border border-[#D8C3A5] bg-white shadow-sm">{table.guests.map((guest) => { const present = guest.attendance_status === "arrived"; return <div key={guest.id} className={`flex min-h-20 items-center gap-4 border-b border-[#D8C3A5] px-5 py-4 last:border-0 ${present ? "bg-[#D8C3A5]" : "bg-white"}`}><span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${present ? "bg-[#D8C3A5] text-[#6B2C2C]" : "bg-[#D8C3A5] text-[#8B6B4A]"}`}>{present ? <Check strokeWidth={3} /> : <span className="h-3 w-3 rounded-full border-2 border-current" />}</span><div className="min-w-0 flex-1"><h2 className="truncate text-xl font-bold">{guest.name}</h2><p className="text-sm font-medium text-[#8B6B4A]">Seat {guest.seat_number ?? "—"}{guest.group_name ? ` · ${guest.group_name}` : ""}</p></div><button disabled={busyId === guest.id} onClick={() => update(guest, present)} className={`flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl px-4 font-extrabold disabled:opacity-60 ${present ? "border-2 border-[#8B6B4A] bg-white text-[#6B2C2C]" : "bg-[#6B2C2C] text-white"}`}>{busyId === guest.id ? <LoaderCircle className="animate-spin" /> : present ? <><RotateCcw size={18} /> UNDO</> : "CHECK IN"}</button></div>; })}</div>{undoGuest && <CheckInToast name={undoGuest.name} busy={busyId === undoGuest.id} onUndo={() => update(undoGuest, true)} />}</div>;
}


