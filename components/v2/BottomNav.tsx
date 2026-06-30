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
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#E8E1D2] bg-white/95 px-4 py-3 shadow-[0_-15px_40px_rgba(29,41,66,0.10)] backdrop-blur-xl md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-3 gap-3">

        <a
          href={`sms:${phone}?body=${smsBody}`}
          className="flex items-center justify-center rounded-2xl bg-[#111827] py-4 text-sm font-black text-white shadow-md active:scale-95"
        >
          문자문의
        </a>

        <a
          href="/map"
          className="flex items-center justify-center rounded-2xl bg-emerald-500 py-4 text-sm font-black text-white shadow-md active:scale-95"
        >
          지도검색
        </a>

        <a
          href={`tel:${phone}`}
          className="flex items-center justify-center rounded-2xl bg-yellow-400 py-4 text-sm font-black text-[#1D2942] shadow-md active:scale-95"
        >
          전화문의
        </a>

      </div>
    </nav>
  );
}