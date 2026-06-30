export default function TrustSection() {
  const items = [
    {
      title: "실매물만 안내",
      desc: "허위매물 없이 실제 분양 가능한 매물만 안내합니다.",
      icon: "✔",
    },
    {
      title: "중개수수료 ZERO",
      desc: "건축주 직영으로 중개수수료 부담이 없습니다.",
      icon: "💰",
    },
    {
      title: "맞춤 추천",
      desc: "예산과 지역에 맞춰 가장 적합한 매물을 추천드립니다.",
      icon: "🏡",
    },
    {
      title: "현장 방문",
      desc: "원하는 일정에 직접 방문하여 확인하실 수 있습니다.",
      icon: "🚗",
    },
  ];

  return (
    <section className="bg-[#F8F6F1] px-5 py-20">
      <div className="mx-auto max-w-7xl">

        <div className="text-center">
          <p className="text-sm font-black tracking-[0.25em] text-[#D4AF37]">
            WHY GOLD HOUSING
          </p>

          <h2 className="mt-3 text-4xl font-black tracking-[-0.06em] text-[#1D2942] md:text-5xl">
            왜 골드하우징일까요?
          </h2>

          <p className="mt-4 text-sm font-bold leading-7 text-gray-500">
            고객이 믿고 선택할 수 있는 이유를 준비했습니다.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          {items.map((item) => (
            <div
              key={item.title}
              className="group rounded-[2rem] bg-white p-7 shadow-[0_18px_50px_rgba(29,41,66,0.08)] ring-1 ring-black/5 transition duration-300 hover:-translate-y-2 hover:shadow-[0_30px_80px_rgba(29,41,66,0.15)]"
            >

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#D4AF37] text-2xl">
                {item.icon}
              </div>

              <h3 className="mt-7 text-2xl font-black tracking-[-0.05em] text-[#1D2942]">
                {item.title}
              </h3>

              <p className="mt-4 text-sm font-bold leading-7 text-gray-500">
                {item.desc}
              </p>

              <div className="mt-7 h-1 w-12 rounded-full bg-[#D4AF37] transition-all duration-300 group-hover:w-20" />

            </div>
          ))}

        </div>
      </div>
    </section>
  );
}