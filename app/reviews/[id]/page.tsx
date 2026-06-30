import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

function getImage(image: string | null) {
  return image && image.trim() !== ""
    ? image
    : "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1200&auto=format&fit=crop";
}

const phone = "010-5858-1942";

const smsBody = encodeURIComponent(`안녕하세요.
건축주직분양 사진후기 보고 문의드립니다.

희망지역 :
예산 :
실입주금 :
방 개수 :
입주 예정일 :
원하시는 조건 :`);

export default async function ReviewDetail({ params }: PageProps) {
  const { id } = await params;

  const { data: review } = await supabase
    .from("reviews")
    .select("*")
    .eq("id", Number(id))
    .single();

  if (!review) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-5">
        <div className="text-center">
          <h1 className="text-3xl font-black">후기를 찾을 수 없습니다.</h1>
          <a
            href="/"
            className="mt-6 inline-block rounded-2xl bg-yellow-400 px-6 py-4 font-black text-black"
          >
            홈으로 돌아가기
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-28">
      <section className="bg-slate-950 px-5 pb-7 pt-6 text-white">
        <div className="mx-auto max-w-4xl">
          <a
            href="/#reviews"
            className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-black text-yellow-400"
          >
            ← 사진후기
          </a>

          <p className="mt-6 text-sm font-black text-yellow-400">REVIEW</p>

          <h1 className="mt-2 text-4xl font-black leading-tight tracking-[-0.06em]">
            {review.title || "사진후기"}
          </h1>

          <p className="mt-4 text-lg font-black text-yellow-400">
            {"★".repeat(review.rating || 5)}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-6">
        <div className="overflow-hidden rounded-[2rem] bg-white shadow-xl">
          <img
            src={getImage(review.image)}
            alt={review.title || "사진후기"}
            className="h-[420px] w-full object-cover"
          />

          <div className="p-6">
            {review.is_best && (
              <span className="inline-flex rounded-full bg-yellow-100 px-4 py-2 text-sm font-black text-yellow-700">
                추천후기
              </span>
            )}

            <h2 className="mt-4 text-3xl font-black tracking-[-0.05em]">
              {review.title || "사진후기"}
            </h2>

            <p className="mt-5 whitespace-pre-wrap text-base font-bold leading-8 text-gray-600">
              {review.content || "상담 후기를 확인해보세요."}
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-[2rem] bg-white p-6 shadow-sm">
          <h3 className="text-2xl font-black">상담 안내</h3>
          <p className="mt-3 text-sm font-bold leading-6 text-gray-500">
            후기와 비슷한 조건의 매물을 찾고 계신다면 희망지역, 예산, 실입주금을 알려주세요.
          </p>

          <a
            href="/#properties"
            className="mt-5 block rounded-2xl bg-gray-100 py-4 text-center font-black text-gray-800"
          >
            매물 다시 보기
          </a>
        </div>
      </section>

      <div className="fixed bottom-0 left-0 right-0 z-50 flex gap-2 border-t bg-white/95 p-3 shadow-2xl backdrop-blur md:hidden">
        <a
          href={`tel:${phone}`}
          className="flex-1 rounded-2xl bg-yellow-400 py-4 text-center font-black text-black"
        >
          전화 상담
        </a>

        <a
          href={`sms:${phone}?body=${smsBody}`}
          className="flex-1 rounded-2xl bg-slate-950 py-4 text-center font-black text-white"
        >
          문자 문의
        </a>
      </div>
    </main>
  );
}