type PropertyCardProps = {
  id: string;
  image?: string | null;
  title: string;
  location: string;
  price: string;
  deposit: string;
  features?: string[] | null;
  room_type?: string | null;
};

function getMainBadge(roomType?: string | null, features?: string[] | null) {
  const list = features || [];

  if (list.some((item) => item.includes("테라스"))) return "테라스";
  if (list.some((item) => item.includes("복층"))) return "복층";
  if (roomType?.includes("2")) return "2룸";
  if (roomType?.includes("4")) return "4룸";
  return roomType || "3룸";
}

export default function PropertyCard({
  id,
  image,
  title,
  location,
  price,
  deposit,
  features = [],
  room_type,
}: PropertyCardProps) {
  const imageUrl =
    image && image.trim() !== ""
      ? image
      : "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1200&auto=format&fit=crop";

  const visibleFeatures = (features || []).filter(
    (feature) =>
      !feature.includes("대표추천") &&
      !feature.includes("인기매물") &&
      !feature.includes("급매")
  );

  return (
    <a
      href={`/properties/${id}`}
      className="block overflow-hidden rounded-[2rem] bg-white shadow-xl ring-1 ring-gray-100 transition active:scale-[0.98] md:hover:-translate-y-1 md:hover:shadow-2xl"
    >
      <div className="relative h-56 overflow-hidden bg-gray-100">
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover"
        />

        <div className="absolute left-4 top-4 rounded-full bg-yellow-400 px-4 py-2 text-sm font-black text-black shadow-lg">
          {getMainBadge(room_type, features)}
        </div>

        {visibleFeatures.some((item) => item.includes("무입")) && (
          <div className="absolute right-4 top-4 rounded-full bg-emerald-500 px-4 py-2 text-sm font-black text-white shadow-lg">
            무입가능
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="line-clamp-2 text-2xl font-black tracking-[-0.04em] text-slate-950">
          {title}
        </h3>

        <p className="mt-2 line-clamp-1 text-base font-bold text-gray-500">
          📍 {location}
        </p>

        <div className="mt-5 rounded-[1.5rem] bg-gray-50 p-5">
          <p className="text-sm font-black text-gray-500">분양가</p>
          <p className="mt-1 text-3xl font-black tracking-[-0.04em] text-blue-700">
            {price}
          </p>

          <p className="mt-4 text-sm font-black text-gray-500">실입주금</p>
          <p className="mt-1 text-xl font-black text-slate-950">
            {deposit}
          </p>
        </div>

        {visibleFeatures.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {visibleFeatures.slice(0, 4).map((feature) => (
              <span
                key={feature}
                className="rounded-full bg-gray-100 px-3 py-2 text-sm font-black text-gray-700"
              >
                {feature}
              </span>
            ))}
          </div>
        )}

        <div className="mt-5 rounded-2xl bg-yellow-400 py-4 text-center text-base font-black text-black">
          상세보기 →
        </div>
      </div>
    </a>
  );
}