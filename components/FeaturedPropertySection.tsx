"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import PropertyCard from "./PropertyCard";

type Property = {
  id: number;
  image: string | null;
  title: string | null;
  location: string | null;
  price: string | null;
  deposit: string | null;
  features: string[] | null;
};

export default function FeaturedPropertySection() {
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    async function fetchFeatured() {
      const { data } = await supabase
        .from("properties")
        .select("*")
        .contains("features", ["🏆 대표추천"])
        .order("created_at", { ascending: false })
        .limit(3);

      setProperties(data || []);
    }

    fetchFeatured();
  }, []);

  if (properties.length === 0) return null;

  return (
    <section className="bg-yellow-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-4xl font-black md:text-5xl">
          🏆 대표추천 매물
        </h2>

        <p className="mt-4 mb-12 text-gray-600">
          건축주직분양에서 자신 있게 추천하는 매물입니다.
        </p>

        <div className="grid gap-8 md:grid-cols-3">
          {properties.map((item) => (
            <PropertyCard
              key={item.id}
              id={String(item.id)}
              image={item.image || ""}
              title={item.title || "제목 없음"}
              location={item.location || "지역 미입력"}
              price={item.price || "가격 문의"}
              deposit={item.deposit || "문의"}
              features={item.features || []}
            />
          ))}
        </div>
      </div>
    </section>
  );
}