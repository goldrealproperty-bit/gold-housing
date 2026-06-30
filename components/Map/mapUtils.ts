import { PinInfo, Property } from "./mapTypes";

export const MAP_FILTERS = [
  "전체",
  "2룸",
  "3룸",
  "4룸",
  "테라스",
  "복층",
  "무입가능",
  "역세권",
];

export function getFeatureStyle(feature: string) {
  if (feature.includes("무입")) return "background:#10b981;color:white;";
  if (feature.includes("역세권")) return "background:#6366f1;color:white;";
  if (feature.includes("엘리베이터")) return "background:#111827;color:white;";
  if (feature.includes("주차")) return "background:#3b82f6;color:white;";
  if (feature.includes("테라스")) return "background:#ef4444;color:white;";
  if (feature.includes("복층")) return "background:#ef4444;color:white;";

  return "background:#f3f4f6;color:#374151;";
}

export function getPinInfo(property: Property): PinInfo {
  const features = property.features || [];

  if (features.some((item) => item.includes("테라스"))) {
    return { label: "테라스", color: "#ef4444", textColor: "white" };
  }

  if (features.some((item) => item.includes("복층"))) {
    return { label: "복층", color: "#ef4444", textColor: "white" };
  }

  if (property.room_type === "2룸") {
    return { label: "2룸", color: "#22c55e", textColor: "white" };
  }

  if (property.room_type === "4룸") {
    return { label: "4룸", color: "#8b5cf6", textColor: "white" };
  }

  return { label: "3룸", color: "#facc15", textColor: "#111827" };
}

export function matchMapFilter(property: Property, filter: string) {
  const features = property.features || [];

  if (filter === "전체") return true;
  if (filter === "2룸") return property.room_type === "2룸";
  if (filter === "3룸") return property.room_type === "3룸";
  if (filter === "4룸") return property.room_type === "4룸";
  if (filter === "테라스") return features.some((item) => item.includes("테라스"));
  if (filter === "복층") return features.some((item) => item.includes("복층"));
  if (filter === "무입가능") return features.some((item) => item.includes("무입"));
  if (filter === "역세권") return features.some((item) => item.includes("역세권"));

  return true;
}
