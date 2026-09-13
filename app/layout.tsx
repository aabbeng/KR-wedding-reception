import type { Metadata, Viewport } from "next";
import { AppShell } from "@/components/app-shell";
import { WebMcpTools } from "@/components/webmcp-tools";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wedding Reception Desk",
  description: "Wedding guest check-in and table management.",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#6B2C2C" };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body><WebMcpTools /><AppShell>{children}</AppShell></body>
    </html>
  );
}


