"use client";

import { useState } from "react";
import MapView from "@/components/Map/MapView";

type Property = {
  id: number;
  image: string | null;
  title: string | null;
  location: string | null;
  address: string | null;
  price: string | null;
  deposit: string | null;
  features: string[] | null;
  room_type: string | null;
};

export default function MapSection({ properties }: { properties: Property[] }) {
  const [open, setOpen] = useState(false);

  return (
    <section id="map" className="bg-[#182033] px-5 py-14 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[2rem] bg-white/5 p-6 shadow-2xl">
          <p className="text-sm font-black text-yellow-400">MAP SEARCH</p>

          <h2 className="mt-2 text-4xl font-black tracking-[-0.06em]">
            지도검색
          </h2>

          <p className="mt-4 text-sm font-bold leading-6 text-gray-300">
            지역별 매물 위치를 지도에서 확인하고,
            <br />
            원하는 매물을 바로 상세보기로 이동할 수 있습니다.
          </p>

          <div className="mt-7 grid grid-cols-2 gap-3">
            <div className="rounded-[1.5rem] bg-white/10 p-4">
              <p className="text-xs font-black text-gray-400">등록 매물</p>
              <p className="mt-1 text-2xl font-black text-yellow-400">
                {properties.length}개
              </p>
            </div>

            <div className="rounded-[1.5rem] bg-white/10 p-4">
              <p className="text-xs font-black text-gray-400">지도 보기</p>
              <p className="mt-1 text-2xl font-black">가능</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="mt-7 w-full rounded-3xl bg-yellow-400 py-5 text-lg font-black text-black shadow-lg"
          >
            {open ? "지도 접기 ↑" : "지도검색 열기 →"}
          </button>

          {open && (
            <div className="mt-6 overflow-hidden rounded-[2rem] bg-gray-200 shadow-2xl">
              <MapView
                key="mobile-map"
                properties={properties}
                loading={false}
                selectedFilter="전체"
              />
            </div>
          )}

          {!open && (
            <div className="mt-6 rounded-[2rem] bg-white/10 p-5">
              <p className="text-sm font-bold leading-6 text-gray-300">
                지도검색을 누르면 매물 위치가 지도에 표시됩니다.
                <br />
                정확한 주소는 매물 보호를 위해 상담 시 안내드립니다.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}