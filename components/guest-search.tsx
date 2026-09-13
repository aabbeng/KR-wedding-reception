"use client";
import { Search, X } from "lucide-react";

export function GuestSearch({ value, onChange, autoFocus = false }: { value: string; onChange: (value: string) => void; autoFocus?: boolean }) {
  return <label className="relative block"><span className="sr-only">Search guest name</span><Search className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-[#8B6B4A]" size={27} /><input autoFocus={autoFocus} value={value} onChange={(event) => onChange(event.target.value)} type="search" placeholder="Search guest name…" className="h-16 w-full rounded-2xl border-2 border-[#D8C3A5] bg-white pl-15 pr-14 text-xl shadow-sm outline-none transition placeholder:text-[#8B6B4A] focus:border-[#6B2C2C] focus:ring-4 focus:ring-[#6B2C2C]/10 sm:h-18 sm:text-2xl" />{value && <button type="button" onClick={() => onChange("")} aria-label="Clear search" className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full text-[#8B6B4A] hover:bg-[#D8C3A5]"><X size={23} /></button>}</label>;
}


