type FeatureSelectorProps = {
  features: string[];
  onChange: (features: string[]) => void;
};

const FEATURE_GROUPS = [
  {
    title: "✨ 특화",
    items: ["🏡 테라스", "🏠 복층"],
  },
  {
    title: "🏆 추천",
    items: ["🏆 대표추천", "🔥 인기매물", "⭐ 급매"],
  },
  {
    title: "💰 혜택",
    items: ["💰 무입가능"],
  },
  {
    title: "🚉 생활",
    items: ["🚇 역세권", "🏢 엘리베이터", "🚗 주차100%"],
  },
];

export default function FeatureSelector({
  features,
  onChange,
}: FeatureSelectorProps) {
  function toggleFeature(feature: string) {
    if (features.includes(feature)) {
      onChange(features.filter((item) => item !== feature));
    } else {
      onChange([...features, feature]);
    }
  }

  return (
    <div className="mt-8 rounded-3xl bg-gray-50 p-6">
      <h3 className="text-2xl font-black">매물 특징 선택</h3>
      <p className="mt-2 text-sm text-gray-500">
        체크한 항목은 지도, 카드, 상세페이지에 자동으로 표시됩니다.
      </p>

      <div className="mt-6 grid gap-6">
        {FEATURE_GROUPS.map((group) => (
          <div key={group.title} className="rounded-2xl bg-white p-5 shadow-sm">
            <h4 className="text-lg font-black">{group.title}</h4>

            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {group.items.map((feature) => {
                const checked = features.includes(feature);

                return (
                  <button
                    key={feature}
                    type="button"
                    onClick={() => toggleFeature(feature)}
                    className={`rounded-xl border px-4 py-4 text-left font-black transition ${
                      checked
                        ? "border-yellow-400 bg-yellow-400 text-black shadow-md"
                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {checked ? "✅ " : ""}
                    {feature}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}