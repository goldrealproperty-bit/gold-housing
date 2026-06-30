"use client";

import { useState } from "react";

type AdminLoginProps = {
  adminPassword: string;
  onSuccess: () => void;
};

export default function AdminLogin({
  adminPassword,
  onSuccess,
}: AdminLoginProps) {
  const [password, setPassword] = useState("");

  function login(e: React.FormEvent) {
    e.preventDefault();

    if (password.trim() === adminPassword) {
      onSuccess();
      return;
    }

    alert("비밀번호가 틀렸습니다.");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6">
      <form
        onSubmit={login}
        className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl"
      >
        <h1 className="text-3xl font-black">관리자 로그인</h1>

        <input
          type="tel"
          inputMode="numeric"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-8 w-full rounded-xl border p-4 text-xl font-black outline-none"
          placeholder="관리자 비밀번호"
          autoComplete="off"
        />

        <button
          type="submit"
          className="mt-5 w-full rounded-xl bg-yellow-400 py-4 font-black text-black"
        >
          로그인
        </button>
      </form>
    </main>
  );
}