import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Atollingo | Language Learning Hub",
  description: "Atollingo is the home of OceanLearn, OceanPlay, OceanArabic and future language-learning adventures for Maldivian children.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
