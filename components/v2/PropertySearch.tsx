"use client";

type PropertySearchProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function PropertySearch({
  value,
  onChange,
}: PropertySearchProps) {
  return (
    <section
      id="properties"
      className="sticky top-16 z-30 bg-white px-5 py-5 shadow-sm"
    >
      <div className="mx-auto max-w-7xl">

        <h2 className="text-4xl font-black tracking-[-0.05em]">
          매물검색
        </h2>

        <p className="mt-2 text-gray-500">
          원하는 지역이나 조건을 입력하세요.
        </p>

        <div className="mt-5 flex h-16 items-center rounded-[24px] border-2 border-slate-900 bg-white px-5">

          <div className="mr-4 text-2xl">
            🔍
          </div>

          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="지역 · 역 · 동 · 특징 검색"
            className="flex-1 bg-transparent text-lg font-bold outline-none placeholder:text-gray-400"
          />

          {value !== "" && (
            <button
              onClick={() => onChange("")}
              className="rounded-full bg-gray-100 px-4 py-2 text-sm font-black"
            >
              ✕
            </button>
          )}

        </div>

      </div>
    </section>
  );
}