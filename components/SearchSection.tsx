export default function SearchSection() {
  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-6">

        <div className="bg-white rounded-3xl shadow-2xl p-10 -mt-28 relative z-20">

          <h2 className="text-3xl font-black mb-8">
            원하는 조건으로 매물 찾기
          </h2>

          <div className="grid md:grid-cols-4 gap-5">

            <select className="border rounded-xl p-4">
              <option>지역 선택</option>
              <option>서울</option>
              <option>인천</option>
              <option>경기</option>
            </select>

            <select className="border rounded-xl p-4">
              <option>방 개수</option>
              <option>2룸</option>
              <option>3룸</option>
              <option>4룸</option>
            </select>

            <select className="border rounded-xl p-4">
              <option>예산</option>
              <option>2억 이하</option>
              <option>3억 이하</option>
              <option>4억 이하</option>
            </select>

            <button className="bg-yellow-400 rounded-xl font-bold hover:scale-105 transition">
              🔍 매물 검색
            </button>

          </div>

        </div>

      </div>
    </section>
  );
}