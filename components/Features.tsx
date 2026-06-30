export default function Features() {
  const items = [
    {
      icon: "🏠",
      title: "실매물 100%",
      desc: "허위매물 없이 실제 분양 가능한 매물만 소개합니다."
    },
    {
      icon: "💰",
      title: "맞춤 대출 상담",
      desc: "예산에 맞는 금융상품을 무료 상담해드립니다."
    },
    {
      icon: "🚗",
      title: "무료 차량 투어",
      desc: "원하는 지역의 매물을 직접 보여드립니다."
    }
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 px-6">

        {items.map((item) => (
          <div
            key={item.title}
            className="bg-white rounded-3xl shadow-xl p-10 hover:-translate-y-2 transition"
          >
            <div className="text-5xl">{item.icon}</div>

            <h2 className="mt-6 text-2xl font-bold">
              {item.title}
            </h2>

            <p className="mt-4 text-gray-600 leading-8">
              {item.desc}
            </p>

          </div>
        ))}

      </div>
    </section>
  )
}