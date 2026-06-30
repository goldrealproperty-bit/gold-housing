"use client";

import MapView from "./MapView";
import { Property } from "./mapTypes";

type MapProps = {
  properties: Property[];
  loading: boolean;
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
};

const FILTERS = [
  "전체",
  "2룸",
  "3룸",
  "4룸",
  "테라스",
  "복층",
  "무입가능",
  "역세권",
];

export default function Map({
  properties,
  loading,
  selectedFilter,
  onFilterChange,
}: MapProps) {
  return (
    <section
      id="map"
      className="bg-[#06081a] px-5 py-16 text-white"
    >
      <div className="mx-auto max-w-7xl">

        <h2 className="text-4xl font-black tracking-[-0.04em]">
          🗺 지도에서 찾기
        </h2>

        <p className="mt-3 text-gray-400">
          원하는 지역을 지도에서 바로 확인하세요.
        </p>

        <div className="mt-8 flex gap-3 overflow-x-auto pb-2">

          {FILTERS.map((filter) => (

            <button
              key={filter}
              onClick={() => onFilterChange(filter)}
              className={`shrink-0 rounded-full px-6 py-3 font-black transition

              ${
                selectedFilter === filter
                  ? "bg-yellow-400 text-black"
                  : "bg-white/10 text-white"
              }
              
              `}
            >
              {filter}
            </button>

          ))}

        </div>

        <div className="mt-8 overflow-hidden rounded-[2rem]">

          <MapView
            properties={properties}
            loading={loading}
            selectedFilter={selectedFilter}
          />

        </div>

      </div>
    </section>
  );
}