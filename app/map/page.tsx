import { supabase } from "@/lib/supabase";
import MapView from "@/components/Map/MapView";

export const dynamic = "force-dynamic";

type MapPageProps = {
  searchParams: Promise<{
    keyword?: string;
  }>;
};

export default async function MapPage({ searchParams }: MapPageProps) {
  const params = await searchParams;
  const keyword = params.keyword || "";

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

          <form action="/map" method="get" className="mt-5">
            <div className="flex h-16 items-center gap-3 rounded-[1.5rem] bg-white px-4 shadow-xl">
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
        </div>
      </section>

      <section className="px-5 pb-6">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-white shadow-2xl">
          <div className="h-[70vh] min-h-[520px] w-full md:h-[76vh]">
            <MapView
              properties={properties}
              loading={false}
              selectedFilter="전체"
              keyword={keyword}
            />
          </div>
        </div>
      </section>
    </main>
  );
}