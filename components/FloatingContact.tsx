export default function FloatingContact() {
  const phone = "010-5858-1942";

  const smsBody = encodeURIComponent(
    `안녕하세요.
매물 문의드립니다.

희망지역 :
예산 :
실입주금 :
방 개수 :
입주 예정일 :
원하시는 조건 :`
  );

  return (
    <div className="fixed bottom-6 right-6 z-50 hidden gap-2 md:flex">
      <a
        href={`tel:${phone}`}
        className="rounded-2xl bg-yellow-400 px-6 py-4 text-center font-black text-black shadow-2xl"
      >
        📞 전화문의
      </a>

      <a
        href={`sms:${phone}?body=${smsBody}`}
        className="rounded-2xl bg-slate-950 px-6 py-4 text-center font-black text-white shadow-2xl"
      >
        💬 문자문의
      </a>
    </div>
  );
}