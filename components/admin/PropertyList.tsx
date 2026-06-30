"use client";

import { useMemo, useState } from "react";
import { Property } from "./adminTypes";

type PropertyListProps = {
  properties: Property[];
  onEdit: (property: Property) => void;
  onDelete: (id: number) => void;
};

function formatDisplayMoney(value: string | null) {
  if (!value) return "가격 문의";

  const number = Number(value.replace(/[^\d]/g, ""));
  if (!number) return value;

  const eok = Math.floor(number / 10000);
  const man = number % 10000;

  if (eok > 0 && man > 0) return `${eok}억 ${man.toLocaleString()}만원`;
  if (eok > 0) return `${eok}억`;
  return `${man.toLocaleString()}만원`;
}

export default function PropertyList({
  properties,
  onEdit,
  onDelete,
}: PropertyListProps) {
  const [keyword, setKeyword] = useState("");
  const [visibleCount, setVisibleCount] = useState(30);

  const filteredProperties = useMemo(() => {
    const q = keyword.trim().toLowerCase();

    if (!q) return properties;

    return properties.filter((item) => {
      const location = item.location?.toLowerCase() || "";
      const address = item.address?.toLowerCase() || "";

      return location.includes(q) || address.includes(q);
    });
  }, [properties, keyword]);

  const visibleProperties = filteredProperties.slice(0, visibleCount);

  return (
    <section className="mt-10 rounded-3xl bg-white p-6 shadow-xl md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-black">등록된 매물 관리</h2>
          <p className="mt-1 text-sm text-gray-500">
            지역 또는 주소로 빠르게 검색할 수 있습니다.
          </p>
        </div>

        <div className="rounded-2xl bg-gray-100 px-5 py-3 font-black">
          전체 {properties.length.toLocaleString()}개
        </div>
      </div>

      <div className="mt-6">
        <input
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
            setVisibleCount(30);
          }}
          className="w-full rounded-2xl border p-4 text-lg font-bold outline-none focus:border-yellow-400"
          placeholder="지역 / 주소 검색 예: 부평, 청천동, 계양구"
        />

        {keyword && (
          <p className="mt-3 text-sm font-bold text-gray-500">
            검색 결과 {filteredProperties.length.toLocaleString()}개
          </p>
        )}
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border">
        <table className="w-full min-w-[900px] border-collapse text-left">
          <thead className="bg-gray-50">
            <tr className="text-sm text-gray-500">
              <th className="px-4 py-4">사진</th>
              <th className="px-4 py-4">매물명</th>
              <th className="px-4 py-4">지역</th>
              <th className="px-4 py-4">주소</th>
              <th className="px-4 py-4">분양가</th>
              <th className="px-4 py-4">구조</th>
              <th className="px-4 py-4">특징</th>
              <th className="px-4 py-4 text-center">관리</th>
            </tr>
          </thead>

          <tbody>
            {visibleProperties.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-gray-500">
                  등록된 매물이 없습니다.
                </td>
              </tr>
            ) : (
              visibleProperties.map((item) => (
                <tr key={item.id} className="border-t align-middle">
                  <td className="px-4 py-4">
                    <img
                      src={
                        item.image ||
                        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=400&auto=format&fit=crop"
                      }
                      alt={item.title || "매물"}
                      className="h-16 w-24 rounded-xl object-cover"
                    />
                  </td>

                  <td className="px-4 py-4">
                    <p className="max-w-[180px] truncate font-black">
                      {item.title || "제목 없음"}
                    </p>
                  </td>

                  <td className="px-4 py-4 font-bold text-gray-700">
                    {item.location || "-"}
                  </td>

                  <td className="px-4 py-4 text-sm text-gray-500">
                    <p className="max-w-[240px] truncate">
                      {item.address || "-"}
                    </p>
                  </td>

                  <td className="px-4 py-4 font-black">
                    {formatDisplayMoney(item.price)}
                  </td>

                  <td className="px-4 py-4">
                    <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-black text-yellow-700">
                      {item.room_type || "미선택"}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex max-w-[240px] flex-wrap gap-1">
                      {(item.features || []).slice(0, 3).map((feature) => (
                        <span
                          key={feature}
                          className="rounded-full bg-gray-100 px-2 py-1 text-xs font-bold text-gray-600"
                        >
                          {feature}
                        </span>
                      ))}

                      {(item.features || []).length > 3 && (
                        <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-bold text-gray-600">
                          +{(item.features || []).length - 3}
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => onEdit(item)}
                        className="rounded-xl bg-yellow-400 px-4 py-2 font-black text-black hover:bg-yellow-300"
                      >
                        수정
                      </button>

                      <button
                        onClick={() => onDelete(item.id)}
                        className="rounded-xl bg-red-500 px-4 py-2 font-black text-white hover:bg-red-600"
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {filteredProperties.length > visibleCount && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setVisibleCount((prev) => prev + 30)}
            className="rounded-2xl bg-slate-950 px-8 py-4 font-black text-white"
          >
            더 보기
          </button>
        </div>
      )}
    </section>
  );
}