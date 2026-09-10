import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Atollingo | My Learning Hub",
  description: "A connected learning hub for Maldivian children: lessons, games, worksheets and family learning support.",
  icons: { icon: [{url:'/browser-icon-v2.png',type:'image/png'}], shortcut:'/browser-icon-v2.png', apple:'/browser-icon-v2.png' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
