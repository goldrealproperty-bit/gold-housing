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

function getImage(image: string | null) {
  return image && image.trim() !== ""
    ? image
    : "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1200&auto=format&fit=crop";
}

export default function RecommendedCarousel({
  properties,
}: {
  properties: Property[];
}) {
  const recommended = properties.slice(0, 6);

  if (recommended.length === 0) return null;

  return (
    <section className="bg-white px-5 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm font-black text-yellow-500">RECOMMEND</p>
            <h2 className="mt-1 text-4xl font-black tracking-[-0.05em]">
              추천 매물
            </h2>
          </div>

          <a
            href="#properties"
            className="rounded-full bg-gray-100 px-4 py-2 text-sm font-black text-gray-700"
          >
            전체보기
          </a>
        </div>

        <div className="mt-7 flex gap-4 overflow-x-auto pb-3">
          {recommended.map((item) => (
            <a
              key={item.id}
              href={`/properties/${item.id}`}
              className="w-[84%] shrink-0 overflow-hidden rounded-[2rem] bg-white shadow-xl ring-1 ring-gray-100 sm:w-[360px]"
            >
              <div className="relative h-60 bg-gray-100">
                <img
                  src={getImage(item.image)}
                  alt={item.title || "추천 매물"}
                  className="h-full w-full object-cover"
                />

                <div className="absolute left-4 top-4 rounded-full bg-yellow-400 px-4 py-2 text-sm font-black text-black">
                  추천
                </div>
              </div>

              <div className="p-5">
                <h3 className="line-clamp-2 text-2xl font-black tracking-[-0.04em] text-slate-950">
                  {item.title || "신축빌라"}
                </h3>

                <p className="mt-2 line-clamp-1 text-sm font-bold text-gray-500">
                  📍 {item.location || item.address || "지역 확인 중"}
                </p>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-gray-50 p-4">
                    <p className="text-xs font-black text-gray-500">분양가</p>
                    <p className="mt-1 text-lg font-black text-blue-700">
                      {item.price || "문의"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-gray-50 p-4">
                    <p className="text-xs font-black text-gray-500">
                      실입주금
                    </p>
                    <p className="mt-1 text-lg font-black text-slate-950">
                      {item.deposit || "문의"}
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl bg-yellow-400 py-4 text-center font-black text-black">
                  자세히 보기 →
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}