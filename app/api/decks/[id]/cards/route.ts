import { getCards, createCard } from "@/lib/api/controllers/cardController";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const params = await context.params;
  return getCards(request, { params: { deckId: params.id } });
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const params = await context.params;
  return createCard(request, { params: { deckId: params.id } });
}
