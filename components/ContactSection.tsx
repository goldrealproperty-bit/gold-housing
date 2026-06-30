export default function ContactSection() {
  return (
    <section id="contact" className="bg-gray-50 py-24">
      <div className="mx-auto max-w-4xl px-6">
        <div className="rounded-3xl bg-white p-8 shadow-2xl md:p-12">
          <p className="font-bold text-yellow-500">FREE CONSULTING</p>

          <h2 className="mt-3 text-4xl font-black">
            30초 무료 상담 신청
          </h2>

          <p className="mt-4 text-gray-500">
            희망 지역과 예산을 남겨주시면 가능한 매물을 안내해드립니다.
          </p>

          <div className="mt-10 grid gap-4">
            <input className="rounded-xl border p-4" placeholder="이름" />
            <input className="rounded-xl border p-4" placeholder="전화번호" />
            <input className="rounded-xl border p-4" placeholder="희망지역 예: 인천, 부천, 김포" />
            <input className="rounded-xl border p-4" placeholder="예산 예: 3억 이하" />

            <textarea
              className="min-h-32 rounded-xl border p-4"
              placeholder="문의내용"
            />

            <button className="rounded-xl bg-slate-950 py-5 font-black text-white hover:bg-slate-800">
              무료 상담 신청하기
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}