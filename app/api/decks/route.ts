import { getDecks, createDeck } from "@/lib/api/controllers/deckController";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  return getDecks(request);
}

export async function POST(request: NextRequest) {
  return createDeck(request);
}
