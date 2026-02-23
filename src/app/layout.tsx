import type { Metadata } from "next";
import { Noto_Sans_Mongolian, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const notoMongolian = Noto_Sans_Mongolian({
  weight: "400",
  variable: "--font-mongolian",
  subsets: ["latin"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "JOYFIT – Жаргалтайгаар галбирж",
  description: "Жин хасах нийгэмлэг, хяналт, урамшуулал.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="mn" className={`${notoMongolian.variable} ${plusJakarta.variable}`}>
      <body className="antialiased min-h-screen bg-[var(--color-gray-50)]">
        {children}
      </body>
    </html>
  );
}
