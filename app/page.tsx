"use client";
import { useEffect, useState } from "react";
import { ArrowRight, Gift, Images, TableProperties, Users } from "lucide-react";
import { GuestSearch } from "@/components/guest-search";
import { ErrorMessage } from "@/components/error-message";
import { requestJson } from "@/lib/client-api";
import type { Guest } from "@/lib/types";

const shortcuts = [
  { href: "/guests", label: "Guests", icon: Users, color: "bg-[#D8C3A5] text-[#6B2C2C]" },
  { href: "/tables", label: "Tables", icon: TableProperties, color: "bg-[#D8C3A5] text-[#8B6B4A]" },
  { href: "/qr", label: "Wedding Token QR", icon: Gift, color: "bg-[#D8C3A5] text-[#6B2C2C]" },
  { href: "/qr", label: "Wedding Album QR", icon: Images, color: "bg-[#D8C3A5] text-[#8B6B4A]" },
];

export default function HomePage() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  async function loadTotals() { try { setError(""); const d = await requestJson<{ guests?: Guest[] }>("/api/guests"); setGuests(d.guests ?? []); } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to load guest totals."); } }
  useEffect(() => { void loadTotals(); }, []);
  const arrived = guests.filter((g) => g.attendance_status === "arrived").length;
  const go = (href: string) => { window.location.assign(href); };
  return <div><div className="mb-7 flex items-end justify-between gap-4"><div><p className="mb-1 text-sm font-bold uppercase tracking-[.15em] text-[#8B6B4A]">Welcome desk</p><h1 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">Good afternoon</h1></div><div className="hidden rounded-xl bg-[#D8C3A5] px-4 py-2 text-sm font-bold text-[#6B2C2C] sm:block">Reception open</div></div><div><GuestSearch value={search} onChange={setSearch} />{search.trim() && <button type="button" onClick={() => go(`/guests?q=${encodeURIComponent(search)}`)} className="mt-3 flex min-h-14 w-full items-center justify-between rounded-xl bg-[#6B2C2C] px-5 text-lg font-bold text-white">See matching guests <ArrowRight /></button>}</div>{error && <ErrorMessage message={error} onRetry={() => void loadTotals()} />}<section className="mt-7 grid grid-cols-2 gap-4" aria-label="Guest totals"><div className="rounded-2xl border border-[#D8C3A5] bg-white p-5 sm:p-6"><span className="text-base font-semibold text-[#8B6B4A]">Total guests</span><strong className="mt-1 block text-4xl sm:text-5xl">{guests.length || "—"}</strong></div><div className="rounded-2xl border border-[#D8C3A5] bg-[#D8C3A5] p-5 sm:p-6"><span className="text-base font-semibold text-[#8B6B4A]">Arrived</span><strong className="mt-1 block text-4xl text-[#6B2C2C] sm:text-5xl">{guests.length ? arrived : "—"}</strong></div></section><section className="mt-8"><h2 className="mb-4 font-serif text-2xl font-semibold">Quick access</h2><div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{shortcuts.map(({ href, label, icon: Icon, color }) => <button type="button" key={label} onClick={() => go(href)} className="group flex min-h-32 flex-col justify-between rounded-2xl border border-[#D8C3A5] bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"><span className={`grid h-12 w-12 place-items-center rounded-xl ${color}`}><Icon size={26} /></span><span className="flex items-center justify-between text-lg font-bold">{label}<ArrowRight size={21} /></span></button>)}</div></section></div>;
}



