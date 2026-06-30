type FeatureSelectorProps = {
  features: string[];
  onChange: (features: string[]) => void;
};

const FEATURES = [
  "🏡 테라스",
  "🏠 복층",
  "🔥 인기매물",
  "⭐ 급매",
  "💰 무입가능",
  "🚇 역세권",
  "🏢 엘리베이터",
  "🚗 주차100%",
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
        필요한 특징만 빠르게 선택하세요.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
        {FEATURES.map((feature) => {
          const checked = features.includes(feature);

          return (
            <button
              key={feature}
              type="button"
              onClick={() => toggleFeature(feature)}
              className={`rounded-2xl border px-4 py-4 text-left font-black transition ${
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
  );
}