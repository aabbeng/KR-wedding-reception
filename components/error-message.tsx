import { CircleAlert } from "lucide-react";

export function ErrorMessage({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return <div role="alert" className="my-4 flex items-center justify-between gap-4 rounded-2xl border border-[#D8C3A5] bg-[#F8F1E7] p-4 text-[#6B2C2C]"><span className="flex items-center gap-3 font-semibold"><CircleAlert className="shrink-0" />{message}</span>{onRetry && <button type="button" onClick={onRetry} className="min-h-11 shrink-0 rounded-xl bg-white px-4 font-bold shadow-sm">Try again</button>}</div>;
}


