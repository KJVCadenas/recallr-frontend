import { NextRequest } from "next/server";
import { AuthService } from "../services/authService";
import { AuthToken } from "../models/types";

const authService = new AuthService();

export async function authenticateRequest(
  request: NextRequest,
): Promise<AuthToken | null> {
  // Check cookie first (new method)
  const token = request.cookies.get("auth-token")?.value;
  if (token) {
    return authService.verifyToken(token);
  }

  // Fallback to Authorization header (for backward compatibility or API clients)
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const headerToken = authHeader.substring(7); // Remove 'Bearer '
  return authService.verifyToken(headerToken);
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
