"use client";

import { useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

declare global {
  interface Window {
    kakao: any;
  }
}

type Property = {
  id: number;
  title: string | null;
  location: string | null;
  address: string | null;
  price: string | null;
  deposit: string | null;
  image: string | null;
  features: string[] | null;
  room_type: string | null;
};

function getFeatureStyle(feature: string) {
  if (feature.includes("대표추천")) return "background:#facc15;color:#111827;";
  if (feature.includes("인기매물")) return "background:#ef4444;color:white;";
  if (feature.includes("급매")) return "background:#f97316;color:white;";
  if (feature.includes("무입")) return "background:#10b981;color:white;";
  if (feature.includes("역세권")) return "background:#6366f1;color:white;";
  return "background:#f3f4f6;color:#374151;";
}

function getPinInfo(property: Property) {
  const features = property.features || [];

  if (features.some((item) => item.includes("테라스"))) {
    return {
      label: "테라스",
      color: "#ef4444",
      textColor: "white",
    };
  }

  if (features.some((item) => item.includes("복층"))) {
    return {
      label: "복층",
      color: "#ef4444",
      textColor: "white",
    };
  }

  if (property.room_type === "2룸") {
    return {
      label: "2룸",
      color: "#22c55e",
      textColor: "white",
    };
  }

  if (property.room_type === "4룸") {
    return {
      label: "4룸",
      color: "#8b5cf6",
      textColor: "white",
    };
  }

  return {
    label: "3룸",
    color: "#facc15",
    textColor: "#111827",
  };
}

export default function MapSection() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const kakaoMapKey = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;
    if (!kakaoMapKey || !mapRef.current) return;

    async function fetchProperties() {
      const { data, error } = await supabase
        .from("properties")
        .select(
          "id, title, location, address, price, deposit, image, features, room_type"
        )
        .not("address", "is", null);

      if (error) {
        console.error("매물 불러오기 실패:", error);
        return [];
      }

      return data || [];
    }

    function loadMap(properties: Property[]) {
      window.kakao.maps.load(() => {
        if (!mapRef.current) return;

        const map = new window.kakao.maps.Map(mapRef.current, {
          center: new window.kakao.maps.LatLng(37.4563, 126.7052),
          level: 8,
        });

        const geocoder = new window.kakao.maps.services.Geocoder();
        const bounds = new window.kakao.maps.LatLngBounds();

        let openedInfoWindow: any = null;
        let successCount = 0;

        function closeInfoWindow() {
          if (openedInfoWindow) {
            openedInfoWindow.close();
            openedInfoWindow = null;
          }
        }

        window.kakao.maps.event.addListener(map, "click", closeInfoWindow);

        properties.forEach((property) => {
          const address = property.address || property.location || "";
          if (!address) return;

          geocoder.addressSearch(address, (result: any, status: any) => {
            if (status !== window.kakao.maps.services.Status.OK) return;

            const position = new window.kakao.maps.LatLng(
              result[0].y,
              result[0].x
            );

            bounds.extend(position);
            successCount += 1;

            const pin = getPinInfo(property);
            const features = property.features || [];
            const isFeatured = features.some((item) =>
              item.includes("대표추천")
            );
            const isNoDeposit = features.some((item) => item.includes("무입"));

            const circle = new window.kakao.maps.Circle({
              center: position,
              radius: 250,
              strokeWeight: 2,
              strokeColor: pin.color,
              strokeOpacity: 0.75,
              fillColor: pin.color,
              fillOpacity: 0.13,
            });

            circle.setMap(map);

            const imageUrl =
              property.image ||
              "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=500&auto=format&fit=crop";

            const featureHtml = features
              .slice(0, 3)
              .map(
                (feature) => `
                  <span style="
                    display:inline-block;
                    margin:0 4px 6px 0;
                    padding:5px 8px;
                    border-radius:999px;
                    font-size:11px;
                    font-weight:800;
                    ${getFeatureStyle(feature)}
                  ">
                    ${feature}
                  </span>
                `
              )
              .join("");

            const hiddenMarker = new window.kakao.maps.Marker({
              position,
              map,
              opacity: 0,
            });

            const infoWindow = new window.kakao.maps.InfoWindow({
              removable: true,
              content: `
                <div style="width:270px;overflow:hidden;border-radius:18px;background:white;box-shadow:0 12px 30px rgba(0,0,0,0.18);font-family:Arial,sans-serif;">
                  <img src="${imageUrl}" style="width:100%;height:140px;object-fit:cover;display:block;" />

                  <div style="padding:14px;">
                    <div style="margin-bottom:7px;">
                      ${featureHtml}
                    </div>

                    <strong style="display:block;font-size:17px;line-height:1.35;margin-bottom:7px;color:#111827;">
                      ${property.title || "매물"}
                    </strong>

                    <p style="margin:0 0 6px;color:#6b7280;font-size:13px;line-height:1.4;">
                      📍 ${property.location || "대략 위치"}
                    </p>

                    <p style="margin:0 0 4px;font-size:18px;font-weight:900;color:#1d4ed8;">
                      ${property.price || "가격 문의"}
                    </p>

                    <p style="margin:0 0 12px;font-size:13px;font-weight:700;color:#374151;">
                      실입주금 ${property.deposit || "문의"}
                    </p>

                    <a href="/properties/${property.id}" style="display:block;text-align:center;background:#facc15;color:#111827;padding:11px;border-radius:12px;font-weight:900;text-decoration:none;">
                      상세보기 →
                    </a>
                  </div>
                </div>
              `,
            });

            function openInfoWindow() {
              closeInfoWindow();
              infoWindow.open(map, hiddenMarker);
              openedInfoWindow = infoWindow;
            }

            const pinButton = document.createElement("button");
            pinButton.innerHTML = `
              <div style="
                position:relative;
                display:flex;
                flex-direction:column;
                align-items:center;
                transform:translateY(-8px);
              ">
                ${
                  isFeatured
                    ? `<div style="
                        position:absolute;
                        top:-18px;
                        font-size:18px;
                        line-height:1;
                        filter:drop-shadow(0 2px 4px rgba(0,0,0,.3));
                      ">⭐</div>`
                    : ""
                }

                <div style="
                  cursor:pointer;
                  min-width:58px;
                  padding:9px 13px;
                  border-radius:999px;
                  background:${pin.color};
                  color:${pin.textColor};
                  border:4px solid ${isNoDeposit ? "#10b981" : "white"};
                  box-shadow:0 10px 24px rgba(0,0,0,0.28);
                  font-size:14px;
                  font-weight:900;
                  white-space:nowrap;
                ">
                  ${pin.label}
                </div>

                <div style="
                  width:0;
                  height:0;
                  border-left:8px solid transparent;
                  border-right:8px solid transparent;
                  border-top:10px solid ${pin.color};
                  margin-top:-1px;
                  filter:drop-shadow(0 4px 3px rgba(0,0,0,.2));
                "></div>
              </div>
            `;

            pinButton.style.cssText = `
              border:0;
              background:transparent;
              padding:0;
              cursor:pointer;
            `;

            pinButton.addEventListener("click", (e) => {
              e.preventDefault();
              e.stopPropagation();
              openInfoWindow();
            });

            const pinOverlay = new window.kakao.maps.CustomOverlay({
              position,
              yAnchor: 1.15,
              clickable: true,
              content: pinButton,
            });

            pinOverlay.setMap(map);

            window.kakao.maps.event.addListener(circle, "click", openInfoWindow);

            if (successCount > 0) map.setBounds(bounds);
          });
        });
      });
    }

    async function init() {
      const properties = await fetchProperties();
      const existingScript = document.getElementById("kakao-map-script");

      if (existingScript && window.kakao?.maps) {
        loadMap(properties);
        return;
      }

      const script = document.createElement("script");
      script.id = "kakao-map-script";
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoMapKey}&autoload=false&libraries=services`;
      script.async = true;
      script.onload = () => loadMap(properties);
      script.onerror = () => console.error("카카오맵 스크립트 로드 실패");

      document.head.appendChild(script);
    }

    init();
  }, []);

  return (
    <section id="map" className="bg-slate-950 px-6 py-24 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-4xl font-black md:text-5xl">
              🗺 지도에서 매물 찾기
            </h2>

            <p className="mt-4 text-gray-300">
              정확한 주소는 보호하고, 대략적인 위치만 표시합니다.
            </p>
          </div>

          <div className="rounded-3xl bg-white/10 p-4 text-sm font-bold text-gray-200 backdrop-blur">
            <div className="grid grid-cols-2 gap-x-5 gap-y-2">
              <span>🟢 2룸</span>
              <span>🟡 3룸</span>
              <span>🟣 4룸</span>
              <span>🔴 테라스/복층</span>
              <span>⭐ 대표추천</span>
              <span>💚 무입가능</span>
            </div>
          </div>
        </div>

        <div
          ref={mapRef}
          className="mt-10 h-[520px] w-full rounded-3xl bg-gray-200 shadow-2xl"
        />
      </div>
    </section>
  );
}