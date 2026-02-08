import { NextResponse } from "next/server";

export function handleApiError(error: unknown): NextResponse {
  console.error("API Error:", error);

  if (error instanceof Error && error.message === "User already exists") {
    return NextResponse.json({ error: "User already exists" }, { status: 409 });
  }

  if (
    error instanceof Error &&
    (error.message === "Deck not found" || error.message === "Card not found")
  ) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  if (error instanceof Error && error.message === "Unauthorized") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Generic server error
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}

export function withErrorHandler(handler: Function) {
  return async (...args: any[]) => {
    try {
      return await handler(...args);
    } catch (error) {
      return handleApiError(error);
    }
  };
}
