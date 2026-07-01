import { supabase } from "@/lib/supabase";
import MapView from "@/components/Map/MapView";
import { Property } from "@/components/Map/mapTypes";

export const dynamic = "force-dynamic";



type MapPageProps = {
  searchParams: Promise<{
    keyword?: string;
  }>;
};

function getImage(image: string | null) {
  return image && image.trim() !== ""
    ? image
    : "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1200&auto=format&fit=crop";
}

export default async function MapPage({ searchParams }: MapPageProps) {
  const params = await searchParams;
  const keyword = params.keyword || "";

  const { data } = await supabase
    .from("properties")
    .select("*")
    .order("id", { ascending: false });

  const properties: Property[] = data || [];

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

          <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_520px] lg:items-end">
            <div>
              <h1 className="text-4xl font-black tracking-[-0.06em]">
                지도검색
              </h1>
              <p className="mt-3 text-sm font-bold text-gray-300">
                지도에서 인근 매물을 확인하고 상세페이지로 이동하세요.
              </p>
            </div>

            <form action="/map" method="get">
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
        </div>
      </section>

      <section className="px-5 pb-6">
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[1fr_380px]">
          <div className="overflow-hidden rounded-[2rem] bg-white shadow-2xl">
            <div className="h-[62vh] min-h-[430px] w-full md:h-[76vh]">
              <MapView
                properties={properties}
                loading={false}
                selectedFilter="전체"
                keyword={keyword}
              />
            </div>
          </div>

          <aside className="rounded-[2rem] bg-white p-4 text-slate-950 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black tracking-[-0.05em]">
                  인근 매물
                </h2>
                <p className="mt-1 text-sm font-bold text-gray-500">
                  총 {properties.length}개 매물
                </p>
              </div>
            </div>

            <div className="max-h-[76vh] space-y-3 overflow-y-auto pr-1">
              {properties.map((property) => (
                <a
                  key={property.id}
                  href={`/properties/${property.id}`}
                  className="flex gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-3 transition active:scale-[0.98]"
                >
                  <img
                    src={getImage(property.image)}
                    alt={property.title || "매물"}
                    className="h-24 w-24 shrink-0 rounded-xl object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <h3 className="line-clamp-1 text-lg font-black">
                      {property.title || "매물명 없음"}
                    </h3>

                    <p className="mt-1 line-clamp-1 text-sm font-bold text-gray-500">
                      📍 {property.location || "지역 확인 중"}
                    </p>

                    <div className="mt-3 flex items-end justify-between gap-2">
                      <div>
                        <p className="text-[11px] font-black text-gray-400">
                          분양가
                        </p>
                        <p className="text-lg font-black text-blue-700">
                          {property.price || "문의"}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-[11px] font-black text-gray-400">
                          실입주금
                        </p>
                        <p className="text-base font-black">
                          {property.deposit || "문의"}
                        </p>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}