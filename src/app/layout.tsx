import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ChatFilm 🎬 - Asisten AI Film, Series & Anime",
  description:
    "Tanyakan rekomendasi film, sinopsis series, karakter anime, dan seputar dunia hiburan dengan ChatFilm AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#090d16] text-slate-100 h-full flex flex-col`}
      >
        {children}
      </body>
    </html>
  );
}
