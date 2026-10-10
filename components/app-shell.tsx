"use client";
import { usePathname } from "next/navigation";
import { Home, QrCode, TableProperties, Users } from "lucide-react";

const links = [{ href: "/", label: "Home", icon: Home }, { href: "/guests", label: "Guests", icon: Users }, { href: "/tables", label: "Tables", icon: TableProperties }, { href: "/qr", label: "QR", icon: QrCode }];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const item = (href: string, label: string, Icon: typeof Home, mobile = false) => {
    const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
    return <button type="button" key={href} onClick={() => window.location.assign(href)} className={mobile ? `flex min-h-16 flex-col items-center justify-center gap-1 text-[11px] uppercase tracking-[.18em] transition-colors duration-500 ${active ? "border-t-2 border-[#D4AF37] text-[#1A1A1A]" : "text-[#6C6863]"}` : `flex min-h-12 items-center gap-2 border-b-2 px-4 text-xs font-medium uppercase tracking-[.2em] transition-colors duration-500 ${active ? "border-[#D4AF37] text-[#1A1A1A]" : "border-transparent text-[#6C6863] hover:border-[#D4AF37] hover:text-[#1A1A1A]"}`}><Icon size={mobile ? 21 : 18} strokeWidth={1.5} />{label}</button>;
  };
  return <div className="min-h-dvh bg-[#F9F8F6] text-[#1A1A1A]"><header className="sticky top-0 z-30 border-b border-[#1A1A1A]/15 bg-[#F9F8F6]/95 backdrop-blur"><div className="mx-auto flex h-24 max-w-[1600px] items-center justify-between px-8 md:px-16"><button type="button" onClick={() => window.location.assign("/")} className="absolute left-1/2 flex min-h-12 -translate-x-1/2 items-center px-3"><span className="font-serif text-3xl font-normal tracking-tight text-[#1A1A1A] sm:text-4xl">K &amp; R</span></button><nav className="hidden items-center gap-2 sm:flex" aria-label="Main navigation">{links.map(({ href, label, icon }) => item(href, label, icon))}</nav></div></header><main className="mx-auto max-w-[1600px] px-8 pb-28 pt-16 md:px-16 md:pb-12 md:pt-24">{children}</main><nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-[#1A1A1A]/15 bg-[#F9F8F6]/98 px-2 pb-[max(.5rem,env(safe-area-inset-bottom))] pt-2 sm:hidden" aria-label="Main navigation">{links.map(({ href, label, icon }) => item(href, label, icon, true))}</nav></div>;
}







