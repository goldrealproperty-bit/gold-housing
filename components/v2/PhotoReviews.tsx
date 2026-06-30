"use client";

type Review = {
  id: number;
  title: string | null;
  content: string | null;
  image: string | null;
  rating: number | null;
  is_best: boolean | null;
  created_at: string | null;
};

function getImage(image: string | null) {
  return image && image.trim() !== ""
    ? image
    : "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1200&auto=format&fit=crop";
}

export default function PhotoReviews({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) return null;

  return (
    <section id="reviews" className="bg-white px-5 py-12">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-black text-yellow-500">PHOTO REVIEW</p>

        <h2 className="mt-1 text-4xl font-black tracking-[-0.05em] text-slate-950">
          고객 사진후기
        </h2>

        <p className="mt-3 text-sm font-bold text-gray-500">
          실제 상담과 계약 후기를 사진으로 확인하세요.
        </p>

        <div className="mt-7 flex gap-5 overflow-x-auto pb-5">
          {reviews.map((review) => (
            <a
              key={review.id}
              href={`/reviews/${review.id}`}
              className="w-[84%] shrink-0 overflow-hidden rounded-[2rem] bg-white shadow-lg ring-1 ring-gray-100 active:scale-[0.98] sm:w-[360px]"
            >
              <div className="relative h-64 bg-gray-100">
                <img
                  src={getImage(review.image)}
                  alt={review.title || "후기"}
                  className="h-full w-full object-cover"
                />

                {review.is_best && (
                  <div className="absolute left-4 top-4 rounded-full bg-yellow-400 px-4 py-2 text-sm font-black text-black shadow-lg">
                    추천후기
                  </div>
                )}
              </div>

              <div className="p-5">
                <p className="text-sm font-black text-yellow-500">
                  {"★".repeat(review.rating || 5)}
                </p>

                <h3 className="mt-2 line-clamp-1 text-2xl font-black tracking-[-0.04em] text-slate-950">
                  {review.title || "사진후기"}
                </h3>

                <p className="mt-2 line-clamp-2 text-sm font-bold leading-6 text-gray-500">
                  {review.content || "상담 후기를 확인해보세요."}
                </p>

                <div className="mt-5 rounded-2xl bg-yellow-400 py-4 text-center text-sm font-black text-black">
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