"use client";

import Header from "@/components/v2/Header";
import Hero from "@/components/v2/Hero";
import PropertyGrid from "@/components/v2/PropertyGrid";
import PhotoReviews from "@/components/v2/PhotoReviews";
import TrustSection from "../components/v2/TrustSection";
import Footer from "@/components/v2/Footer";
import BottomNav from "@/components/v2/BottomNav";
import Search from "@/components/v2/Search";

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

type HomeClientProps = {
  initialProperties: Property[];
  initialReviews: Review[];
};

export default function HomeClient({
  initialProperties,
  initialReviews,
}: HomeClientProps) {
  return (
    <main className="bg-[#F8F6F1] text-[#1D2942]">
      <Header />
      <Hero totalCount={initialProperties.length} />
      
      <PropertyGrid properties={initialProperties} />
      <PhotoReviews reviews={initialReviews} />
      <TrustSection />
      <Footer />
      <BottomNav />
    </main>
  );
}