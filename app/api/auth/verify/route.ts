import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/lib/api/services/authService";

const authService = new AuthService();

export async function GET(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;
  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const payload = authService.verifyToken(token);
  if (!payload) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: { id: payload.userId, email: payload.email },
  });
}
