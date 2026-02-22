import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vault",
  description: "Your personal code snippet vault",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistMono.variable}>
      <body className={`${GeistMono.className} antialiased bg-black text-white`}>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
