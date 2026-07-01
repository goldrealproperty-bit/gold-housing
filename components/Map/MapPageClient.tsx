"use client";

import { useMemo, useState } from "react";
import MapView from "./MapView";
import { Property } from "./mapTypes";

type Props = {
  properties: Property[];
  keyword: string;
};

function getImage(image: string | null | undefined) {
  return image && image.trim() !== ""
    ? image
    : "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1200&auto=format&fit=crop";
}

function formatMoney(value: string | null | undefined) {
  if (!value || value.trim() === "") return "문의";

  const num = Number(value.replace(/[^0-9]/g, ""));
  if (!num) return value;

  if (num >= 10000) {
    const eok = Math.floor(num / 10000);
    const man = num % 10000;
    return man > 0 ? `${eok}억 ${man.toLocaleString()}만원` : `${eok}억`;
  }

  return `${num.toLocaleString()}만원`;
}

export default function MapPageClient({ properties, keyword }: Props) {
  const [visibleIds, setVisibleIds] = useState<number[]>([]);

  const visibleProperties = useMemo(() => {
    if (visibleIds.length === 0) return properties;

    const visibleSet = new Set(visibleIds);
    return properties.filter((property) => visibleSet.has(property.id));
  }, [properties, visibleIds]);

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-[#18243B]">
      <div className="absolute inset-0">
        <MapView
          properties={properties}
          loading={false}
          selectedFilter="전체"
          keyword={keyword}
          onVisibleChange={setVisibleIds}
        />
      </div>

      <div className="absolute left-4 top-4 z-30 w-[calc(100%-2rem)] max-w-[520px]">
        <form action="/map" method="get">
          <div className="flex h-16 items-center gap-3 rounded-[1.5rem] bg-white px-4 shadow-2xl">
            <span className="text-2xl">🔍</span>

            <input
              name="keyword"
              defaultValue={keyword}
              placeholder="지역 검색 예) 청라, 송도, 부평"
              className="min-w-0 flex-1 bg-transparent text-base font-black text-slate-950 outline-none placeholder:text-gray-400"
            />

            <button
              type="submit"
              className="shrink-0 rounded-2xl bg-yellow-400 px-5 py-3 text-sm font-black text-black"
            >
              검색
            </button>
          </div>
        </form>

        <a
          href="/"
          className="mt-3 inline-flex rounded-full bg-slate-950/80 px-4 py-2 text-sm font-black text-yellow-400 shadow-xl backdrop-blur"
        >
          ← 홈으로
        </a>
      </div>

      <aside className="absolute bottom-4 right-4 top-4 z-30 hidden w-[430px] rounded-[2rem] bg-white p-4 text-slate-950 shadow-2xl lg:block">
        <div className="mb-4">
          <h2 className="text-2xl font-black tracking-[-0.05em]">인근 매물</h2>
          <p className="mt-1 text-sm font-bold text-gray-500">
            현재 지도에 보이는 매물 {visibleProperties.length}개
          </p>
        </div>

        <div className="h-[calc(100%-64px)] space-y-3 overflow-y-auto pr-1">
          {visibleProperties.map((property) => (
            <a
              key={property.id}
              href={`/properties/${property.id}`}
              className="flex gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-3 transition active:scale-[0.98]"
            >
              <img
                src={getImage(property.image)}
                alt={property.title || "매물"}
                className="h-24 w-24 shrink-0 rounded-xl object-cover"
              />

              <div className="min-w-0 flex-1">
                <h3 className="line-clamp-1 text-lg font-black">
                  {property.title || "매물명 없음"}
                </h3>

                <p className="mt-1 line-clamp-1 text-sm font-bold text-gray-500">
                  📍 {property.location || "지역 확인 중"}
                </p>

                <div className="mt-3 flex items-end justify-between gap-2">
                  <div>
                    <p className="text-[11px] font-black text-gray-400">
                      분양가
                    </p>
                    <p className="whitespace-nowrap text-lg font-black text-blue-700">
                      {formatMoney(property.price)}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[11px] font-black text-gray-400">
                      실입주금
                    </p>
                    <p className="whitespace-nowrap text-base font-black">
                      {formatMoney(property.deposit)}
                    </p>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </aside>
    </main>
  );
}