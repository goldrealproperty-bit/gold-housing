import { supabase } from "@/lib/supabase";
import MapView from "@/components/Map/MapView";

export const dynamic = "force-dynamic";

export default async function MapPage() {
  const { data } = await supabase
    .from("properties")
    .select("*")
    .order("id", { ascending: false });

  const properties = data || [];

  return (
    <main className="min-h-screen bg-[#18243B] text-white">
      <section className="px-5 py-5">
        <div className="mx-auto max-w-7xl">
          <a
            href="/"
            className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-black text-yellow-400"
          >
            ← 홈으로
          </a>

          <h1 className="mt-5 text-4xl font-black tracking-[-0.06em]">
            지도검색
          </h1>

          <p className="mt-3 text-sm font-bold text-gray-300">
            지도에서 매물 위치를 확인하고 상세페이지로 이동하세요.
          </p>
        </div>
      </section>

      <section className="px-5 pb-6">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-white shadow-2xl">
          <div className="h-[72vh] w-full">
            <MapView
              properties={properties}
              loading={false}
              selectedFilter="전체"
            />
          </div>
        </div>
      </section>
    </main>
  );
}