import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const error = requestUrl.searchParams.get("error");
  const errorDescription = requestUrl.searchParams.get("error_description");

  if (error) {
    console.error("카카오 OAuth 오류:", error, errorDescription);

    const loginUrl = new URL("/admin/login", requestUrl.origin);
    loginUrl.searchParams.set(
      "error",
      errorDescription ?? "카카오 로그인에 실패했습니다."
    );

    return NextResponse.redirect(loginUrl);
  }

  if (!code) {
    const loginUrl = new URL("/admin/login", requestUrl.origin);
    loginUrl.searchParams.set("error", "인증 코드가 전달되지 않았습니다.");

    return NextResponse.redirect(loginUrl);
  }

  const supabase = await createClient();

  const { error: exchangeError } =
    await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) {
    console.error("세션 교환 오류:", exchangeError);

    const loginUrl = new URL("/admin/login", requestUrl.origin);
    loginUrl.searchParams.set(
      "error",
      "로그인 세션을 생성하지 못했습니다."
    );

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.redirect(new URL("/admin", requestUrl.origin));
}