import { NextRequest } from "next/server";
import { getImportJobStatus } from "@/lib/api/controllers/deckController";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  return getImportJobStatus(request);
}
