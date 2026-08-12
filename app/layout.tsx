import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Atollingo | English Adventures",
  description: "Atollingo is the home of OceanLearn, OceanPlay and future Maldivian English-learning adventures.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
