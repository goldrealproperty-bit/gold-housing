"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Review = {
  id: number;
  title: string | null;
  content: string | null;
  image: string | null;
  rating: number | null;
  is_best: boolean | null;
  created_at: string | null;
};

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [rating, setRating] = useState(5);
  const [isBest, setIsBest] = useState(false);
  const [loading, setLoading] = useState(false);

  async function fetchReviews() {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .order("id", { ascending: false });

    if (!error) setReviews(data || []);
  }

  useEffect(() => {
    fetchReviews();
  }, []);

  async function addReview() {
    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("reviews").insert({
      title,
      content,
      image,
      rating,
      is_best: isBest,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    setTitle("");
    setContent("");
    setImage("");
    setRating(5);
    setIsBest(false);

    fetchReviews();
    alert("후기가 등록되었습니다.");
  }

  async function deleteReview(id: number) {
    const ok = confirm("이 후기를 삭제할까요?");
    if (!ok) return;

    const { error } = await supabase.from("reviews").delete().eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    fetchReviews();
  }

  return (
    <main className="min-h-screen bg-gray-50 px-5 py-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6">
          <a href="/admin" className="text-sm font-bold text-gray-500">
            ← 관리자 홈
          </a>
          <h1 className="mt-3 text-4xl font-black">후기관리</h1>
          <p className="mt-2 text-gray-500">
            사진후기를 등록하면 홈페이지에 자동으로 표시됩니다.
          </p>
        </div>

        <section className="rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="text-2xl font-black">후기 등록</h2>

          <div className="mt-5 grid gap-4">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="후기 제목"
              className="h-14 rounded-2xl border px-4 font-bold outline-none"
            />

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="후기 내용"
              className="min-h-28 rounded-2xl border p-4 font-bold outline-none"
            />

            <input
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="후기 사진 URL"
              className="h-14 rounded-2xl border px-4 font-bold outline-none"
            />

            <div className="grid gap-4 md:grid-cols-2">
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="h-14 rounded-2xl border px-4 font-bold outline-none"
              >
                <option value={5}>★★★★★ 5점</option>
                <option value={4}>★★★★ 4점</option>
                <option value={3}>★★★ 3점</option>
                <option value={2}>★★ 2점</option>
                <option value={1}>★ 1점</option>
              </select>

              <label className="flex h-14 items-center gap-3 rounded-2xl border px-4 font-bold">
                <input
                  type="checkbox"
                  checked={isBest}
                  onChange={(e) => setIsBest(e.target.checked)}
                />
                추천후기
              </label>
            </div>

            <button
              type="button"
              onClick={addReview}
              disabled={loading}
              className="h-14 rounded-2xl bg-yellow-400 font-black text-black disabled:opacity-50"
            >
              {loading ? "등록 중..." : "후기 등록"}
            </button>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="mb-4 text-2xl font-black">등록된 후기</h2>

          <div className="grid gap-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="overflow-hidden rounded-3xl bg-white shadow-sm md:flex"
              >
                <div className="h-48 bg-gray-100 md:h-auto md:w-64">
                  {review.image ? (
                    <img
                      src={review.image}
                      alt={review.title || "후기"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center font-bold text-gray-400">
                      사진 없음
                    </div>
                  )}
                </div>

                <div className="flex-1 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-black text-yellow-500">
                        {"★".repeat(review.rating || 5)}
                      </p>
                      <h3 className="mt-2 text-xl font-black">
                        {review.title}
                      </h3>
                      <p className="mt-2 text-sm text-gray-500">
                        {review.content}
                      </p>
                    </div>

                    {review.is_best && (
                      <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-black text-yellow-700">
                        추천
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => deleteReview(review.id)}
                    className="mt-5 rounded-xl bg-red-50 px-4 py-2 text-sm font-black text-red-600"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}

            {reviews.length === 0 && (
              <div className="rounded-3xl bg-white p-10 text-center font-bold text-gray-500">
                등록된 후기가 없습니다.
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}