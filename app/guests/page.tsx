"use client";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { GuestSearch } from "@/components/guest-search";
import { GuestCard } from "@/components/guest-card";
import { CheckInToast } from "@/components/check-in-toast";
import { ErrorMessage } from "@/components/error-message";
import { requestJson } from "@/lib/client-api";
import type { Guest } from "@/lib/types";

export default function GuestsPage() {
  const params = useSearchParams();
  const [search, setSearch] = useState(params.get("q") ?? "");
  const [tableFilter, setTableFilter] = useState("all");
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [undoGuest, setUndoGuest] = useState<Guest | null>(null);
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    setLoading(true);
    try {
      setError("");
      const data = await requestJson<{ guests?: Guest[] }>(`/api/guests?q=${encodeURIComponent(search)}`, { cache: "no-store" });
      setGuests(data.guests ?? []);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to search guests.");
    } finally { setLoading(false); }
  }, [search]);
  useEffect(() => { const timer = setTimeout(load, 180); return () => clearTimeout(timer); }, [load]);
  async function update(guest: Guest, undo = false) {
    setBusyId(guest.id);
    try {
      setError("");
      const data = await requestJson<{ guest: Guest }>("/api/check-in", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ guestId: guest.id, undo }) });
      setGuests((items) => items.map((item) => item.id === guest.id ? data.guest : item));
      setUndoGuest(undo ? null : data.guest);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to update this guest."); }
    finally { setBusyId(null); }
  }
  const tableNumbers = Array.from(new Set(guests.map((guest) => guest.table_number))).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  const visibleGuests = tableFilter === "all" ? guests : guests.filter((guest) => guest.table_number === tableFilter);
  return <div><div className="mb-14 border-b border-[#1A1A1A]/15 pb-8"><p className="mb-4 flex items-center gap-3 text-xs font-medium uppercase tracking-[.3em] text-[#6C6863]"><span className="h-px w-10 bg-[#D4AF37]" />Guest list</p><h1 className="font-serif text-5xl font-normal leading-[.95] tracking-tight md:text-7xl">Find a guest</h1></div><div className="sticky top-24 z-20 -mx-2 border-y border-[#1A1A1A]/15 bg-[#F9F8F6]/95 px-2 py-4 backdrop-blur"><GuestSearch value={search} onChange={(value) => { setSearch(value); setTableFilter("all"); }} autoFocus /><div className="mt-3 flex items-center gap-3"><label htmlFor="table-filter" className="text-[10px] font-medium uppercase tracking-[.25em] text-[#6C6863]">Table</label><select id="table-filter" value={tableFilter} onChange={(event) => setTableFilter(event.target.value)} className="h-10 flex-1 border-b border-[#1A1A1A]/30 bg-transparent px-1 text-sm outline-none"><option value="all">All tables</option>{tableNumbers.map((table) => <option key={table} value={table}>Table {table}</option>)}</select></div></div>{error && <ErrorMessage message={error} onRetry={() => void load()} />}<p className="mb-6 mt-8 text-xs font-medium uppercase tracking-[.25em] text-[#6C6863]">{loading ? "Searching…" : `${visibleGuests.length} ${visibleGuests.length === 1 ? "guest" : "guests"}${search || tableFilter !== "all" ? " found" : ""}`}</p><div className="grid gap-8 lg:grid-cols-2">{visibleGuests.map((guest) => <GuestCard key={guest.id} guest={guest} busy={busyId === guest.id} onCheckIn={(item) => update(item)} onUndo={(item) => update(item, true)} />)}</div>{!loading && !error && visibleGuests.length === 0 && <div className="border-t border-[#1A1A1A] py-12 text-center"><h2 className="font-serif text-3xl font-normal">No guest found</h2></div>}{undoGuest && <CheckInToast name={undoGuest.name} busy={busyId === undoGuest.id} onUndo={() => update(undoGuest, true)} />}</div>;
}


