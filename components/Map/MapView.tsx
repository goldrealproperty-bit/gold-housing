"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Property } from "./mapTypes";
import { createMapMarker } from "./MapMarker";

declare global {
  interface Window {
    kakao: any;
  }
}

type MapViewProps = {
  properties: Property[];
  loading: boolean;
  selectedFilter: string;
};

export default function MapView({ properties, loading }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapError, setMapError] = useState("");
  const [mapStatus, setMapStatus] = useState("지도 준비 중");
  const [retryKey, setRetryKey] = useState(0);

  const drawMap = useCallback(() => {
    const kakaoMapKey = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;

    if (loading) return;

    if (!kakaoMapKey) {
      setMapError("NEXT_PUBLIC_KAKAO_MAP_KEY가 없습니다.");
      return;
    }

    if (!mapRef.current) {
      setMapStatus("지도 영역 대기 중");
      return;
    }

    setMapError("");
    setMapStatus("지도 실행 중");

    const run = () => {
      if (!window.kakao?.maps || !mapRef.current) {
        setMapError("카카오맵 객체를 찾지 못했습니다.");
        return;
      }

      window.kakao.maps.load(() => {
        if (!mapRef.current) return;

        mapRef.current.innerHTML = "";

        const map = new window.kakao.maps.Map(mapRef.current, {
          center: new window.kakao.maps.LatLng(37.4563, 126.7052),
          level: 8,
        });

        setTimeout(() => {
          window.kakao.maps.event.trigger(map, "resize");
          map.relayout();
        }, 700);

        const geocoder = new window.kakao.maps.services.Geocoder();
        const bounds = new window.kakao.maps.LatLngBounds();

        const mapProperties = properties.filter(
          (property) => property.address || property.location
        );

        if (mapProperties.length === 0) {
          setMapError("주소가 있는 매물이 없습니다.");
          return;
        }

        let successCount = 0;
        let failCount = 0;

        setMapStatus(`주소 변환 중: ${mapProperties.length}개`);

        mapProperties.forEach((property) => {
          const address = property.address || property.location || "";

          geocoder.addressSearch(address, (result: any, status: any) => {
            if (status !== window.kakao.maps.services.Status.OK) {
              failCount += 1;
              setMapStatus(`주소 실패 ${failCount}개 / 성공 ${successCount}개`);
              return;
            }

            const position = new window.kakao.maps.LatLng(
              result[0].y,
              result[0].x
            );

            bounds.extend(position);
            successCount += 1;

            createMapMarker({
              windowKakao: window.kakao,
              map,
              position,
              property,
              onClick: () => {
                window.location.href = `/properties/${property.id}`;
              },
            });

            setMapStatus(`지도 표시 성공: ${successCount}개`);

            if (successCount === 1) {
              map.setCenter(position);
              map.setLevel(5);
            }

            if (successCount > 1) {
              map.setBounds(bounds);
            }
          });
        });
      });
    };

    const existingScript = document.getElementById("kakao-map-script");

    if (existingScript && window.kakao?.maps) {
      run();
      return;
    }

    if (existingScript && !window.kakao?.maps) {
      setMapStatus("카카오맵 스크립트 대기 중");
      setTimeout(run, 1000);
      return;
    }

    setMapStatus("카카오맵 스크립트 로딩 중");

    const script = document.createElement("script");
    script.id = "kakao-map-script";
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoMapKey}&autoload=false&libraries=services`;
    script.async = false;

    script.onload = () => {
      setMapStatus("카카오맵 스크립트 로드 완료");
      setTimeout(run, 300);
    };

    script.onerror = () => {
      setMapError("카카오맵 스크립트 로드 실패. 카카오 도메인 등록을 확인해주세요.");
    };

    document.head.appendChild(script);
  }, [properties, loading]);

  useEffect(() => {
    const timer = setTimeout(() => {
      drawMap();
    }, 500);

    return () => clearTimeout(timer);
  }, [drawMap, retryKey]);

  return (
    <div className="relative h-[360px] w-full overflow-hidden rounded-[2rem] bg-gray-200 md:h-[560px]">
      <div ref={mapRef} className="h-full w-full" />

      <div className="absolute left-3 top-3 z-20 rounded-2xl bg-white/90 px-4 py-3 text-xs font-black text-slate-900 shadow-lg">
        {mapError ? `지도 오류: ${mapError}` : mapStatus}
      </div>

      <button
        type="button"
        onClick={() => setRetryKey((prev) => prev + 1)}
        className="absolute bottom-3 left-3 right-3 z-20 rounded-2xl bg-yellow-400 py-4 text-sm font-black text-black shadow-lg md:hidden"
      >
        지도 다시 불러오기
      </button>
    </div>
  );
}