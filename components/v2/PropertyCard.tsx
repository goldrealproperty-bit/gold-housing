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

function getBadge(property: Property) {
  const features = property.features || [];

  if (features.some((item) => item.includes("무입"))) return "무입가능";
  if (features.some((item) => item.includes("역세권"))) return "역세권";
  if (features.some((item) => item.includes("테라스"))) return "테라스";
  if (features.some((item) => item.includes("복층"))) return "복층";

  return property.room_type || "신축빌라";
}

export default function PropertyCard({ property }: { property: Property }) {
  const visibleFeatures = (property.features || []).slice(0, 3);

  return (
    <a
      href={`/properties/${property.id}`}
      className="block overflow-hidden rounded-[2rem] bg-white shadow-lg ring-1 ring-gray-100 transition active:scale-[0.98] md:hover:-translate-y-1 md:hover:shadow-2xl"
    >
      <div className="relative h-52 bg-gray-100">
        <img
          src={getImage(property.image)}
          alt={property.title || "매물"}
          className="h-full w-full object-cover"
        />

        <div className="absolute left-4 top-4 rounded-full bg-yellow-400 px-4 py-2 text-sm font-black text-black shadow-lg">
          {getBadge(property)}
        </div>
      </div>

      <div className="p-5">
        <h3 className="line-clamp-1 text-2xl font-black tracking-[-0.04em] text-slate-950">
          {property.title || "매물명 없음"}
        </h3>

        <p className="mt-2 line-clamp-1 text-sm font-bold text-gray-500">
          📍 {property.location || property.address || "지역 확인 중"}
        </p>

        <div className="mt-5 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-black text-gray-400">분양가</p>
            <p className="mt-1 text-2xl font-black tracking-[-0.04em] text-blue-700">
              {property.price || "문의"}
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs font-black text-gray-400">실입주금</p>
            <p className="mt-1 text-lg font-black text-slate-950">
              {property.deposit || "문의"}
            </p>
          </div>
        </div>

        {visibleFeatures.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {visibleFeatures.map((feature) => (
              <span
                key={feature}
                className="rounded-full bg-gray-100 px-3 py-2 text-xs font-black text-gray-700"
              >
                {feature}
              </span>
            ))}
          </div>
        )}
      </div>
    </a>
  );
}