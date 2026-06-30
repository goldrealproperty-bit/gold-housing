"use client";

import FeatureSelector from "@/components/admin/FeatureSelector";
import { PropertyFormState } from "./adminTypes";

type PropertyFormProps = {
  form: PropertyFormState;
  setForm: React.Dispatch<React.SetStateAction<PropertyFormState>>;
  editingId: number | null;
  uploading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCancelEdit: () => void;
  onPropertyImages: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onManagerImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (url: string) => void;
};

function parseMoney(value: string) {
  const text = value.replace(/\s/g, "").replace(/,/g, "");
  let total = 0;

  const eok = text.match(/(\d+(?:\.\d+)?)억/);
  const man = text.match(/(\d+(?:\.\d+)?)만원/);

  if (eok) total += Number(eok[1]) * 10000;
  if (man) total += Number(man[1]);

  if (!eok && !man) {
    const onlyNumber = text.replace(/[^\d]/g, "");
    if (onlyNumber) total = Number(onlyNumber);
  }

  return total;
}

function formatMoney(manwon: number) {
  if (manwon <= 0) return "문의";

  const eok = Math.floor(manwon / 10000);
  const man = manwon % 10000;

  if (eok > 0 && man > 0) return `${eok}억 ${man}만원`;
  if (eok > 0) return `${eok}억`;
  return `${man}만원`;
}

function calculateLoan(price: string, deposit: string) {
  const priceValue = parseMoney(price);
  const depositValue = parseMoney(deposit);

  if (!priceValue || !depositValue) return "";

  return formatMoney(priceValue - depositValue);
}

export default function PropertyForm({
  form,
  setForm,
  editingId,
  uploading,
  onSubmit,
  onCancelEdit,
  onPropertyImages,
  onManagerImage,
  onRemoveImage,
}: PropertyFormProps) {
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;

    setForm((prev) => {
      const next = {
        ...prev,
        [name]: value,
      };

      if (name === "price" || name === "deposit") {
        return {
          ...next,
          loan: calculateLoan(
            name === "price" ? value : prev.price,
            name === "deposit" ? value : prev.deposit
          ),
        };
      }

      return next;
    });
  }

  return (
    <form onSubmit={onSubmit} className="mt-10 rounded-3xl bg-white p-8 shadow-xl">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-black">
          {editingId ? "매물 수정" : "매물 등록"}
        </h2>

        {editingId && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="rounded-xl bg-gray-200 px-5 py-3 font-bold text-gray-700 hover:bg-gray-300"
          >
            수정 취소
          </button>
        )}
      </div>

      <div className="mt-8 rounded-2xl border border-dashed p-6">
        <p className="font-bold">매물 사진 여러 장 업로드</p>

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={onPropertyImages}
          className="mt-4"
        />

        {uploading && (
          <p className="mt-3 text-sm text-gray-500">이미지 업로드 중...</p>
        )}

        {form.images.length > 0 && (
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {form.images.map((url) => (
              <div key={url} className="relative">
                <img
                  src={url}
                  alt="업로드 이미지"
                  className="h-48 w-full rounded-2xl object-cover"
                />

                <button
                  type="button"
                  onClick={() => onRemoveImage(url)}
                  className="absolute right-3 top-3 rounded-full bg-red-500 px-3 py-1 text-sm font-bold text-white"
                >
                  삭제
                </button>

                {form.image === url && (
                  <span className="absolute left-3 top-3 rounded-full bg-yellow-400 px-3 py-1 text-sm font-bold text-black">
                    대표사진
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <input name="title" value={form.title} onChange={handleChange} className="rounded-xl border p-4" placeholder="매물명 예: 인천 부평 3룸" />
        <input name="location" value={form.location} onChange={handleChange} className="rounded-xl border p-4" placeholder="지역 예: 인천 부평구" />
        <input name="address" value={form.address} onChange={handleChange} className="rounded-xl border p-4 md:col-span-2" placeholder="상세 주소 예: 인천 부평구 부평동 123-4" />

        <input name="price" value={form.price} onChange={handleChange} className="rounded-xl border p-4" placeholder="분양가 예: 2억 7,900만원" />
        <input name="deposit" value={form.deposit} onChange={handleChange} className="rounded-xl border p-4" placeholder="실입주금 예: 1,500만원" />

        <input
          name="loan"
          value={form.loan}
          onChange={handleChange}
          className="rounded-xl border bg-gray-50 p-4 font-bold text-gray-700 md:col-span-2"
          placeholder="융자금 자동계산"
        />

        <input name="rooms" value={form.rooms} onChange={handleChange} className="rounded-xl border p-4" placeholder="방 구조 예: 3룸" />
        <input name="baths" value={form.baths} onChange={handleChange} className="rounded-xl border p-4" placeholder="욕실 예: 욕실 2개" />
        <input name="parking" value={form.parking} onChange={handleChange} className="rounded-xl border p-4" placeholder="주차 예: 주차 가능" />
        <input name="elevator" value={form.elevator} onChange={handleChange} className="rounded-xl border p-4" placeholder="엘리베이터 예: 있음" />
      </div>

      <div className="mt-8 rounded-3xl bg-gray-50 p-6">
        <h3 className="text-2xl font-black">🏠 구조 선택</h3>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {["2룸", "3룸", "4룸"].map((room) => (
            <button
              key={room}
              type="button"
              onClick={() => setForm({ ...form, room_type: room })}
              className={`rounded-2xl border px-6 py-5 text-xl font-black transition ${
                form.room_type === room
                  ? "border-yellow-400 bg-yellow-400 text-black shadow-lg"
                  : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {form.room_type === room ? "✅ " : ""}
              {room}
            </button>
          ))}
        </div>
      </div>

      <textarea
        name="desc"
        value={form.desc}
        onChange={handleChange}
        className="mt-4 min-h-32 w-full rounded-xl border p-4"
        placeholder="매물 설명"
      />

      <FeatureSelector
        features={form.features}
        onChange={(features) => setForm({ ...form, features })}
      />

      <button
        disabled={uploading}
        className="mt-8 rounded-xl bg-yellow-400 px-8 py-4 font-black text-black disabled:opacity-50"
      >
        {uploading ? "업로드 중..." : editingId ? "수정 완료하기" : "매물 등록하기"}
      </button>
    </form>
  );
}