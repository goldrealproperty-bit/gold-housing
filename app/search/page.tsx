import { supabase } from "@/lib/supabase";
import SearchMap from "../../components/v2/search/SearchMap";

export const dynamic = "force-dynamic";

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

type SearchPageProps = {
  searchParams: Promise<{
    keyword?: string;
  }>;
};

function normalize(value: string) {
  return value.replace(/\s/g, "").toLowerCase();
}

function getImage(image: string | null) {
  return image && image.trim() !== ""
    ? image
    : "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1200&auto=format&fit=crop";
}

function getBadge(property: Property) {
  const features = property.features || [];

  if (features.some((item) => item.includes("무입"))) return "무입가능";
  if (features.some((item) => item.includes("역세권"))) return "역세권";
  if (features.some((item) => item.includes("테라스"))) return "테라스";
  if (features.some((item) => item.includes("복층"))) return "복층";

  return property.room_type || "신축빌라";
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const keyword = params.keyword || "";
  const q = normalize(keyword);

  const { data } = await supabase
    .from("properties")
    .select("*")
    .order("id", { ascending: false });

  const properties: Property[] = data || [];

  const filtered = properties.filter((item) => {
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

    return q === "" || text.includes(q);
  });

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      <section className="bg-slate-950 px-5 pb-12 pt-6 text-white">
        <div className="mx-auto max-w-7xl">
          <a
            href="/"
            className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-black text-yellow-400"
          >
            ← 홈으로
          </a>

          <p className="mt-8 text-sm font-black text-yellow-400">SEARCH</p>

          <h1 className="mt-2 text-4xl font-black tracking-[-0.06em]">
            검색결과
          </h1>

          <p className="mt-4 text-base font-bold text-gray-300">
            “{keyword || "전체"}” 매물 {filtered.length}개
          </p>

          <form action="/search" method="get" className="mt-7">
            <div className="flex h-20 items-center gap-3 rounded-[2rem] bg-white px-5 shadow-xl">
              <span className="text-3xl">🔍</span>

              <input
                name="keyword"
                defaultValue={keyword}
                placeholder="지역 · 동 · 특징 검색"
                enterKeyHint="search"
                inputMode="search"
                className="min-w-0 flex-1 bg-transparent text-xl font-black text-slate-950 outline-none placeholder:text-gray-400"
              />

              <button
                type="submit"
                className="shrink-0 rounded-[1.5rem] bg-yellow-400 px-6 py-4 text-base font-black text-black"
              >
                검색
              </button>
            </div>
          </form>

          <p className="mt-5 text-sm font-bold text-gray-400">
            지역, 동, 특징으로 다시 검색해보세요.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-12 pt-10">
        {filtered.length === 0 ? (
          <div className="rounded-[2rem] bg-white p-10 text-center shadow-sm">
            <p className="text-3xl font-black tracking-[-0.05em]">
              👀 검색결과가 없습니다.
            </p>

            <p className="mt-3 text-sm font-bold leading-6 text-gray-500">
              예) 잠실, 송파, 학교, 복층, 테라스
            </p>

            <a
              href="/#properties"
              className="mt-6 inline-block rounded-2xl bg-yellow-400 px-6 py-4 font-black text-black"
            >
              홈에서 다시 찾기
            </a>
          </div>
        ) : (
          <>
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-4xl font-black tracking-[-0.06em]">
                  지도 검색
                </h2>
                <p className="mt-3 text-sm font-bold text-gray-500">
                  지도에서 위치를 보고, 마음에 드는 매물을 확인하세요.
                </p>
              </div>

              <p className="shrink-0 rounded-full bg-white px-6 py-4 text-lg font-black text-gray-700 shadow-md">
                {filtered.length}개
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-[520px_1fr]">
              <SearchMap properties={filtered} />

              <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
                {filtered.map((property) => (
                  <a
                    key={property.id}
                    href={`/properties/${property.id}`}
                    className="block overflow-hidden rounded-[2rem] bg-white shadow-xl ring-1 ring-gray-100 active:scale-[0.98]"
                  >
                    <div className="relative h-64 bg-gray-100">
                      <img
                        src={getImage(property.image)}
                        alt={property.title || "매물"}
                        className="h-full w-full object-cover"
                      />

                      <div className="absolute left-4 top-4 rounded-full bg-yellow-400 px-5 py-3 text-sm font-black text-black shadow-lg">
                        {getBadge(property)}
                      </div>
                    </div>

                    <div className="p-6">
                      <h2 className="line-clamp-1 text-3xl font-black tracking-[-0.05em]">
                        {property.title || "매물명 없음"}
                      </h2>

                      <p className="mt-3 line-clamp-1 text-base font-bold text-gray-500">
                        📍{" "}
                        {property.location ||
                          property.address ||
                          "지역 확인 중"}
                      </p>

                      <div className="my-5 h-px bg-gray-100" />

                      <div className="flex items-end justify-between gap-3">
                        <div>
                          <p className="text-xs font-black text-gray-400">
                            분양가
                          </p>
                          <p className="mt-1 text-3xl font-black tracking-[-0.05em] text-blue-700">
                            {property.price || "문의"}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-xs font-black text-gray-400">
                            실입주금
                          </p>
                          <p className="mt-1 text-2xl font-black tracking-[-0.04em]">
                            {property.deposit || "문의"}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 rounded-2xl bg-yellow-400 py-4 text-center text-base font-black text-black">
                        상세보기 →
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div className="mt-10 rounded-[2rem] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-yellow-100 text-2xl">
                  📍
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-black text-slate-950">
                    찾는 매물이 없으신가요?
                  </p>
                  <p className="mt-1 text-sm font-bold text-gray-500">
                    다른 지역이나 조건으로 검색해보세요.
                  </p>
                </div>

                <a
                  href="/#properties"
                  className="shrink-0 rounded-2xl bg-gray-50 px-4 py-3 text-sm font-black text-slate-950"
                >
                  다시 검색
                </a>
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
}