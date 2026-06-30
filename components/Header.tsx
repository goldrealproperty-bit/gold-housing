"use client";

import { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);
  const phone = "010-5858-1942";

  return (
    <header className="sticky top-0 z-50 border-b border-[#E8E1D2] bg-[#F8F6F1]/95 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-xl font-black text-[#1D2942] shadow-sm ring-1 ring-black/5"
        >
          {open ? "×" : "☰"}
        </button>

        <a href="/" className="text-center leading-none">
          <p className="text-[11px] font-black tracking-[0.32em] text-[#D4AF37]">
            GOLD HOUSING
          </p>
          <h1 className="mt-1 text-2xl font-black tracking-[-0.06em] text-[#1D2942]">
            골드하우징
          </h1>
        </a>

        <a
          href={`tel:${phone}`}
          className="rounded-full bg-[#D4AF37] px-5 py-2.5 text-sm font-black text-[#1D2942] shadow-md"
        >
          상담
        </a>
      </div>

      {open && (
        <nav className="border-t border-[#E8E1D2] bg-[#F8F6F1] px-5 py-5 shadow-xl">
          <div className="mx-auto grid max-w-7xl gap-3">
            <a onClick={() => setOpen(false)} href="/" className="rounded-2xl bg-white px-5 py-4 font-black text-[#1D2942] shadow-sm">
              홈
            </a>
            <a onClick={() => setOpen(false)} href="/#properties" className="rounded-2xl bg-white px-5 py-4 font-black text-[#1D2942] shadow-sm">
              실매물 보기
            </a>
            <a onClick={() => setOpen(false)} href="/map" className="rounded-2xl bg-white px-5 py-4 font-black text-[#1D2942] shadow-sm">
              지도 검색
            </a>
            <a onClick={() => setOpen(false)} href="/#reviews" className="rounded-2xl bg-white px-5 py-4 font-black text-[#1D2942] shadow-sm">
              사진후기
            </a>
            <a onClick={() => setOpen(false)} href={`tel:${phone}`} className="rounded-2xl bg-[#D4AF37] px-5 py-4 text-center font-black text-[#1D2942] shadow-lg">
              전화 상담
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}