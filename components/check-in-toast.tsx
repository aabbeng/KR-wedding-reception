"use client";
export function CheckInToast({ name, onUndo, busy }: { name: string; onUndo: () => void; busy: boolean }) {
  return <div role="status" className="fixed bottom-24 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center justify-between gap-4 rounded-2xl bg-[#3E2723] px-5 py-4 text-white shadow-2xl sm:bottom-8"><span><strong className="block">{name} checked in</strong><span className="text-sm text-white/70">Arrival time saved</span></span><button disabled={busy} onClick={onUndo} className="min-h-12 rounded-xl bg-white/12 px-5 font-bold text-[#D8C3A5] hover:bg-white/20 disabled:opacity-50">Undo</button></div>;
}


