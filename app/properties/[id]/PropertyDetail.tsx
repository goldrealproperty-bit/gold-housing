"use client";

import { useState } from "react";
import KakaoMap from "@/components/v2/KakaoMap";

type Property = {
  id: number;
  title: string | null;
  location: string | null;
  address: string | null;
  price: string | null;
  deposit: string | null;
  loan: string | null;
  image: string | null;
  images: string[] | null;
  rooms: string | null;
  baths: string | null;
  parking: string | null;
  elevator: string | null;
  description: string | null;
  manager_name: string | null;
  manager_phone: string | null;
  manager_intro: string | null;
  manager_image: string | null;
  features: string[] | null;
  room_type: string | null;
};

const fallbackImage =
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1200&auto=format&fit=crop";

const smsBody = encodeURIComponent(`안녕하세요.
골드하우징 매물 문의드립니다.

희망지역 :
예산 :
실입주금 :
방 개수 :
입주 예정일 :
원하시는 조건 :`);

function getBadge(property: Property) {
  const features = property.features || [];
  if (features.some((v) => v.includes("무입"))) return "무입가능";
  if (features.some((v) => v.includes("역세권"))) return "역세권";
  if (features.some((v) => v.includes("테라스"))) return "테라스";
  if (features.some((v) => v.includes("복층"))) return "복층";
  if (property.room_type) return property.room_type;
  return "신축빌라";
}

function valueOrAsk(value?: string | null) {
  return value && value.trim() !== "" ? value : "문의";
}

function formatMoney(value?: string | null) {
  if (!value) return "문의";

  const number = Number(value.replace(/[^\d]/g, ""));
  if (!number) return valueOrAsk(value);

  const eok = Math.floor(number / 10000);
  const man = number % 10000;

  if (eok > 0 && man > 0) return `${eok}억 ${man.toLocaleString()}만원`;
  if (eok > 0) return `${eok}억`;
  return `${man.toLocaleString()}만원`;
}

export default function PropertyDetail({ property }: { property: Property }) {
  const images =
    property.images && property.images.length > 0
      ? property.images
      : property.image
        ? [property.image]
        : [fallbackImage];

  const [imageIndex, setImageIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const selectedImage = images[imageIndex];
  const phone = property.manager_phone || "010-5858-1942";
  const features = property.features || [];

  const prevImage = () => {
    setImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  function handleTouchStart(e: React.TouchEvent<HTMLDivElement>) {
    setTouchStartX(e.touches[0].clientX);
  }

  function handleTouchEnd(e: React.TouchEvent<HTMLDivElement>) {
    if (touchStartX === null) return;

    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextImage();
      } else {
        prevImage();
      }
    }

    setTouchStartX(null);
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-28">
      <section className="bg-slate-950 px-5 pb-7 pt-6 text-white">
        <div className="mx-auto max-w-7xl">
          <a
            href="/"
            className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-black text-yellow-400"
          >
            ← 홈으로
          </a>

          <div className="mt-5 inline-flex rounded-full bg-yellow-400 px-4 py-2 text-sm font-black text-black">
            {getBadge(property)}
          </div>

          <h1 className="mt-5 text-4xl font-black leading-tight tracking-[-0.06em] md:text-6xl">
            {property.title || "매물명 없음"}
          </h1>

          <p className="mt-3 text-sm font-bold leading-6 text-gray-300">
            📍 {property.location || property.address || "지역 확인 중"}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-6">
        <div className="overflow-hidden rounded-[2rem] bg-white shadow-xl">
          <div
            className="relative h-[360px] bg-gray-200 md:h-[560px]"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <img
              src={selectedImage}
              alt={property.title || "매물 사진"}
              className="h-full w-full object-cover"
            />

            <div className="absolute left-4 top-4 rounded-full bg-black/70 px-4 py-2 text-sm font-black text-white">
              사진 {imageIndex + 1} / {images.length}
            </div>

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-2xl font-black text-white"
                >
                  ‹
                </button>

                <button
                  type="button"
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-2xl font-black text-white"
                >
                  ›
                </button>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto p-4">
              {images.map((url, index) => (
                <button
                  key={`${url}-${index}`}
                  type="button"
                  onClick={() => setImageIndex(index)}
                  className={`h-20 w-28 shrink-0 overflow-hidden rounded-2xl border-4 ${
                    imageIndex === index
                      ? "border-yellow-400"
                      : "border-transparent opacity-70"
                  }`}
                >
                  <img
                    src={url}
                    alt={`썸네일 ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2 md:gap-3">
          <div className="rounded-[1.3rem] bg-white p-3 shadow-sm md:rounded-[1.5rem] md:p-5">
            <p className="text-[11px] font-black text-gray-400 md:text-xs">
              분양가
            </p>
            <p className="mt-1 whitespace-nowrap text-sm font-black tracking-[-0.04em] text-blue-700 md:text-2xl">
              {formatMoney(property.price)}
            </p>
          </div>

          <div className="rounded-[1.3rem] bg-white p-3 shadow-sm md:rounded-[1.5rem] md:p-5">
            <p className="text-[11px] font-black text-gray-400 md:text-xs">
              실입주금
            </p>
            <p className="mt-1 whitespace-nowrap text-sm font-black tracking-[-0.04em] md:text-xl">
              {formatMoney(property.deposit)}
            </p>
          </div>

          <div className="rounded-[1.3rem] bg-white p-3 shadow-sm md:rounded-[1.5rem] md:p-5">
            <p className="text-[11px] font-black text-gray-400 md:text-xs">
              융자금
            </p>
            <p className="mt-1 whitespace-nowrap text-sm font-black tracking-[-0.04em] text-slate-950 md:text-xl">
              {formatMoney(property.loan)}
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-[2rem] bg-white p-6 shadow-sm">
          <h2 className="text-3xl font-black tracking-[-0.05em]">매물 정보</h2>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <Info label="구조" value={property.rooms || property.room_type} />
            <Info label="욕실" value={property.baths} />
            <Info label="주차" value={property.parking} />
            <Info label="엘리베이터" value={property.elevator} />
          </div>

          {features.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {features.map((feature) => (
                <span
                  key={feature}
                  className="rounded-full bg-gray-100 px-4 py-2 text-sm font-black text-gray-700"
                >
                  {feature}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="mt-5 rounded-[2rem] bg-yellow-50 p-5 text-sm font-bold leading-6 text-slate-800">
          📍 정확한 주소는 매물 보호를 위해 상담 시 안내드립니다.
        </div>

        <div className="mt-5">
          <KakaoMap address={property.address || property.location} />
        </div>

      </section>

      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 p-3 shadow-2xl backdrop-blur">
        <div className="mx-auto flex max-w-3xl gap-2">
          <a
            href={`tel:${phone}`}
            className="flex-1 rounded-2xl bg-yellow-400 py-4 text-center font-black text-black"
          >
            전화문의
          </a>

          <a
            href={`sms:${phone}?body=${smsBody}`}
            className="flex-1 rounded-2xl bg-slate-950 py-4 text-center font-black text-white"
          >
            문자문의
          </a>
        </div>
      </div>
    </main>
  );
}

function Info({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="rounded-2xl bg-gray-50 p-4">
      <p className="text-xs font-black text-gray-400">{label}</p>
      <p className="mt-1 font-black">{valueOrAsk(value)}</p>
    </div>
  );
}