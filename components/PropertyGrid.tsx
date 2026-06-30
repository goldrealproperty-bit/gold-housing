import PropertyCard from "./PropertyCard";
import { properties } from "@/data/properties";

export default function PropertyGrid() {
  return (
    <section id="properties" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-4xl font-black md:text-5xl">
          🔥 오늘의 추천 매물
        </h2>

        <p className="mt-4 mb-12 text-gray-500">
          실시간 인기 분양 현장입니다.
        </p>

        <div className="grid gap-8 md:grid-cols-3">
          {properties.map((item) => (
            <PropertyCard key={item.id} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}