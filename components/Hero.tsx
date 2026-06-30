"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Hero() {
  const [phone, setPhone] = useState("");
  const [area, setArea] = useState("");
  const [budget, setBudget] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleConsultation(e: React.FormEvent) {
    e.preventDefault();

    if (!phone.trim()) {
      alert("전화번호를 입력해주세요.");
      return;
    }

    setSaving(true);

    const { error } = await supabase.from("consultations").insert([
      {
        phone,
        area,
        budget,
        message,
        status: "신규",
      },
    ]);

    setSaving(false);

    if (error) {
      alert("상담 신청 저장 실패: " + error.message);
      return;
    }

    alert("상담 신청이 완료되었습니다. 빠르게 연락드리겠습니다.");

    setPhone("");
    setArea("");
    setBudget("");
    setMessage("");
  }

  return (
    <section className="relative overflow-hidden bg-white px-5 py-10 md:px-6 md:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_45%,#facc1520,transparent_38%)]" />

      <div className="relative mx-auto grid max-w-7xl gap-10 md:grid-cols-2 md:items-center">
        <div>
          <p className="inline-block rounded-full bg-yellow-100 px-5 py-2 text-sm font-black text-yellow-700">
            중개수수료 0원 · 건축주 직영 분양
          </p>

          <h1 className="mt-5 text-4xl font-black leading-tight text-slate-950 md:mt-8 md:text-7xl">
            내 예산에 맞는
            <br />
            <span className="text-yellow-500">신축빌라</span>를
            <br />
            찾아보세요
          </h1>

          <p className="mt-4 max-w-xl text-base leading-7 text-gray-600 md:mt-6 md:text-xl md:leading-9">
            원하는 지역, 예산, 조건을 알려주시면 <br />가능한 매물만 빠르게
            안내해드립니다.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3 md:mt-10 md:flex md:flex-wrap md:gap-4">
            <a
              href="#properties"
              className="rounded-2xl bg-yellow-400 px-8 py-4 text-lg font-black text-black transition hover:bg-yellow-300"
            >
              🔍 매물검색
            </a>

            <a
              href="#map"
              className="rounded-2xl bg-slate-900 px-8 py-4 text-lg font-black text-white transition hover:bg-slate-800"
            >
              🗺 지도검색
            </a>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div>
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 text-3xl">
                💰
              </div>
              <p className="mt-4 font-black">중개수수료 0원</p>
              <p className="mt-1 text-sm text-gray-500">건축주 직접 분양</p>
            </div>

            <div>
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl">
                🛡️
              </div>
              <p className="mt-4 font-black">실매물 중심</p>
              <p className="mt-1 text-sm text-gray-500">허위매물 걱정 NO</p>
            </div>

            <div>
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-3xl">
                🎧
              </div>
              <p className="mt-4 font-black">맞춤 상담</p>
              <p className="mt-1 text-sm text-gray-500">조건별 매물 안내</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-2xl ring-1 ring-gray-100">
          <p className="font-black text-yellow-500">FREE CONSULTING</p>

          <h2 className="mt-3 text-4xl font-black text-slate-950">
            30초 무료 상담 신청
          </h2>

          <p className="mt-4 text-gray-500">
            희망 지역과 예산을 남겨주시면 가능한 매물을 안내해드립니다.
          </p>

          <form onSubmit={handleConsultation} className="mt-8 space-y-4">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="전화번호 *"
              className="w-full rounded-2xl border px-5 py-5 font-bold outline-none focus:border-yellow-400"
            />

            <input
              type="text"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="희망지역 예: 인천, 부천, 김포"
              className="w-full rounded-2xl border px-5 py-5 font-bold outline-none focus:border-yellow-400"
            />

            <input
              type="text"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="예산 예: 3억 이하"
              className="w-full rounded-2xl border px-5 py-5 font-bold outline-none focus:border-yellow-400"
            />

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="문의내용 선택사항"
              className="min-h-28 w-full rounded-2xl border px-5 py-5 font-bold outline-none focus:border-yellow-400"
            />

            <button
              type="submit"
              disabled={saving}
              className="block w-full rounded-2xl bg-yellow-400 py-5 text-center text-lg font-black text-black hover:bg-yellow-300 disabled:opacity-50"
            >
              {saving ? "신청 저장 중..." : "무료 상담 신청하기"}
            </button>

            <p className="text-center text-sm text-gray-400">
              🔒 개인정보는 상담 목적 외 사용하지 않습니다.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}