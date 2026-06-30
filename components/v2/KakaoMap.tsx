"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    kakao: any;
  }
}

type Props = {
  address?: string | null;
  title?: string | null;
};

export default function KakaoMap({ address }: Props) {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const appKey = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;

    if (!mapRef.current) return;

    if (!appKey) {
      console.error("카카오 지도 키가 없습니다.");
      return;
    }

    const loadMap = () => {
      window.kakao.maps.load(() => {
        if (!mapRef.current) return;

        const defaultCoords = new window.kakao.maps.LatLng(
          37.533,
          126.65
        );

        const map = new window.kakao.maps.Map(mapRef.current, {
          center: defaultCoords,
          level: 4,
        });

        const marker = new window.kakao.maps.Marker({
          map,
          position: defaultCoords,
        });

        map.relayout();

        if (!address) return;

        const geocoder = new window.kakao.maps.services.Geocoder();

        geocoder.addressSearch(address, (result: any[], status: string) => {
          if (status === window.kakao.maps.services.Status.OK && result[0]) {
            const coords = new window.kakao.maps.LatLng(
              Number(result[0].y),
              Number(result[0].x)
            );

            map.setCenter(coords);
            marker.setPosition(coords);

            setTimeout(() => {
              map.relayout();
              map.setCenter(coords);
            }, 300);
          } else {
            console.log("주소 검색 실패:", address, status);
          }
        });
      });
    };

    if (window.kakao && window.kakao.maps) {
      loadMap();
      return;
    }

    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false&libraries=services`;
    script.async = true;
    script.onload = loadMap;
    document.head.appendChild(script);
  }, [address]);

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
      <div ref={mapRef} className="h-[320px] w-full bg-gray-100" />
    </div>
  );
}