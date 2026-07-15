"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleKakaoLogin() {
    try {
      setLoading(true);
      setErrorMessage("");

      const supabase = createClient();

      const redirectTo = `${window.location.origin}/auth/callback`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "kakao",
        options: {
          redirectTo,
        },
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("카카오 로그인 오류:", error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "카카오 로그인 중 오류가 발생했습니다."
      );

      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background:
          "linear-gradient(135deg, #111111 0%, #252525 55%, #111111 100%)",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "420px",
          padding: "40px 28px",
          borderRadius: "24px",
          backgroundColor: "#ffffff",
          boxShadow: "0 24px 70px rgba(0, 0, 0, 0.35)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: "72px",
            height: "72px",
            margin: "0 auto 20px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#111111",
            color: "#d6ad60",
            fontSize: "28px",
            fontWeight: 900,
          }}
        >
          G
        </div>

        <h1
          style={{
            margin: 0,
            color: "#111111",
            fontSize: "28px",
            fontWeight: 900,
          }}
        >
          골드하우징 관리자
        </h1>

        <p
          style={{
            margin: "12px 0 30px",
            color: "#666666",
            fontSize: "15px",
            lineHeight: 1.6,
          }}
        >
          등록된 관리자 카카오 계정으로 로그인해 주세요.
        </p>

        <button
          type="button"
          onClick={handleKakaoLogin}
          disabled={loading}
          style={{
            width: "100%",
            minHeight: "54px",
            border: 0,
            borderRadius: "14px",
            backgroundColor: loading ? "#d8ca6a" : "#fee500",
            color: "#191919",
            fontSize: "16px",
            fontWeight: 800,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "카카오 로그인 연결 중..." : "카카오로 관리자 로그인"}
        </button>

        {errorMessage && (
          <p
            style={{
              margin: "18px 0 0",
              color: "#d32f2f",
              fontSize: "14px",
              lineHeight: 1.5,
            }}
          >
            {errorMessage}
          </p>
        )}

        <p
          style={{
            margin: "24px 0 0",
            color: "#999999",
            fontSize: "12px",
            lineHeight: 1.6,
          }}
        >
          허가되지 않은 카카오 계정은 관리자 페이지에 접근할 수 없습니다.
        </p>
      </section>
    </main>
  );
}