"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    kakao: any;
  }
}

export default function KakaoMap() {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const appKey = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;

    console.log("KAKAO KEY:", appKey);

    if (!mapRef.current || !appKey) return;

    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false`;
    script.async = true;

    script.onload = () => {
      console.log("KAKAO SCRIPT LOADED", window.kakao);

      window.kakao.maps.load(() => {
        console.log("KAKAO MAPS LOADED");

        const coords = new window.kakao.maps.LatLng(37.5665, 126.978);

        const map = new window.kakao.maps.Map(mapRef.current, {
          center: coords,
          level: 3,
        });

        new window.kakao.maps.Marker({
          map,
          position: coords,
        });
      });
    };

    document.head.appendChild(script);
  }, []);

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
      <div ref={mapRef} className="h-[320px] w-full bg-gray-200" />
    </div>
  );
}