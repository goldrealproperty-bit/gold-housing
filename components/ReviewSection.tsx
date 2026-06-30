const reviews = [
  {
    name: "인천 부평 계약 고객",
    text: "처음이라 걱정이 많았는데 예산에 맞춰서 친절하게 안내받았습니다.",
  },
  {
    name: "김포 신축빌라 상담 고객",
    text: "허위매물 없이 실제 가능한 매물만 보여줘서 믿음이 갔습니다.",
  },
  {
    name: "부천 3룸 계약 고객",
    text: "대출 상담부터 차량 투어까지 한 번에 진행돼서 편했습니다.",
  },
];

export default function ReviewSection() {
  return (
    <section id="reviews" className="bg-slate-950 py-24 text-white">
      <div className="mx-auto max-w-7xl px-6">
        <p className="font-bold text-yellow-400">REAL REVIEW</p>

        <h2 className="mt-3 text-4xl font-black">
          실제 상담 고객 후기
        </h2>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {reviews.map((review) => (
            <div
              key={review.name}
              className="rounded-3xl border border-white/10 bg-white/10 p-8 shadow-xl"
            >
              <div className="text-yellow-400">★★★★★</div>

              <p className="mt-6 leading-8 text-gray-200">
                “{review.text}”
              </p>

              <p className="mt-6 font-bold">
                {review.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}