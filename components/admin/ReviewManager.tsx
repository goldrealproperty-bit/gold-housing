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

export default function ReviewManager() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [uploading, setUploading] = useState(false);

  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [rating, setRating] = useState(5);
  const [isBest, setIsBest] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      alert("후기 목록 불러오기 실패: " + error.message);
      return;
    }

    setReviews(data || []);
  }

  async function uploadReviewImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
      const filePath = `reviews/${fileName}`;

      const { error } = await supabase.storage
        .from("property-images")
        .upload(filePath, file);

      if (error) throw error;

      const { data } = supabase.storage
        .from("property-images")
        .getPublicUrl(filePath);

      setImage(data.publicUrl);
      alert("후기 사진 업로드 완료!");
    } catch (error: any) {
      alert("후기 사진 업로드 실패: " + error.message);
    }

    setUploading(false);
  }

  function resetForm() {
    setEditingReviewId(null);
    setTitle("");
    setContent("");
    setImage("");
    setRating(5);
    setIsBest(false);
  }

  function startEdit(review: Review) {
    setEditingReviewId(review.id);
    setTitle(review.title || "");
    setContent(review.content || "");
    setImage(review.image || "");
    setRating(review.rating || 5);
    setIsBest(Boolean(review.is_best));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function saveReview() {
    if (!title.trim()) {
      alert("후기 제목을 입력해주세요.");
      return;
    }

    if (!image) {
      alert("후기 사진을 업로드해주세요.");
      return;
    }

    const payload = {
      title,
      content,
      image,
      rating,
      is_best: isBest,
    };

    const { error } = editingReviewId
      ? await supabase.from("reviews").update(payload).eq("id", editingReviewId)
      : await supabase.from("reviews").insert(payload);

    if (error) {
      alert(
        editingReviewId
          ? "후기 수정 실패: " + error.message
          : "후기 등록 실패: " + error.message
      );
      return;
    }

    alert(editingReviewId ? "후기가 수정되었습니다!" : "후기가 등록되었습니다!");
    resetForm();
    fetchReviews();
  }

  async function deleteReview(id: number) {
    const ok = confirm("이 후기를 삭제하시겠습니까?");
    if (!ok) return;

    const { error } = await supabase.from("reviews").delete().eq("id", id);

    if (error) {
      alert("후기 삭제 실패: " + error.message);
      return;
    }

    alert("후기가 삭제되었습니다.");
    fetchReviews();
  }

  return (
    <section className="mt-8 grid gap-8 lg:grid-cols-2">
      <div className="rounded-3xl bg-white p-6 shadow">
        <h2 className="text-3xl font-black">
          {editingReviewId ? "사진후기 수정" : "사진후기 등록"}
        </h2>

        <p className="mt-2 text-sm font-bold text-gray-500">
          사진을 업로드하고 후기를 등록하면 홈페이지에 자동 표시됩니다.
        </p>

        <div className="mt-6 grid gap-4">
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
            type="file"
            accept="image/*"
            onChange={uploadReviewImage}
            className="rounded-2xl border bg-white p-4 font-bold"
          />

          {image && (
            <div className="overflow-hidden rounded-2xl border">
              <img
                src={image}
                alt="후기 미리보기"
                className="h-64 w-full object-cover"
              />
            </div>
          )}

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

          <button
            type="button"
            onClick={saveReview}
            disabled={uploading}
            className="h-14 rounded-2xl bg-yellow-400 font-black text-black disabled:opacity-50"
          >
            {uploading
              ? "업로드 중..."
              : editingReviewId
                ? "후기 수정 저장"
                : "후기 등록"}
          </button>

          {editingReviewId && (
            <button
              type="button"
              onClick={resetForm}
              className="h-14 rounded-2xl bg-gray-100 font-black text-gray-700"
            >
              수정 취소
            </button>
          )}
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow">
        <h2 className="text-3xl font-black">등록된 후기</h2>

        <div className="mt-6 grid gap-4">
          {reviews.length === 0 && (
            <div className="rounded-2xl bg-gray-50 p-8 text-center font-bold text-gray-500">
              등록된 후기가 없습니다.
            </div>
          )}

          {reviews.map((review) => (
            <div
              key={review.id}
              className="overflow-hidden rounded-2xl border bg-white"
            >
              {review.image && (
                <img
                  src={review.image}
                  alt={review.title || "후기"}
                  className="h-56 w-full object-cover"
                />
              )}

              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-black text-yellow-500">
                      {"★".repeat(review.rating || 5)}
                    </p>

                    <h3 className="mt-1 text-xl font-black">
                      {review.title}
                    </h3>

                    <p className="mt-2 text-sm font-bold leading-6 text-gray-500">
                      {review.content}
                    </p>
                  </div>

                  {review.is_best && (
                    <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-black text-yellow-700">
                      추천
                    </span>
                  )}
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => startEdit(review)}
                    className="rounded-xl bg-blue-50 px-4 py-2 text-sm font-black text-blue-600"
                  >
                    수정
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteReview(review.id)}
                    className="rounded-xl bg-red-50 px-4 py-2 text-sm font-black text-red-600"
                  >
                    삭제
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}