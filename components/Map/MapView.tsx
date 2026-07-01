"use client";

import { useCallback, useEffect, useRef } from "react";
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
  keyword?: string;
};

type MapItem = {
  property: Property;
  position: any;
  address: string;
};

function getSafeRegion(address: string, level: number) {
  const parts = address
    .trim()
    .split(/\s+/)
    .filter((part) => !/[0-9]/.test(part));

  const city =
    parts.find((p) => p.endsWith("시") || p.endsWith("도")) || parts[0] || "지역";

  const gu =
    parts.find((p) => p.endsWith("구") || p.endsWith("군")) || "";

  const dong =
    parts.find(
      (p) => p.endsWith("동") || p.endsWith("읍") || p.endsWith("면") || p.endsWith("리")
    ) || "";

  if (level >= 10) return city;
  if (level >= 7) return gu || city;
  if (level >= 5) return dong || gu || city;

  return "";
}

function createRegionOverlay({
  kakao,
  map,
  position,
  name,
  count,
}: {
  kakao: any;
  map: any;
  position: any;
  name: string;
  count: number;
}) {
  const content = `
    <div style="
      min-width:74px;
      padding:11px 15px;
      border-radius:999px;
      background:#facc15;
      border:4px solid #111827;
      color:#111827;
      font-size:15px;
      font-weight:900;
      text-align:center;
      box-shadow:0 10px 22px rgba(0,0,0,.28);
      white-space:nowrap;
    ">
      ${name}<br />
      <span style="font-size:14px;">${count}개</span>
    </div>
  `;

  const overlay = new kakao.maps.CustomOverlay({
    position,
    content,
    yAnchor: 1,
  });

  overlay.setMap(map);
  return overlay;
}

export default function MapView({ properties, loading, keyword }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  const drawMap = useCallback(() => {
    const kakaoMapKey = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;
    if (loading || !kakaoMapKey || !mapRef.current) return;

    const run = () => {
      if (!window.kakao?.maps || !mapRef.current) return;

      window.kakao.maps.load(() => {
        if (!mapRef.current) return;

        mapRef.current.innerHTML = "";

        const map = new window.kakao.maps.Map(mapRef.current, {
          center: new window.kakao.maps.LatLng(36.5, 127.8),
          level: 13,
        });

        const geocoder = new window.kakao.maps.services.Geocoder();
        const bounds = new window.kakao.maps.LatLngBounds();

        const mapProperties = properties.filter(
          (property) => property.address || property.location
        );

        const items: MapItem[] = [];
        let finished = 0;

        const mapObjects: any[] = [];

        const clearMapObjects = () => {
          mapObjects.forEach((obj) => {
            obj?.setMap?.(null);
            obj?.circle?.setMap?.(null);
            obj?.pinOverlay?.setMap?.(null);
          });
          mapObjects.length = 0;
        };

        const render = () => {
          clearMapObjects();

          const level = map.getLevel();

          if (level < 5) {
            items.forEach((item) => {
              const markerObjects = createMapMarker({
                windowKakao: window.kakao,
                map,
                position: item.position,
                property: item.property,
                onClick: () => {
                  window.location.href = `/properties/${item.property.id}`;
                },
              });

              mapObjects.push(markerObjects);
            });

            return;
          }

          const groups = new Map<
            string,
            { name: string; count: number; lat: number; lng: number }
          >();

          items.forEach((item) => {
            const name = getSafeRegion(item.address, level);
            if (!name) return;

            const lat = item.position.getLat();
            const lng = item.position.getLng();

            const prev = groups.get(name);

            if (prev) {
              prev.count += 1;
              prev.lat += lat;
              prev.lng += lng;
            } else {
              groups.set(name, {
                name,
                count: 1,
                lat,
                lng,
              });
            }
          });

          groups.forEach((group) => {
            const position = new window.kakao.maps.LatLng(
              group.lat / group.count,
              group.lng / group.count
            );

            const overlay = createRegionOverlay({
              kakao: window.kakao,
              map,
              position,
              name: group.name,
              count: group.count,
            });

            mapObjects.push(overlay);
          });
        };

        if (mapProperties.length === 0) return;

        mapProperties.forEach((property) => {
          const address = property.address || property.location || "";

          geocoder.addressSearch(address, (result: any[], status: string) => {
            finished += 1;

            if (status === window.kakao.maps.services.Status.OK && result[0]) {
              const position = new window.kakao.maps.LatLng(
                Number(result[0].y),
                Number(result[0].x)
              );

              items.push({
                property,
                position,
                address,
              });

              bounds.extend(position);
            }

            if (finished === mapProperties.length) {
              if (items.length === 1) {
                map.setCenter(items[0].position);
                map.setLevel(5);
              }

              if (items.length > 1) {
                map.setBounds(bounds);
              }

              const searchKeyword = (keyword || "").trim();

              if (searchKeyword) {
                geocoder.addressSearch(
                  searchKeyword,
                  (result: any[], status: string) => {
                    if (
                      status === window.kakao.maps.services.Status.OK &&
                      result[0]
                    ) {
                      const searchPosition = new window.kakao.maps.LatLng(
                        Number(result[0].y),
                        Number(result[0].x)
                      );

                      map.setCenter(searchPosition);
                      map.setLevel(5);
                    }

                    setTimeout(render, 300);
                  }
                );
              } else {
                setTimeout(render, 300);
              }
            }
          });
        });

        window.kakao.maps.event.addListener(map, "zoom_changed", render);

        setTimeout(() => {
          map.relayout();
          render();
        }, 700);
      });
    };

    const existingScript = document.getElementById("kakao-map-script");

    if (existingScript && window.kakao?.maps) {
      run();
      return;
    }

    if (existingScript && !window.kakao?.maps) {
      setTimeout(run, 1000);
      return;
    }

    const script = document.createElement("script");
    script.id = "kakao-map-script";
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoMapKey}&autoload=false&libraries=services`;
    script.async = false;
    script.onload = () => setTimeout(run, 300);

    document.head.appendChild(script);
  }, [properties, loading, keyword]);

  useEffect(() => {
    const timer = setTimeout(drawMap, 500);
    return () => clearTimeout(timer);
  }, [drawMap]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-[2rem] bg-gray-200">
      <div ref={mapRef} className="h-full w-full" />
    </div>
  );
}