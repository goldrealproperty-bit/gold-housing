import { Property } from "./mapTypes";
import { getFeatureStyle } from "./mapUtils";

export function createMapInfoWindowContent(property: Property) {
  const features = property.features || [];

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

  return `
    <div style="width:270px;overflow:hidden;border-radius:18px;background:white;box-shadow:0 12px 30px rgba(0,0,0,0.18);font-family:Arial,sans-serif;">
      <img src="${imageUrl}" style="width:100%;height:140px;object-fit:cover;display:block;" />

      <div style="padding:14px;">
        <div style="margin-bottom:7px;">${featureHtml}</div>

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
  `;
}
