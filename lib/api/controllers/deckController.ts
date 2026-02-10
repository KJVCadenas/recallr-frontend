import { NextRequest, NextResponse } from "next/server";
import { DeckService } from "../services/deckService";
import { deckSchema } from "../models/schemas";
import { requireAuth } from "../middleware/authMiddleware";
import { handleApiError } from "../middleware/errorMiddleware";
import { createFlashcardGenerator } from "../services/flashcardGenerator/container";
import {
  createImportJob,
  getImportJob,
  updateImportJob,
} from "../services/flashcardGenerator/jobStore";
import { validateImportText } from "../services/textValidator";

const deckService = new DeckService();
const flashcardGenerator = createFlashcardGenerator();

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

export async function importDeckFromText(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { text, name, description } = body || {};

    const validation = validateImportText(text);
    if (!validation.ok) {
      return NextResponse.json(
        { error: validation.errors.join(" ") },
        { status: 400 },
      );
    }

    const job = createImportJob(user.userId);
    updateImportJob(job.id, { status: "processing" });
    try {
      const result = await flashcardGenerator.generateFromText({
        text: validation.sanitizedText,
        name: typeof name === "string" ? name : undefined,
        description: typeof description === "string" ? description : undefined,
        userId: user.userId,
      });
      if (validation.warnings.length > 0) {
        result.warnings.unshift(...validation.warnings);
      }
      updateImportJob(job.id, { status: "completed", result });
    } catch (error) {
      console.error("Import job failed:", error);
      updateImportJob(job.id, {
        status: "failed",
        error: (error as Error).message || "Import failed.",
      });
    }

    return NextResponse.json(
      { jobId: job.id, status: job.status },
      { status: 202 },
    );
  } catch (error) {
    return handleApiError(error);
  }
}

export async function getImportJobStatus(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const jobId = request.nextUrl.pathname.split("/").pop();
    if (!jobId) {
      return NextResponse.json({ error: "Job id is required." }, { status: 400 });
    }

    const job = getImportJob(jobId);
    if (!job) {
      return NextResponse.json({ error: "Job not found." }, { status: 404 });
    }
    if (job.userId !== user.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      {
        status: job.status,
        result: job.result,
        error: job.error,
      },
      { status: 200 },
    );
  } catch (error) {
    return handleApiError(error);
  }
}
