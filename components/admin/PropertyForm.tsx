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

function onlyNumber(value: string) {
  return value.replace(/[^\d]/g, "");
}

function parseMoney(value: string) {
  const number = Number(onlyNumber(value));
  return Number.isNaN(number) ? 0 : number;
}

function formatMoney(manwon: number) {
  if (!manwon) return "";

  const eok = Math.floor(manwon / 10000);
  const man = manwon % 10000;

  if (eok > 0 && man > 0) return `${eok}억 ${man.toLocaleString()}만원`;
  if (eok > 0) return `${eok}억`;
  return `${man.toLocaleString()}만원`;
}

function calculateLoan(price: string, deposit: string) {
  const priceValue = parseMoney(price);
  const depositValue = parseMoney(deposit);

  if (!priceValue || !depositValue) return "";

  const loan = priceValue - depositValue;
  return loan > 0 ? formatMoney(loan) : "";
}

export default function PropertyForm({
  form,
  setForm,
  editingId,
  uploading,
  onSubmit,
  onCancelEdit,
  onPropertyImages,
  onRemoveImage,
}: PropertyFormProps) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setForm((prev) => {
      const nextValue =
        name === "price" || name === "deposit" ? onlyNumber(value) : value;

      const next = {
        ...prev,
        [name]: nextValue,
      };

      if (name === "price" || name === "deposit") {
        return {
          ...next,
          loan: calculateLoan(
            name === "price" ? nextValue : prev.price,
            name === "deposit" ? nextValue : prev.deposit
          ),
        };
      }

      return next;
    });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mt-10 rounded-3xl bg-white p-6 shadow-xl md:p-8"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-black">
            {editingId ? "매물 수정" : "신규 매물 등록"}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            꼭 필요한 정보만 빠르게 입력하세요.
          </p>
        </div>

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

      <div className="mt-8 rounded-2xl border border-dashed border-gray-300 p-5">
        <p className="font-black">매물 사진 업로드</p>
        <p className="mt-1 text-sm text-gray-500">
          첫 번째 사진이 대표사진으로 사용됩니다.
        </p>

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
          <div className="mt-5 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {form.images.map((url) => (
              <div key={url} className="relative">
                <img
                  src={url}
                  alt="업로드 이미지"
                  className="h-36 w-full rounded-2xl object-cover"
                />

                <button
                  type="button"
                  onClick={() => onRemoveImage(url)}
                  className="absolute right-2 top-2 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white"
                >
                  삭제
                </button>

                {form.image === url && (
                  <span className="absolute left-2 top-2 rounded-full bg-yellow-400 px-3 py-1 text-xs font-bold text-black">
                    대표사진
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          className="rounded-xl border p-4"
          placeholder="매물명 예: 인천 부평 3룸"
        />

        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          className="rounded-xl border p-4"
          placeholder="지역 예: 인천 부평구"
        />

        <input
          name="address"
          value={form.address}
          onChange={handleChange}
          className="rounded-xl border p-4 md:col-span-2"
          placeholder="상세 주소 예: 부평동 123-4"
        />

        <div>
          <input
            name="price"
            value={form.price}
            onChange={handleChange}
            inputMode="numeric"
            className="w-full rounded-xl border p-4"
            placeholder="분양가 숫자만 예: 27900"
          />
          <p className="mt-2 text-sm font-bold text-gray-500">
            표시: {formatMoney(parseMoney(form.price)) || "미입력"}
          </p>
        </div>

        <div>
          <input
            name="deposit"
            value={form.deposit}
            onChange={handleChange}
            inputMode="numeric"
            className="w-full rounded-xl border p-4"
            placeholder="실입주금 숫자만 예: 1500"
          />
          <p className="mt-2 text-sm font-bold text-gray-500">
            표시: {formatMoney(parseMoney(form.deposit)) || "미입력"}
          </p>
        </div>

        <div className="rounded-xl border bg-gray-50 p-4 md:col-span-2">
          <p className="text-sm font-bold text-gray-500">융자금 자동계산</p>
          <p className="mt-1 text-xl font-black text-gray-800">
            {form.loan || "분양가와 실입주금을 입력하면 자동 계산됩니다."}
          </p>
        </div>
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