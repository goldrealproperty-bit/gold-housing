"use client";

import { Property } from "./adminTypes";

type PropertyListProps = {
  properties: Property[];
  onEdit: (property: Property) => void;
  onDelete: (id: number) => void;
};

export default function PropertyList({
  properties,
  onEdit,
  onDelete,
}: PropertyListProps) {
  return (
    <section className="mt-10 rounded-3xl bg-white p-8 shadow-xl">
      <h2 className="text-2xl font-black">등록된 매물</h2>

      <div className="mt-6 grid gap-4">
        {properties.length === 0 ? (
          <p className="text-gray-500">등록된 매물이 없습니다.</p>
        ) : (
          properties.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-4 rounded-2xl border p-4 md:flex-row md:items-center md:justify-between"
            >
              <div className="flex items-center gap-4">
                <img
                  src={
                    item.image ||
                    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=400&auto=format&fit=crop"
                  }
                  alt={item.title || "매물"}
                  className="h-20 w-28 rounded-xl object-cover"
                />

                <div>
                  <p className="font-black">{item.title || "제목 없음"}</p>

                  <p className="mt-1 text-sm text-gray-500">
                    {item.room_type || "구조 미선택"} /{" "}
                    {item.location || "지역 미입력"} /{" "}
                    {item.price || "가격 문의"}
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    {item.address || "주소 미입력"}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(item)}
                  className="rounded-xl bg-yellow-400 px-5 py-3 font-bold text-black hover:bg-yellow-300"
                >
                  수정
                </button>

                <button
                  onClick={() => onDelete(item.id)}
                  className="rounded-xl bg-red-500 px-5 py-3 font-bold text-white hover:bg-red-600"
                >
                  삭제
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
