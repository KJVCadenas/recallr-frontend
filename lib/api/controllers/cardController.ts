import { NextRequest, NextResponse } from "next/server";
import { CardService } from "../services/cardService";
import { DeckService } from "../services/deckService";
import { cardSchema } from "../models/schemas";
import { requireOwnershipOrAdmin } from "../middleware/authMiddleware";
import { handleApiError } from "../middleware/errorMiddleware";

const cardService = new CardService();
const deckService = new DeckService();

export async function getCards(
  request: NextRequest,
  { params }: { params: { deckId: string } },
) {
  try {
    const deck = await deckService.getDeckById(params.deckId);
    if (!deck) {
      return NextResponse.json({ error: "Deck not found" }, { status: 404 });
    }

    await requireOwnershipOrAdmin(request, deck.userId, { allowAdmin: true });

    const cards = await cardService.getCardsByDeck(params.deckId);
    return NextResponse.json(cards);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function createCard(
  request: NextRequest,
  { params }: { params: { deckId: string } },
) {
  try {
    const deck = await deckService.getDeckById(params.deckId);
    if (!deck) {
      return NextResponse.json({ error: "Deck not found" }, { status: 404 });
    }

    await requireOwnershipOrAdmin(request, deck.userId);

    const body = await request.json();
    const { front, back } = cardSchema.parse(body);

    const card = await cardService.createCard(params.deckId, front, back);
    return NextResponse.json(card, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function getCard(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const card = await cardService.getCardById(params.id);
    if (!card) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    const deck = await deckService.getDeckById(card.deckId);
    if (!deck) {
      return NextResponse.json({ error: "Deck not found" }, { status: 404 });
    }

    await requireOwnershipOrAdmin(request, deck.userId, { allowAdmin: true });

    return NextResponse.json(card);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function updateCard(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const card = await cardService.getCardById(params.id);
    if (!card) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    const deck = await deckService.getDeckById(card.deckId);
    if (!deck) {
      return NextResponse.json({ error: "Deck not found" }, { status: 404 });
    }

    await requireOwnershipOrAdmin(request, deck.userId);

    const body = await request.json();
    const updates = cardSchema.partial().parse(body);

    const updatedCard = await cardService.updateCard(params.id, updates);
    if (!updatedCard) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    return NextResponse.json(updatedCard);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function deleteCard(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const card = await cardService.getCardById(params.id);
    if (!card) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    const deck = await deckService.getDeckById(card.deckId);
    if (!deck) {
      return NextResponse.json({ error: "Deck not found" }, { status: 404 });
    }

    await requireOwnershipOrAdmin(request, deck.userId);

    const deleted = await cardService.deleteCard(params.id);
    if (!deleted) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Card deleted" });
  } catch (error) {
    return handleApiError(error);
  }
}
