"use client";
export function CheckInToast({ name, onUndo, busy }: { name: string; onUndo: () => void; busy: boolean }) {
  return <div role="status" className="fixed bottom-24 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 items-center justify-between gap-6 border-t-2 border-[#D4AF37] bg-[#1A1A1A] px-6 py-5 text-[#F9F8F6] shadow-[0_8px_32px_rgba(0,0,0,.16)] sm:bottom-8"><span><strong className="block text-sm font-medium uppercase tracking-[.12em]">{name} checked in</strong><span className="mt-1 block text-sm text-[#EBE5DE]">Arrival time saved</span></span><button disabled={busy} onClick={onUndo} className="min-h-12 border border-[#D4AF37] px-5 text-xs font-medium uppercase tracking-[.18em] text-[#D4AF37] transition-colors duration-500 hover:bg-[#D4AF37] hover:text-[#1A1A1A] disabled:opacity-50">Undo</button></div>;
}


