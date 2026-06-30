"use client";

import { useMemo, useState } from "react";
import PropertyCard from "./PropertyCard";

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

type PropertyGridDBProps = {
  properties: Property[];
  loading: boolean;
  selectedFilter: string;
};

function normalize(value: string) {
  return value.replace(/\s/g, "").toLowerCase();
}

function matchFilter(property: Property, filter: string) {
  const features = property.features || [];
  const roomType = property.room_type || "";

  if (filter === "전체") return true;
  if (filter === "2룸") return roomType.includes("2");
  if (filter === "3룸") return roomType.includes("3");
  if (filter === "4룸") return roomType.includes("4");
  if (filter === "테라스") return features.some((item) => item.includes("테라스"));
  if (filter === "복층") return features.some((item) => item.includes("복층"));
  if (filter === "무입가능") return features.some((item) => item.includes("무입"));
  if (filter === "역세권") return features.some((item) => item.includes("역세권"));

  return true;
}

export default function PropertyGridDB({
  properties,
  loading,
  selectedFilter,
}: PropertyGridDBProps) {
  const [search, setSearch] = useState("");

  const filteredProperties = useMemo(() => {
    const keyword = normalize(search);

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

      return (keyword === "" || text.includes(keyword)) && matchFilter(item, selectedFilter);
    });
  }, [properties, search, selectedFilter]);

  if (loading) {
    return (
      <section id="properties" className="px-5 py-10">
        <p className="font-bold text-gray-500">매물을 불러오는 중입니다...</p>
      </section>
    );
  }

  return (
    <section id="properties" className="bg-white px-5 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="sticky top-[86px] z-20 bg-white pb-4">
          <h2 className="text-4xl font-black tracking-[-0.05em]">매물검색</h2>

          <div className="mt-5 flex h-16 items-center rounded-[1.5rem] border-2 border-slate-950 bg-white px-4 shadow-sm">
            <span className="mr-3 text-2xl">🔍</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="지역 · 동 · 특징 검색"
              className="min-w-0 flex-1 text-lg font-black outline-none placeholder:text-gray-400"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="rounded-full bg-gray-100 px-3 py-2 text-sm font-black text-gray-600"
              >
                지우기
              </button>
            )}
          </div>
        </div>

        <div className="mt-6 flex items-end justify-between">
          <div>
            <h3 className="text-3xl font-black tracking-[-0.05em]">
              조건에 맞는 매물
            </h3>
            <p className="mt-2 text-sm font-bold text-gray-500">
              검색어를 입력하면 바로 표시됩니다.
            </p>
          </div>

          <p className="rounded-full bg-gray-100 px-5 py-4 text-lg font-black text-gray-700">
            {filteredProperties.length}개
          </p>
        </div>

        {filteredProperties.length === 0 ? (
          <div className="mt-8 rounded-[2rem] bg-gray-50 p-10 text-center">
            <p className="font-black text-gray-500">
              조건에 맞는 매물이 없습니다.
            </p>
          </div>
        ) : (
          <div className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredProperties.map((item) => (
              <PropertyCard
                key={item.id}
                id={String(item.id)}
                image={item.image || ""}
                title={item.title || "제목 없음"}
                location={item.location || item.address || "지역 미입력"}
                price={item.price || "가격 문의"}
                deposit={item.deposit || "문의"}
                features={item.features || []}
                room_type={item.room_type}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}