import { supabase } from "@/lib/supabase";
import HomeClient from "./HomeClient";

export const dynamic = "force-dynamic";

type Property = {
  id: number;
  image: string | null;
  title: string | null;
  location: string | null;
  address: string | null;
  price: string | null;
  deposit: string | null;
  features: string[] | null;
  room_type: string | null;
};

type Review = {
  id: number;
  title: string | null;
  content: string | null;
  image: string | null;
  rating: number | null;
  is_best: boolean | null;
  created_at: string | null;
};

export default async function Home() {
  const { data: propertiesData } = await supabase
    .from("properties")
    .select("*")
    .order("id", { ascending: false });

  const { data: reviewsData } = await supabase
    .from("reviews")
    .select("*")
    .order("id", { ascending: false });

  const properties: Property[] = propertiesData || [];
  const reviews: Review[] = reviewsData || [];

  return <HomeClient initialProperties={properties} initialReviews={reviews} />;
}