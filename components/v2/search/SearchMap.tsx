"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    kakao: any;
  }
}

type Property = {
  id: number;
  title: string | null;
  address: string | null;
  location: string | null;
  price: string | null;
};

export default function SearchMap({ properties }: { properties: Property[] }) {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const appKey = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;
    if (!appKey || !mapRef.current) return;

    const loadMap = () => {
      window.kakao.maps.load(() => {
        if (!mapRef.current) return;

        const map = new window.kakao.maps.Map(mapRef.current, {
          center: new window.kakao.maps.LatLng(37.533, 126.65),
          level: 7,
        });

        const geocoder = new window.kakao.maps.services.Geocoder();
        const bounds = new window.kakao.maps.LatLngBounds();

        const clusterer = new window.kakao.maps.MarkerClusterer({
          map,
          averageCenter: true,
          minLevel: 6,
          disableClickZoom: false,
          styles: [
            {
              width: "58px",
              height: "58px",
              background: "#facc15",
              border: "3px solid #111827",
              borderRadius: "999px",
              color: "#111827",
              textAlign: "center",
              fontWeight: "900",
              fontSize: "15px",
              lineHeight: "52px",
              boxShadow: "0 10px 22px rgba(0,0,0,.22)",
            },
          ],
          calculator: [2, 5, 10, 20],
          texts: (count: number) => `${count}개`,
        });

        const normalMarkers: any[] = [];
        let successCount = 0;

        properties.forEach((property) => {
          const address = property.address || property.location;
          if (!address) return;

          geocoder.addressSearch(address, (result: any[], status: string) => {
            if (status !== window.kakao.maps.services.Status.OK || !result[0]) {
              return;
            }

            const coords = new window.kakao.maps.LatLng(
              Number(result[0].y),
              Number(result[0].x)
            );

            bounds.extend(coords);
            successCount += 1;

            const marker = new window.kakao.maps.Marker({
              position: coords,
            });

            const priceContent = `
              <a href="/properties/${property.id}"
                style="
                  display:block;
                  padding:8px 12px;
                  border-radius:999px;
                  background:#facc15;
                  color:#111827;
                  font-size:13px;
                  font-weight:900;
                  text-decoration:none;
                  box-shadow:0 8px 18px rgba(0,0,0,.18);
                  white-space:nowrap;
                  border:2px solid #111827;
                "
              >
                ${property.price || "문의"}
              </a>
            `;

            const overlay = new window.kakao.maps.CustomOverlay({
              position: coords,
              content: priceContent,
              yAnchor: 1,
            });

            marker.__priceOverlay = overlay;
            normalMarkers.push(marker);
            clusterer.addMarker(marker);

            const renderByZoom = () => {
              const level = map.getLevel();

              normalMarkers.forEach((item) => {
                if (item.__priceOverlay) {
                  item.__priceOverlay.setMap(level < 6 ? map : null);
                }
              });
            };

            window.kakao.maps.event.addListener(
              map,
              "zoom_changed",
              renderByZoom
            );

            if (successCount === 1) {
              map.setCenter(coords);
            }

            if (successCount > 1) {
              map.setBounds(bounds);
            }

            setTimeout(() => {
              map.relayout();
              renderByZoom();
            }, 300);
          });
        });
      });
    };

    if (
      window.kakao &&
      window.kakao.maps &&
      window.kakao.maps.services &&
      window.kakao.maps.MarkerClusterer
    ) {
      loadMap();
      return;
    }

    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false&libraries=services,clusterer`;
    script.async = true;
    script.onload = loadMap;
    document.head.appendChild(script);
  }, [properties]);

  return (
    <div className="sticky top-5 overflow-hidden rounded-[2rem] bg-white shadow-xl">
      <div ref={mapRef} className="h-[420px] w-full bg-gray-100 lg:h-[720px]" />
    </div>
  );
}