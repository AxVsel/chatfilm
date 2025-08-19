"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white shadow-md w-full h-14 flex justify-between items-center px-6">
      {/* Kiri: Logo + Menu */}
      <div className="flex items-center gap-6">
        <img
          src="/logo-name.png"
          alt="Logo"
          className="w-40 h-auto object-contain"
        />
        <nav className="flex gap-3">
          <Link
            href="/"
            className="text-zinc-800 px-4 py-2 rounded-md font-semibold transition"
          >
            Home
          </Link>
          <Link
            href="/chatbot"
            className="text-zinc-800 px-4 py-2 rounded-md font-semibold transition"
          >
            Chatboot
          </Link>
        </nav>
      </div>
    </header>
  );
}
