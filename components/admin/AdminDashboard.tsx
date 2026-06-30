"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

import { Consultation, Property, PropertyFormState } from "./adminTypes";
import ConsultationList from "./ConsultationList";
import PropertyForm from "./PropertyForm";
import PropertyList from "./PropertyList";
import ReviewManager from "./ReviewManager";

const emptyForm: PropertyFormState = {
  title: "",
  location: "",
  address: "",
  price: "",
  deposit: "",
  loan: "",
  image: "",
  images: [],
  rooms: "",
  baths: "",
  parking: "",
  elevator: "",
  desc: "",
  room_type: "3룸",
  manager_name: "임재",
  manager_phone: "010-5858-1942",
  manager_intro: "신축빌라 전문 상담을 도와드립니다.",
  manager_image: "",
  features: [],
};

type AdminTab = "properties" | "consultations" | "reviews";

export default function AdminDashboard() {
  const [tab, setTab] = useState<AdminTab>("properties");
  const [uploading, setUploading] = useState(false);

  const [properties, setProperties] = useState<Property[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<PropertyFormState>(emptyForm);

  useEffect(() => {
    fetchProperties();
    fetchConsultations();
  }, []);

  async function fetchProperties() {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      alert("매물 목록 불러오기 실패: " + error.message);
      return;
    }

    setProperties(data || []);
  }

  async function fetchConsultations() {
    const { data, error } = await supabase
      .from("consultations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("상담 목록 불러오기 실패:", error);
      return;
    }

    setConsultations(data || []);
  }

  async function uploadFile(file: File, folder: string) {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error } = await supabase.storage
      .from("property-images")
      .upload(filePath, file);

    if (error) throw error;

    const { data } = supabase.storage
      .from("property-images")
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  async function handlePropertyImages(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);

    try {
      const uploadedUrls: string[] = [];

      for (const file of files) {
        const url = await uploadFile(file, "properties");
        uploadedUrls.push(url);
      }

      const nextImages = [...form.images, ...uploadedUrls];

      setForm({
        ...form,
        image: nextImages[0] || "",
        images: nextImages,
      });

      alert("매물 사진 업로드 완료!");
    } catch (error: any) {
      alert("이미지 업로드 실패: " + error.message);
    }

    setUploading(false);
  }

  async function handleManagerImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const url = await uploadFile(file, "managers");

      setForm({
        ...form,
        manager_image: url,
      });

      alert("담당자 사진 업로드 완료!");
    } catch (error: any) {
      alert("담당자 사진 업로드 실패: " + error.message);
    }

    setUploading(false);
  }

  function removeImage(url: string) {
    const nextImages = form.images.filter((imageUrl) => imageUrl !== url);

    setForm({
      ...form,
      images: nextImages,
      image: nextImages[0] || "",
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      title: form.title,
      location: form.location,
      address: form.address,
      price: form.price,
      deposit: form.deposit,
      loan: form.loan,
      image: form.image,
      images: form.images,
      rooms: form.rooms,
      baths: form.baths,
      parking: form.parking,
      elevator: form.elevator,
      description: form.desc,
      room_type: form.room_type,
      manager_name: form.manager_name,
      manager_phone: form.manager_phone,
      manager_intro: form.manager_intro,
      manager_image: form.manager_image,
      features: form.features,
    };

    if (editingId) {
      const { error } = await supabase
        .from("properties")
        .update(payload)
        .eq("id", editingId);

      if (error) {
        alert("수정 실패: " + error.message);
        return;
      }

      alert("매물이 수정되었습니다!");
    } else {
      const { error } = await supabase.from("properties").insert([payload]);

      if (error) {
        alert("저장 실패: " + error.message);
        return;
      }

      alert("매물이 저장되었습니다!");
    }

    setForm(emptyForm);
    setEditingId(null);
    fetchProperties();
  }

  function startEdit(item: Property) {
    setEditingId(item.id);

    setForm({
      title: item.title || "",
      location: item.location || "",
      address: item.address || "",
      price: item.price || "",
      deposit: item.deposit || "",
      loan: item.loan || "",
      image: item.image || "",
      images: item.images || (item.image ? [item.image] : []),
      rooms: item.rooms || "",
      baths: item.baths || "",
      parking: item.parking || "",
      elevator: item.elevator || "",
      desc: item.description || "",
      room_type: item.room_type || "3룸",
      manager_name: item.manager_name || "임재",
      manager_phone: item.manager_phone || "010-5858-1942",
      manager_intro: item.manager_intro || "신축빌라 전문 상담을 도와드립니다.",
      manager_image: item.manager_image || "",
      features: item.features || [],
    });

    setTab("properties");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function deleteProperty(id: number) {
    const ok = confirm("정말 이 매물을 삭제하시겠습니까?");
    if (!ok) return;

    const { error } = await supabase.from("properties").delete().eq("id", id);

    if (error) {
      alert("삭제 실패: " + error.message);
      return;
    }

    alert("삭제되었습니다.");
    fetchProperties();
  }

  async function updateConsultationStatus(id: number, status: string) {
    const { error } = await supabase
      .from("consultations")
      .update({ status })
      .eq("id", id);

    if (error) {
      alert("상담 상태 변경 실패: " + error.message);
      return;
    }

    fetchConsultations();
  }

  const newCount = consultations.filter((item) => item.status === "신규").length;
  const progressCount = consultations.filter(
    (item) => item.status === "상담중"
  ).length;
  const doneCount = consultations.filter(
    (item) => item.status === "계약완료"
  ).length;

  return (
    <main className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-black">관리자 페이지</h1>
            <p className="mt-2 text-gray-500">
              매물, 상담 신청, 사진후기를 한 곳에서 관리합니다.
            </p>
          </div>

          <a
            href="/"
            className="rounded-xl bg-slate-950 px-5 py-3 text-center font-bold text-white"
          >
            홈페이지로
          </a>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl bg-white p-6 shadow">
            <p className="text-sm font-bold text-gray-500">신규 상담</p>
            <p className="mt-2 text-4xl font-black text-red-500">{newCount}</p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow">
            <p className="text-sm font-bold text-gray-500">상담중</p>
            <p className="mt-2 text-4xl font-black text-yellow-500">
              {progressCount}
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow">
            <p className="text-sm font-bold text-gray-500">계약완료</p>
            <p className="mt-2 text-4xl font-black text-emerald-500">
              {doneCount}
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            onClick={() => setTab("properties")}
            className={`rounded-2xl px-6 py-4 font-black ${
              tab === "properties"
                ? "bg-yellow-400 text-black"
                : "bg-white text-gray-700"
            }`}
          >
            🏠 매물관리
          </button>

          <button
            onClick={() => setTab("consultations")}
            className={`rounded-2xl px-6 py-4 font-black ${
              tab === "consultations"
                ? "bg-yellow-400 text-black"
                : "bg-white text-gray-700"
            }`}
          >
            📞 상담관리
          </button>

          <button
            onClick={() => setTab("reviews")}
            className={`rounded-2xl px-6 py-4 font-black ${
              tab === "reviews"
                ? "bg-yellow-400 text-black"
                : "bg-white text-gray-700"
            }`}
          >
            🖼 후기관리
          </button>
        </div>

        {tab === "properties" && (
          <>
            <PropertyForm
              form={form}
              setForm={setForm}
              editingId={editingId}
              uploading={uploading}
              onSubmit={handleSubmit}
              onCancelEdit={cancelEdit}
              onPropertyImages={handlePropertyImages}
              onManagerImage={handleManagerImage}
              onRemoveImage={removeImage}
            />

            <PropertyList
              properties={properties}
              onEdit={startEdit}
              onDelete={deleteProperty}
            />
          </>
        )}

        {tab === "consultations" && (
          <ConsultationList
            consultations={consultations}
            onRefresh={fetchConsultations}
            onUpdateStatus={updateConsultationStatus}
          />
        )}

        {tab === "reviews" && <ReviewManager />}
      </div>
    </main>
  );
}