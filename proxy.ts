import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Cleanup expired entries every 5 minutes
setInterval(
  () => {
    const now = Date.now();
    for (const [key, data] of rateLimitMap.entries()) {
      if (now > data.resetTime) {
        rateLimitMap.delete(key);
      }
    }
  },
  5 * 60 * 1000,
);

function checkRateLimit(
  identifier: string,
  maxRequests: number = 100,
  windowMs: number = 15 * 60 * 1000,
): boolean {
  const now = Date.now();
  const windowData = rateLimitMap.get(identifier);

  if (!windowData || now > windowData.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs });
    return false;
  }

  if (windowData.count >= maxRequests) {
    return true; // Rate limited
  }

  windowData.count++;
  return false;
}

export function proxy(request: NextRequest) {
  // Get client identifier (IP address)
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const pathname = request.nextUrl.pathname;
  const method = request.method;

  let maxRequests = 100; // Default
  let windowMs = 15 * 60 * 1000; // 15 minutes

  if (pathname.startsWith("/api/auth/login")) {
    maxRequests = 5; // Stricter for login
    windowMs = 15 * 60 * 1000;
  } else if (
    pathname.startsWith("/api/decks/import-text/") &&
    method === "GET"
  ) {
    maxRequests = 500; // Allow frequent polling for import jobs
    windowMs = 15 * 60 * 1000;
  } else if (
    pathname.startsWith("/api/decks") ||
    pathname.startsWith("/api/cards")
  ) {
    maxRequests = 50; // Moderate for content creation
  }

  if (checkRateLimit(ip, maxRequests, windowMs)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*", // Only apply to API routes
};
