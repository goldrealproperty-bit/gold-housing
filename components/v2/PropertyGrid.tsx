"use client";

import { useMemo, useState } from "react";

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

type Props = {
  properties: Property[];
};

function normalize(value: string) {
  return value.replace(/\s/g, "").toLowerCase();
}

function getImage(image: string | null) {
  return image && image.trim() !== ""
    ? image
    : "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1200&auto=format&fit=crop";
}
function getBadge(property: Property) {
  const features = property.features || [];

  if (features.some((item) => item.includes("무입"))) return "무입가능";
  if (features.some((item) => item.includes("역세권"))) return "역세권";
  if (features.some((item) => item.includes("테라스"))) return "테라스";
  if (features.some((item) => item.includes("복층"))) return "복층";

  return property.room_type || "신축빌라";
}
function PropertyCard({ property }: { property: Property }) {
    const visibleFeatures = (property.features || []).slice(0, 3);
  return (
    <a
      href={`/properties/${property.id}`}
      className="block overflow-hidden rounded-[2rem] bg-white shadow-lg ring-1 ring-gray-100 active:scale-[0.98]"
    >
      <div className="h-56 bg-gray-100">
        <img
          src={getImage(property.image)}
          alt={property.title || "매물"}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="p-5">
        <h3 className="line-clamp-1 text-2xl font-black tracking-[-0.04em] text-slate-950">
          {property.title || "매물명 없음"}
        </h3>

        <p className="mt-2 line-clamp-1 text-sm font-bold text-gray-500">
          📍 {property.location || property.address || "지역 확인 중"}
        </p>

        <div className="mt-5 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-black text-gray-400">분양가</p>
            <p className="mt-1 text-2xl font-black text-blue-700">
              {property.price || "문의"}
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs font-black text-gray-400">실입주금</p>
            <p className="mt-1 text-lg font-black text-slate-950">
              {property.deposit || "문의"}
            </p>
          </div>
        </div>
      </div>
    </a>
  );
}

export default function PropertyGrid({ properties }: Props) {
  const [keyword, setKeyword] = useState("");

  const filteredProperties = useMemo(() => {
    const q = normalize(keyword);

    return properties.filter((item) => {
      const text = normalize(
        [
          item.title || "",
          item.location || "",
          item.address || "",
          item.price || "",
          item.deposit || "",
          item.room_type || "",
          ...(item.features || []),
        ].join(" ")
      );

      return q === "" || text.includes(q);
    });
  }, [properties, keyword]);

  return (
    <section id="properties" className="bg-white px-5 py-10">
      <div className="mx-auto max-w-7xl">
        <form action="/search" method="get">
          <div className="flex h-14 items-center rounded-[1.5rem] bg-gray-50 px-4 ring-1 ring-gray-200">
            <span className="mr-3 text-xl">🔍</span>

            <input
              name="keyword"
              value={keyword}
              onInput={(e) => setKeyword(e.currentTarget.value)}
              onChange={(e) => setKeyword(e.target.value)}
              onCompositionEnd={(e) => setKeyword(e.currentTarget.value)}
              placeholder="지역 · 동 · 특징 검색"
              enterKeyHint="search"
              inputMode="search"
              className="min-w-0 flex-1 bg-transparent text-base font-black outline-none placeholder:text-gray-400"
            />

            {keyword && (
              <button
                type="button"
                onClick={() => setKeyword("")}
                className="rounded-full bg-white px-3 py-2 text-sm font-black text-gray-600 shadow-sm"
              >
                ✕
              </button>
            )}
          </div>
        </form>

        {filteredProperties.length === 0 ? (
          <div className="mt-10 rounded-[2rem] bg-gray-50 p-10 text-center">
            <p className="font-black text-gray-500">
              조건에 맞는 매물이 없습니다.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredProperties.map((item) => (
              <PropertyCard key={item.id} property={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}