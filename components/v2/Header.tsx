"use client";

import { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);
  const phone = "010-5858-1942";

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-xl font-black text-slate-950"
        >
          {open ? "×" : "☰"}
        </button>

        <a
          href="/"
          className="text-xl font-black tracking-[-0.05em] text-slate-950"
        >
          골드하우징
        </a>

        <a
          href={`tel:${phone}`}
          className="rounded-full bg-yellow-400 px-4 py-2 text-sm font-black text-black"
        >
          상담
        </a>
      </div>

      {open && (
        <nav className="border-t border-gray-100 bg-white px-5 py-5 shadow-xl">
          <div className="mx-auto grid max-w-7xl gap-3 text-lg font-black">
            <a href="/" onClick={() => setOpen(false)} className="rounded-2xl bg-gray-50 px-4 py-4">
              홈
            </a>

            <a href="/#properties" onClick={() => setOpen(false)} className="rounded-2xl bg-gray-50 px-4 py-4">
              매물검색
            </a>

            <a href="/map" onClick={() => setOpen(false)} className="rounded-2xl bg-gray-50 px-4 py-4">
              지도검색
            </a>

            <a href="/#reviews" onClick={() => setOpen(false)} className="rounded-2xl bg-gray-50 px-4 py-4">
              사진후기
            </a>

            <a href={`tel:${phone}`} onClick={() => setOpen(false)} className="rounded-2xl bg-yellow-400 px-4 py-4 text-center text-black">
              전화상담
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}