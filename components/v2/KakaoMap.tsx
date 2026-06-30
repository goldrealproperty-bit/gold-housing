"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    kakao: any;
  }
}

type Props = {
  address?: string | null;
};

export default function KakaoMap({ address }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const appKey = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;

    if (!appKey || !mapRef.current || !address) return;

    const initMap = () => {
      window.kakao.maps.load(() => {
        const geocoder = new window.kakao.maps.services.Geocoder();

        geocoder.addressSearch(address, (result: any[], status: string) => {
          if (
            status !== window.kakao.maps.services.Status.OK ||
            !result.length
          ) {
            console.log("주소 검색 실패");
            return;
          }

          const lat = Number(result[0].y);
          const lng = Number(result[0].x);

          // ===== 실제 위치 보호 =====

          // 150~250m 정도 랜덤 이동
          const angle = Math.random() * Math.PI * 2;
          const distance = 150 + Math.random() * 100;

          const dLat = (distance * Math.cos(angle)) / 111320;
          const dLng =
            (distance * Math.sin(angle)) /
            (111320 * Math.cos((lat * Math.PI) / 180));

          const fakeLat = lat + dLat;
          const fakeLng = lng + dLng;

          const center = new window.kakao.maps.LatLng(fakeLat, fakeLng);

          const map = new window.kakao.maps.Map(mapRef.current, {
            center,
            level: 4,
          });

          new window.kakao.maps.Circle({
            center,
            radius: 250,
            strokeWeight: 2,
            strokeColor: "#FFD400",
            strokeOpacity: 0.95,
            strokeStyle: "solid",

            fillColor: "#FFD400",
            fillOpacity: 0.18,

            map,
          });

          map.relayout();
          map.setCenter(center);
        });
      });
    };

    if (window.kakao && window.kakao.maps) {
      initMap();
      return;
    }

    const script = document.createElement("script");

    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false&libraries=services`;

    script.async = true;

    script.onload = initMap;

    document.head.appendChild(script);
  }, [address]);

  return (
    <div className="overflow-hidden rounded-[2rem] shadow-sm border border-gray-100 bg-white">
      <div
        ref={mapRef}
        className="h-[320px] w-full"
      />
    </div>
  );
}