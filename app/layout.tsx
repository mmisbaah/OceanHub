import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Atollingo | My Learning Hub",
  description: "A connected learning hub for Maldivian children: lessons, games, worksheets and family learning support.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
