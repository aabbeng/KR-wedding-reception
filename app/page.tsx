"use client";
import { useEffect, useState } from "react";
import { ArrowRight, Gift, Images, TableProperties, Users } from "lucide-react";
import { GuestSearch } from "@/components/guest-search";
import { ErrorMessage } from "@/components/error-message";
import { requestJson } from "@/lib/client-api";
import type { Guest } from "@/lib/types";

const shortcuts = [
  { href: "/guests", label: "Guests", icon: Users },
  { href: "/tables", label: "Tables", icon: TableProperties },
  { href: "/qr", label: "Wedding Token QR", icon: Gift },
  { href: "/qr", label: "Wedding Album QR", icon: Images },
];

export default function HomePage() {
  const [guests, setGuests] = useState<Guest[]>([]); const [search, setSearch] = useState(""); const [error, setError] = useState("");
  async function loadTotals() { try { setError(""); const d = await requestJson<{ guests?: Guest[] }>("/api/guests"); setGuests(d.guests ?? []); } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to load guest totals."); } }
  useEffect(() => { void loadTotals(); }, []);
  const arrived = guests.filter((g) => g.attendance_status === "arrived").length;
  const go = (href: string) => window.location.assign(href);
  return <div><div className="mb-16 grid gap-8 border-b border-[#1A1A1A]/15 pb-10 lg:grid-cols-[1fr_auto] lg:items-end"><div><p className="mb-5 flex items-center gap-3 text-xs font-medium uppercase tracking-[.3em] text-[#6C6863]"><span className="h-px w-10 bg-[#D4AF37]" />Welcome desk</p><h1 className="max-w-3xl font-serif text-6xl font-normal leading-[.9] tracking-tight md:text-8xl">Good<br /><em className="text-[#D4AF37]">afternoon.</em></h1></div><p className="max-w-xs text-sm leading-relaxed text-[#6C6863] lg:pb-2">A calm, considered desk for welcoming every guest to Keith Ray &amp; Rovina’s celebration.</p></div><div className="border-y border-[#1A1A1A]/15 py-5"><GuestSearch value={search} onChange={setSearch} />{search.trim() && <button type="button" onClick={() => go(`/guests?q=${encodeURIComponent(search)}`)} className="mt-4 flex h-14 w-full items-center justify-between bg-[#1A1A1A] px-6 text-xs font-medium uppercase tracking-[.2em] text-[#F9F8F6] transition-colors duration-500 hover:bg-[#D4AF37] hover:text-[#1A1A1A]">See matching guests <ArrowRight size={19} /> </button>}</div>{error && <ErrorMessage message={error} onRetry={() => void loadTotals()} />}<section className="mt-14 grid gap-10 border-b border-[#1A1A1A]/15 pb-14 sm:grid-cols-2"><div className="border-t border-[#1A1A1A] pt-5"><span className="text-xs font-medium uppercase tracking-[.25em] text-[#6C6863]">Total guests</span><strong className="mt-3 block font-serif text-6xl font-normal">{guests.length || "—"}</strong></div><div className="border-t border-[#D4AF37] pt-5"><span className="text-xs font-medium uppercase tracking-[.25em] text-[#6C6863]">Arrived</span><strong className="mt-3 block font-serif text-6xl font-normal">{guests.length ? arrived : "—"}</strong></div></section><section className="mt-14"><div className="mb-8 flex items-end justify-between"><h2 className="font-serif text-4xl font-normal">Quick access</h2><span className="text-xs uppercase tracking-[.25em] text-[#6C6863]">Reception desk</span></div><div className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">{shortcuts.map(({ href, label, icon: Icon }) => <button type="button" key={label} onClick={() => go(href)} className="group border-t border-[#1A1A1A] pt-5 text-left transition-colors duration-500 hover:border-[#D4AF37]"><span className="mb-12 block text-[#6C6863] transition-colors duration-500 group-hover:text-[#D4AF37]"><Icon size={25} strokeWidth={1.5} /></span><span className="flex items-center justify-between text-sm font-medium uppercase tracking-[.16em]">{label}<ArrowRight size={18} strokeWidth={1.5} /></span></button>)}</div></section></div>;
}
