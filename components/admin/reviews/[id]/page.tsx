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
    : "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1200&auto=format&fit=crop";
}

export default async function ReviewDetail({ params }: PageProps) {
  const { id } = await params;

  const { data: review } = await supabase
    .from("reviews")
    .select("*")
    .eq("id", Number(id))
    .single();

  if (!review) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <h1 className="text-3xl font-black">
          후기를 찾을 수 없습니다.
        </h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white pb-28">
      <img
        src={getImage(review.image)}
        className="h-[420px] w-full object-cover"
      />

      <section className="mx-auto max-w-4xl px-5 py-8">

        <div className="flex items-center gap-2">
          {Array.from({ length: review.rating || 5 }).map((_, i) => (
            <span key={i} className="text-2xl">
              ⭐
            </span>
          ))}
        </div>

        <h1 className="mt-4 text-4xl font-black">
          {review.title}
        </h1>

        <p className="mt-6 whitespace-pre-wrap text-lg leading-9 text-gray-700">
          {review.content}
        </p>

      </section>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex gap-3">

        <a
          href="tel:01058581942"
          className="flex-1 rounded-2xl bg-yellow-400 py-4 text-center font-black"
        >
          📞 전화상담
        </a>

        <a
          href="sms:01058581942"
          className="flex-1 rounded-2xl bg-slate-900 py-4 text-center font-black text-white"
        >
          문자문의
        </a>

      </div>
    </main>
  );
}