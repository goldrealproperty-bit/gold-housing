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
    if (!window.kakao || !window.kakao.maps) return;

    window.kakao.maps.load(() => {
      const geocoder = new window.kakao.maps.services.Geocoder();

      geocoder.addressSearch(address, (result: any[], status: string) => {
        if (status !== window.kakao.maps.services.Status.OK || !result[0]) {
          return;
        }

        const lat = Number(result[0].y);
        const lng = Number(result[0].x);
        const coords = new window.kakao.maps.LatLng(lat, lng);

        const map = new window.kakao.maps.Map(mapRef.current, {
          center: coords,
          level: 3,
        });

        const marker = new window.kakao.maps.Marker({
          map,
          position: coords,
        });

        const infowindow = new window.kakao.maps.InfoWindow({
          content: `<div style="padding:8px 12px;font-size:13px;white-space:nowrap;">${
            title || "매물 위치"
          }</div>`,
        });

        infowindow.open(map, marker);
      });
    });
  }, [address, title]);

  if (!address) {
    return (
      <div className="rounded-3xl bg-gray-100 p-6 text-sm text-gray-500">
        등록된 주소가 없습니다.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-5 py-4">
        <h2 className="text-lg font-bold text-gray-900">위치</h2>
        <p className="mt-1 text-sm text-gray-500">{address}</p>
      </div>

      <div ref={mapRef} className="h-[320px] w-full bg-gray-100" />
    </div>
  );
}