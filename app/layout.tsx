import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ocean English | Learn and Play",
  description: "One welcoming home for OceanLearn, OceanPlay and future Maldivian English-learning adventures.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
