"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, QrCode, TableProperties, Users } from "lucide-react";

const links = [{ href: "/", label: "Home", icon: Home }, { href: "/guests", label: "Guests", icon: Users }, { href: "/tables", label: "Tables", icon: TableProperties }, { href: "/qr", label: "QR", icon: QrCode }];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const item = (href: string, label: string, Icon: typeof Home, mobile = false) => {
    const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
    return <button type="button" key={href} onClick={() => window.location.assign(href)} className={mobile ? `flex min-h-16 flex-col items-center justify-center gap-1 rounded-xl text-sm font-semibold ${active ? "bg-[#D8C3A5] text-[#6B2C2C]" : "text-[#8B6B4A]"}` : `flex min-h-12 items-center gap-2 rounded-xl px-4 text-base font-semibold transition ${active ? "bg-[#D8C3A5] text-[#6B2C2C]" : "text-[#8B6B4A] hover:bg-[#D8C3A5]"}`}><Icon size={mobile ? 24 : 21} />{label}</button>;
  };
  return <div className="min-h-dvh bg-[#F8F1E7] text-[#3E2723]"><header className="sticky top-0 z-30 border-b border-[#D8C3A5] bg-[#FFFFFF]/95 backdrop-blur"><div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-5 sm:px-8"><a href="/" className="absolute left-1/2 flex min-h-12 -translate-x-1/2 items-center rounded-xl px-3"><span className="font-serif text-2xl font-semibold tracking-wide text-[#6B2C2C] sm:text-3xl">K &amp; R</span></a><nav className="hidden items-center gap-2 sm:flex" aria-label="Main navigation">{links.map(({ href, label, icon }) => item(href, label, icon))}</nav></div></header><main className="mx-auto max-w-6xl px-5 pb-28 pt-7 sm:px-8 sm:pb-10 sm:pt-9">{children}</main><nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-[#D8C3A5] bg-[#FFFFFF]/97 px-2 pb-[max(.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-8px_24px_rgba(80,45,36,.1)] sm:hidden" aria-label="Main navigation">{links.map(({ href, label, icon }) => item(href, label, icon, true))}</nav></div>;
}







