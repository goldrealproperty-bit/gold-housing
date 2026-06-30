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

export default function KakaoMap({ address, title }: Props) {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!address || !mapRef.current) return;

    let timer: NodeJS.Timeout;

    const initMap = () => {
      if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services) {
        timer = setTimeout(initMap, 300);
        return;
      }

      window.kakao.maps.load(() => {
        const geocoder = new window.kakao.maps.services.Geocoder();

        geocoder.addressSearch(address, (result: any[], status: string) => {
          if (status !== window.kakao.maps.services.Status.OK || !result[0]) {
            return;
          }

          const coords = new window.kakao.maps.LatLng(
            Number(result[0].y),
            Number(result[0].x)
          );

          const map = new window.kakao.maps.Map(mapRef.current, {
            center: coords,
            level: 3,
          });

          new window.kakao.maps.Marker({
            map,
            position: coords,
          });

          setTimeout(() => {
            map.relayout();
            map.setCenter(coords);
          }, 300);
        });
      });
    };

    initMap();

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [address, title]);

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
      <div ref={mapRef} className="h-[320px] w-full bg-gray-100" />
    </div>
  );
}