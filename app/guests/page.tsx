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
  return <div><div className="mb-6"><p className="mb-1 text-sm font-bold uppercase tracking-[.15em] text-[#8B6B4A]">Guest list</p><h1 className="font-serif text-4xl font-semibold">Find a guest</h1></div><div className="sticky top-24 z-20 -mx-2 rounded-2xl bg-[#F8F1E7]/95 p-2 backdrop-blur"><GuestSearch value={search} onChange={setSearch} autoFocus /></div>{error && <ErrorMessage message={error} onRetry={() => void load()} />}<p className="mb-4 mt-5 text-base font-semibold text-[#8B6B4A]">{loading ? "Searching…" : `${guests.length} ${guests.length === 1 ? "guest" : "guests"}${search ? " found" : ""}`}</p><div className="grid gap-4 lg:grid-cols-2">{guests.map((guest) => <GuestCard key={guest.id} guest={guest} busy={busyId === guest.id} onCheckIn={(item) => update(item)} onUndo={(item) => update(item, true)} />)}</div>{!loading && !error && guests.length === 0 && <div className="rounded-2xl border border-dashed border-[#D8C3A5] bg-white p-10 text-center"><h2 className="font-serif text-2xl font-semibold">No guest found</h2><p className="mt-2 text-[#8B6B4A]">Try part of their first name, surname, or family name.</p></div>}{undoGuest && <CheckInToast name={undoGuest.name} busy={busyId === undoGuest.id} onUndo={() => update(undoGuest, true)} />}</div>;
}


