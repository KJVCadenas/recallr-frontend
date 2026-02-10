import { NextRequest } from "next/server";
import { importDeckFromText } from "@/lib/api/controllers/deckController";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  return importDeckFromText(request);
}
