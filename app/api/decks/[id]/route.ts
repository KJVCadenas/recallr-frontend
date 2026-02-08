import {
  getDeck,
  updateDeck,
  deleteDeck,
} from "@/lib/api/controllers/deckController";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const params = await context.params;
  return getDeck(request, { params });
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const params = await context.params;
  return updateDeck(request, { params });
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const params = await context.params;
  return deleteDeck(request, { params });
}
