import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { authService, stravaAuthProvider } from "@/services/auth";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get("code");

  if (!code) {
    return new Response("Authorization code not provided", {
      status: 400,
    });
  }

  const authentication = authService(stravaAuthProvider());

  const token = await authentication(code);

  (await cookies()).set("access_token", token, {
    httpOnly: true,
    secure: true,
    path: "/",
  });

  return NextResponse.redirect(new URL("/activities"));
}
