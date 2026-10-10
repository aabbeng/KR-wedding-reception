"use client";
import { Search, X } from "lucide-react";

export function GuestSearch({ value, onChange, autoFocus = false }: { value: string; onChange: (value: string) => void; autoFocus?: boolean }) {
  return <label className="relative block"><span className="sr-only">Search guest name</span><Search className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-[#6C6863]" size={25} strokeWidth={1.5} /><input autoFocus={autoFocus} value={value} onChange={(event) => onChange(event.target.value)} type="search" placeholder="Search guest name…" className="h-16 w-full appearance-none border-y border-[#1A1A1A]/25 bg-transparent pl-16 pr-14 font-sans text-lg text-[#1A1A1A] outline-none transition placeholder:text-[#6C6863] focus:border-[#D4AF37] [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none" />{value && <button type="button" onClick={() => onChange("")} aria-label="Clear search" className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center text-[#6C6863] hover:text-[#D4AF37]"><X size={20} strokeWidth={1.5} /></button>}</label>;
}


