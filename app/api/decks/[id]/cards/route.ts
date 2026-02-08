import { getCards, createCard } from "@/lib/api/controllers/cardController";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const params = await context.params;
  return getCards(request as any, { params: { deckId: params.id } });
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const params = await context.params;
  return createCard(request as any, { params: { deckId: params.id } });
}
