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
  return <div><div className="mb-14 border-b border-[#1A1A1A]/15 pb-8"><p className="mb-4 flex items-center gap-3 text-xs font-medium uppercase tracking-[.3em] text-[#6C6863]"><span className="h-px w-10 bg-[#D4AF37]" />Guest list</p><h1 className="font-serif text-5xl font-normal leading-[.95] tracking-tight md:text-7xl">Find a guest</h1><p className="mt-5 max-w-md text-base leading-relaxed text-[#6C6863]">Search by name or family group, then check guests in with one tap.</p></div><div className="sticky top-24 z-20 -mx-2 border-y border-[#1A1A1A]/15 bg-[#F9F8F6]/95 px-2 py-4 backdrop-blur"><GuestSearch value={search} onChange={setSearch} autoFocus /></div>{error && <ErrorMessage message={error} onRetry={() => void load()} />}<p className="mb-6 mt-8 text-xs font-medium uppercase tracking-[.25em] text-[#6C6863]">{loading ? "Searching…" : `${guests.length} ${guests.length === 1 ? "guest" : "guests"}${search ? " found" : ""}`}</p><div className="grid gap-8 lg:grid-cols-2">{guests.map((guest) => <GuestCard key={guest.id} guest={guest} busy={busyId === guest.id} onCheckIn={(item) => update(item)} onUndo={(item) => update(item, true)} />)}</div>{!loading && !error && guests.length === 0 && <div className="border-t border-[#1A1A1A] py-12 text-center"><h2 className="font-serif text-3xl font-normal">No guest found</h2><p className="mt-3 text-[#6C6863]">Try part of their first name, surname, or family name.</p></div>}{undoGuest && <CheckInToast name={undoGuest.name} busy={busyId === undoGuest.id} onUndo={() => update(undoGuest, true)} />}</div>;
}


