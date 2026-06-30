import { supabase } from "@/lib/supabase";
import PropertyDetail from "./PropertyDetail";

export const dynamic = "force-dynamic";

type Property = {
  id: number;
  title: string | null;
  location: string | null;
  address: string | null;
  price: string | null;
  deposit: string | null;
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

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PropertyDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const id = Number(resolvedParams.id);

  if (!id) {
    return (
      <main className="flex min-h-screen items-center justify-center px-5">
        <div className="text-center">
          <h1 className="text-3xl font-black">잘못된 매물 주소입니다.</h1>
          <p className="mt-3 text-sm font-bold text-gray-500">
            매물 번호를 확인할 수 없습니다.
          </p>
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

  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .single<Property>();

  if (error || !data) {
    return (
      <main className="flex min-h-screen items-center justify-center px-5">
        <div className="text-center">
          <h1 className="text-3xl font-black">매물을 찾을 수 없습니다.</h1>
          <p className="mt-3 text-sm font-bold text-gray-500">
            삭제되었거나 존재하지 않는 매물입니다.
          </p>
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

  return <PropertyDetail property={data} />;
}