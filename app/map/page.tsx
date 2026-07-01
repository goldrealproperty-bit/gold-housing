import { supabase } from "@/lib/supabase";
import { Property } from "@/components/Map/mapTypes";
import MapPageClient from "@/components/Map/MapPageClient";

export const dynamic = "force-dynamic";

type MapPageProps = {
  searchParams: Promise<{
    keyword?: string;
  }>;
};

export default async function MapPage({ searchParams }: MapPageProps) {
  const params = await searchParams;
  const keyword = params.keyword || "";

  const { data } = await supabase
    .from("properties")
    .select("*")
    .order("id", { ascending: false });

  const properties: Property[] = data || [];

  return <MapPageClient properties={properties} keyword={keyword} />;
}