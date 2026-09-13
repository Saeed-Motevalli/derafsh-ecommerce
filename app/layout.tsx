import type { Metadata } from "next";
import "./globals.css";
import "@fontsource/vazirmatn/400.css";
import "@fontsource/vazirmatn/500.css";
import "@fontsource/vazirmatn/600.css";
import "@fontsource/vazirmatn/700.css";
import "@fontsource/vazirmatn/800.css";
import "@fontsource/estedad/600.css";
import "@fontsource/estedad/700.css";
import "@fontsource/estedad/800.css";

export const metadata: Metadata = {
  title: "فروشگاه درفش",
  description: "فروشگاه فارسی پرچم‌های کشورهای جهان با فروش تکی و عمده.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" data-scroll-behavior="smooth">
      <body className="antialiased">{children}</body>
    </html>
  );
}
