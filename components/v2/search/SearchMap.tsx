"use client";

type Property = {
  id: number;
  title: string | null;
  address: string | null;
  location: string | null;
  price: string | null;
};

export default function SearchMap({ properties }: { properties: Property[] }) {
  return (
    <div className="sticky top-5 overflow-hidden rounded-[2rem] bg-white shadow-xl">
      <div className="flex h-[720px] items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-2xl font-black">🗺️ 카카오 지도</p>
          <p className="mt-3 text-gray-500">
            현재 {properties.length}개의 매물이 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
}