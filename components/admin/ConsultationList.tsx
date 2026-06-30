"use client";

import { useState } from "react";
import { Consultation } from "./adminTypes";

type ConsultationListProps = {
  consultations: Consultation[];
  onRefresh: () => void;
  onUpdateStatus: (id: number, status: string) => void;
};

const STATUSES = ["신규", "상담중", "계약완료"];

function getStatusStyle(status: string | null) {
  if (status === "신규") return "bg-red-100 text-red-700";
  if (status === "상담중") return "bg-yellow-100 text-yellow-700";
  if (status === "계약완료") return "bg-emerald-100 text-emerald-700";
  return "bg-gray-100 text-gray-700";
}

function formatDate(value: string | null) {
  if (!value) return "-";

  const date = new Date(value);

  return date.toLocaleString("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ConsultationList({
  consultations,
  onRefresh,
  onUpdateStatus,
}: ConsultationListProps) {
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("전체");

  const filtered = consultations.filter((item) => {
    const text = `${item.phone || ""} ${item.area || ""} ${
      item.budget || ""
    } ${item.message || ""} ${item.property_title || ""}`;

    const keywordOk = keyword.trim() === "" || text.includes(keyword.trim());
    const statusOk = statusFilter === "전체" || item.status === statusFilter;

    return keywordOk && statusOk;
  });

  return (
    <section className="mt-10 rounded-3xl bg-white p-8 shadow-xl">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-black">📞 상담관리</h2>
          <p className="mt-2 text-gray-500">
            홈페이지에서 들어온 상담 신청을 확인합니다.
          </p>
        </div>

        <button
          onClick={onRefresh}
          className="rounded-xl bg-slate-950 px-5 py-3 font-bold text-white"
        >
          새로고침
        </button>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="rounded-xl border p-4"
          placeholder="전화번호, 지역, 예산, 문의내용 검색"
        />

        <div className="flex flex-wrap gap-2">
          {["전체", ...STATUSES].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-xl px-4 py-3 font-bold ${
                statusFilter === status
                  ? "bg-yellow-400 text-black"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-6 font-bold text-gray-600">상담 {filtered.length}건</p>

      <div className="mt-6 grid gap-4">
        {filtered.length === 0 ? (
          <div className="rounded-2xl bg-gray-50 p-10 text-center text-gray-500">
            상담 신청이 없습니다.
          </div>
        ) : (
          filtered.map((item) => (
            <div key={item.id} className="rounded-2xl border p-5">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-black ${getStatusStyle(
                        item.status
                      )}`}
                    >
                      {item.status || "신규"}
                    </span>

                    <span className="text-sm font-bold text-gray-400">
                      {formatDate(item.created_at)}
                    </span>
                  </div>

                  <p className="mt-3 text-2xl font-black">
                    {item.phone || "전화번호 없음"}
                  </p>

                  <div className="mt-3 grid gap-2 text-sm text-gray-600 md:grid-cols-2">
                    <p>
                      <b>희망지역:</b> {item.area || "-"}
                    </p>
                    <p>
                      <b>예산:</b> {item.budget || "-"}
                    </p>
                    <p className="md:col-span-2">
                      <b>문의내용:</b> {item.message || "-"}
                    </p>

                    {item.property_title && (
                      <p className="md:col-span-2">
                        <b>문의 매물:</b> {item.property_title}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {STATUSES.map((status) => (
                    <button
                      key={status}
                      onClick={() => onUpdateStatus(item.id, status)}
                      className={`rounded-xl px-4 py-3 text-sm font-bold ${
                        item.status === status
                          ? "bg-yellow-400 text-black"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
