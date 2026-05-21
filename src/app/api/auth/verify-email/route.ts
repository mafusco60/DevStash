import { NextResponse } from "next/server";

import { consumeVerificationToken } from "@/lib/email-verification";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const token = requestUrl.searchParams.get("token");
  const base = process.env.NEXT_PUBLIC_APP_URL ?? requestUrl.origin;

  const redirectTo = (status: "success" | "expired" | "invalid") => {
    const url = new URL("/verify-email/result", base);
    url.searchParams.set("status", status);
    return NextResponse.redirect(url);
  };

  if (!token) return redirectTo("invalid");

  try {
    const result = await consumeVerificationToken(token);
    if (!result.ok) return redirectTo(result.reason);
    return redirectTo("success");
  } catch (error) {
    console.error("[auth/verify-email] unexpected error", error);
    return redirectTo("invalid");
  }
}
