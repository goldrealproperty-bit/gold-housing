export default function ContactCTA() {
  const phone = "010-5858-1942";
  const kakaoUrl = "https://open.kakao.com/o/sS6OtsBi";

  const smsBody = encodeURIComponent(
    `안녕하세요.
건축주직분양 매물 문의드립니다.

희망지역 :
예산 :
실입주금 :
방 개수 :
입주 예정일 :
원하시는 조건 :`
  );

  return (
    <section id="contact" className="bg-slate-950 px-5 py-14 text-white">
      <div className="mx-auto max-w-7xl rounded-[2rem] bg-white p-6 text-slate-950 shadow-2xl">
        <p className="text-sm font-black text-yellow-500">CONTACT</p>

        <h2 className="mt-2 text-4xl font-black leading-tight tracking-[-0.05em]">
          원하는 조건만
          <br />
          남겨주세요
        </h2>

        <p className="mt-4 text-sm font-bold leading-6 text-gray-500">
          예산, 지역, 방 개수만 알려주시면 가능한 매물부터 빠르게 안내해드립니다.
        </p>

        <div className="mt-7 grid gap-3">
          <a
            href={`tel:${phone}`}
            className="rounded-3xl bg-yellow-400 py-5 text-center text-lg font-black text-black"
          >
            📞 전화 상담
          </a>

          <a
            href={`sms:${phone}?body=${smsBody}`}
            className="rounded-3xl bg-slate-950 py-5 text-center text-lg font-black text-white"
          >
            💬 문자 문의
          </a>

          <a
            href={kakaoUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-3xl bg-[#FEE500] py-5 text-center text-lg font-black text-black"
          >
            🟡 카카오톡 상담
          </a>
        </div>
      </div>
    </section>
  );
}