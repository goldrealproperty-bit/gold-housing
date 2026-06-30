"use client";

export default function BottomNav() {
  const phone = "010-5858-1942";

  const smsBody = encodeURIComponent(`안녕하세요.

매물 문의드립니다.

희망지역 :
예산 :
실입주금 :
방 개수 :
입주 예정일 :
원하시는 조건 :`);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#E8E1D2] bg-white/95 px-3 py-3 shadow-[0_-15px_40px_rgba(29,41,66,0.10)] backdrop-blur-xl md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-4 gap-2">

        <a
          href="#properties"
          className="flex flex-col items-center justify-center rounded-2xl py-2 transition active:scale-95"
        >
          <div className="text-2xl">🏠</div>
          <span className="mt-1 text-[11px] font-black text-[#1D2942]">
            실매물
          </span>
        </a>

        <a
          href="/map"
          className="flex flex-col items-center justify-center rounded-2xl py-2 transition active:scale-95"
        >
          <div className="text-2xl">🗺️</div>
          <span className="mt-1 text-[11px] font-black text-[#1D2942]">
            지도검색
          </span>
        </a>

        <a
          href={`sms:${phone}?body=${smsBody}`}
          className="flex flex-col items-center justify-center rounded-2xl py-2 transition active:scale-95"
        >
          <div className="text-2xl">💬</div>
          <span className="mt-1 text-[11px] font-black text-[#1D2942]">
            문자상담
          </span>
        </a>

        <a
          href={`tel:${phone}`}
          className="flex flex-col items-center justify-center rounded-2xl bg-[#D4AF37] py-2 shadow-md transition active:scale-95"
        >
          <div className="text-2xl">📞</div>
          <span className="mt-1 text-[11px] font-black text-[#1D2942]">
            전화상담
          </span>
        </a>

      </div>
    </nav>
  );
}