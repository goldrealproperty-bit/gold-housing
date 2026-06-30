"use client";

import { useState } from "react";

export default function Search() {
  const [keyword, setKeyword] = useState("");

  return (
    <section className="-mt-16 relative z-30 px-5 pb-14">
      <div className="mx-auto max-w-5xl">

        <div className="rounded-[2rem] bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.12)]">

          <p className="text-sm font-black tracking-[0.2em] text-[#D4AF37]">
            PROPERTY SEARCH
          </p>

          <h2 className="mt-2 text-4xl font-black tracking-[-0.06em] text-[#1D2942]">
            원하는 매물을 찾아보세요
          </h2>

          <p className="mt-2 text-sm font-bold text-gray-500">
            지역 · 동 · 특징으로 빠르게 검색할 수 있습니다.
          </p>

          <form
            action="/search"
            className="mt-7"
          >
            <div className="flex h-20 overflow-hidden rounded-3xl border border-gray-200">

              <div className="flex items-center px-6 text-3xl">
                🔍
              </div>

              <input
                name="keyword"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="예) 청라 · 간석동 · 복층 · 테라스"
                className="flex-1 bg-transparent text-lg font-black outline-none placeholder:text-gray-400"
              />

              <button
                className="bg-[#D4AF37] px-10 font-black text-[#1D2942] transition hover:brightness-105"
              >
                검색
              </button>

            </div>
          </form>

          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">

            {[
              "청라",
              "송도",
              "간석동",
              "복층"
            ].map((item) => (
              <a
                key={item}
                href={`/search?keyword=${item}`}
                className="rounded-2xl bg-[#F8F6F1] py-3 text-center font-black text-[#1D2942] transition hover:bg-[#EFE8D6]"
              >
                #{item}
              </a>
            ))}

          </div>

        </div>

      </div>
    </section>
  );
}