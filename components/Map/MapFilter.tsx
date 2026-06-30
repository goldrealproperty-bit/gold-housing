import { MAP_FILTERS } from "./mapUtils";

type MapFilterProps = {
  selectedFilter: string;
  onChange: (filter: string) => void;
};

export default function MapFilter({
  selectedFilter,
  onChange,
}: MapFilterProps) {
  function handleClick(filter: string) {
    onChange(filter);

    setTimeout(() => {
      document
        .getElementById("property-results")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
  }

  return (
    <div className="mt-8 flex flex-wrap gap-3">
      {MAP_FILTERS.map((filter) => (
        <button
          key={filter}
          type="button"
          onClick={() => handleClick(filter)}
          className={`rounded-full px-5 py-3 text-sm font-black transition ${
            selectedFilter === filter
              ? "bg-yellow-400 text-black"
              : "bg-white/10 text-white hover:bg-white/20"
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}
