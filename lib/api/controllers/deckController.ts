import { NextRequest, NextResponse } from "next/server";
import { DeckService } from "../services/deckService";
import { deckSchema } from "../models/schemas";
import { requireAuth } from "../middleware/authMiddleware";
import { handleApiError } from "../middleware/errorMiddleware";

const deckService = new DeckService();

export async function getDecks(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decks = await deckService.getDecksByUser(user.userId);
    return NextResponse.json(decks);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function createDeck(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { name, description } = deckSchema.parse(body);

    const deck = await deckService.createDeck(user.userId, name, description);
    return NextResponse.json(deck, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function getDeck(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const user = await requireAuth(request);
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const deck = await deckService.getDeckById(params.id);
    if (!deck) {
      return NextResponse.json({ error: "Deck not found" }, { status: 404 });
    }

    return NextResponse.json(deck);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function updateDeck(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const user = await requireAuth(request);
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const updates = deckSchema.partial().parse(body);

    const deck = await deckService.updateDeck(params.id, updates);
    if (!deck) {
      return NextResponse.json({ error: "Deck not found" }, { status: 404 });
    }

    return NextResponse.json(deck);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function deleteDeck(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const user = await requireAuth(request);
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const deleted = await deckService.deleteDeck(params.id);
    if (!deleted) {
      return NextResponse.json({ error: "Deck not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Deck deleted" });
  } catch (error) {
    return handleApiError(error);
  }
}
