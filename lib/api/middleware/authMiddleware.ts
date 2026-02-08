import { NextRequest } from "next/server";
import { AuthService } from "../services/authService";
import { AuthToken } from "../models/types";

const authService = new AuthService();

export async function authenticateRequest(
  request: NextRequest,
): Promise<AuthToken | null> {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.substring(7); // Remove 'Bearer '
  return authService.verifyToken(token);
}

export async function requireAuth(
  request: NextRequest,
): Promise<AuthToken | null> {
  return authenticateRequest(request);
}

export async function getCurrentUser(
  request: NextRequest,
): Promise<AuthToken | null> {
  return authenticateRequest(request);
}
