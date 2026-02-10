"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DraftFlashCard } from "@/components/DraftFlashCard";
import { FloatingNavigationButtons } from "@/components/FloatingNavigationButtons";
import { DeckFileUpload } from "@/components/DeckFileUpload";
import { Plus } from "lucide-react";
import { ImportDeckResult, useCreateDeck, useDeleteDeck } from "@/hooks/useDecks";
import { useCreateCard } from "@/hooks/useCards";
import { validateAndSanitizeDeck, validateAndSanitizeCards, sanitizeText } from "@/lib/frontend/validation";

interface CardData {
  front: string;
  back: string;
}

export default function CreateDeckPage() {
  const [deckName, setDeckName] = useState("");
  const [description, setDescription] = useState("");
  const [cards, setCards] = useState<CardData[]>([{ front: "", back: "" }]);
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();

  const createDeckMutation = useCreateDeck();
  const createCardMutation = useCreateCard();
  const deleteDeckMutation = useDeleteDeck();

  const addCard = () => {
    setCards([...cards, { front: "", back: "" }]);
  };

  const removeCard = (index: number) => {
    if (cards.length > 1) {
      setCards(cards.filter((_, i) => i !== index));
    }
  };

  const updateCard = (index: number, field: keyof CardData, value: string) => {
    const newCards = [...cards];
    newCards[index][field] = value;
    setCards(newCards);
  };

  const handleImportResult = useCallback((result: ImportDeckResult) => {
    if (!deckName.trim() && result.deck.name) {
      setDeckName(result.deck.name);
    }
    if (!description.trim() && result.deck.description) {
      setDescription(result.deck.description);
    }
    if (result.cards.length > 0) {
      setCards(result.cards);
    }
  }, []);

  const saveDeck = async () => {
    // Validate and sanitize deck data
    const deckValidation = validateAndSanitizeDeck({
      name: deckName,
      description,
    });

    if (!deckValidation.success) {
      alert("Deck validation failed: " + deckValidation.errors.join(", "));
      return;
    }

    // Validate and sanitize cards
    const cardsValidation = validateAndSanitizeCards(cards);
    if (!cardsValidation.success) {
      alert("Card validation failed:\n" + cardsValidation.errors.join("\n"));
      return;
    }

    setIsCreating(true);
    try {
      // Create deck
      const deck = await createDeckMutation.mutateAsync(deckValidation.data);

      try {
        // Create all cards - all or nothing
        await Promise.all(
          cardsValidation.data.map((card) =>
            createCardMutation.mutateAsync({
              deckId: deck.id,
              data: card,
            }),
          ),
        );

        // All cards created successfully
        router.push("/home");
      } catch (cardError) {
        // If card creation fails, delete the deck to maintain consistency
        console.error("Failed to create cards:", cardError);
        try {
          await deleteDeckMutation.mutateAsync(deck.id);
          alert("Failed to create some cards. The deck has been removed to maintain data consistency. Please try again.");
        } catch (deleteError) {
          console.error("Failed to cleanup deck after card creation failure:", deleteError);
          alert("Critical error: Deck was created but cards failed. The deck could not be cleaned up automatically. Please contact support.");
        }
      }
    } catch (error) {
      alert("Failed to create deck: " + (error as Error).message);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <FloatingNavigationButtons />
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">
            Create New Deck
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="deckName" className="mb-1">
                Deck Name
              </Label>
              <Input
                id="deckName"
                value={deckName}
                onChange={(e) => setDeckName(sanitizeText(e.target.value))}
                placeholder="Enter deck name"
                required
              />
            </div>

            <div>
              <Label htmlFor="description" className="mb-1">
                Description (Optional)
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(sanitizeText(e.target.value))}
                placeholder="Enter deck description"
                rows={3}
              />
            </div>
          </div>

          <div className="border-t border-border pt-6">
            <DeckFileUpload
              deckName={deckName}
              description={description}
              onImported={handleImportResult}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-6">
              <Label className="text-lg font-semibold">Flash Cards</Label>
              <Button onClick={addCard} variant="default" size="sm">
                <Plus />
                Add Card
              </Button>
            </div>

            {/* Draft Flash Cards List */}
            <div className="space-y-4">
              {cards.map((card, index) => (
                <DraftFlashCard
                  key={index}
                  card={card}
                  index={index}
                  onUpdate={updateCard}
                  onRemove={removeCard}
                  showRemoveButton={cards.length > 1}
                />
              ))}
              <Card
                onClick={addCard}
                className="border-dashed border-2 py-0 hover:border-primary transition-colors cursor-pointer"
              >
                <Button onClick={addCard} variant="link">
                  Add Card
                </Button>
              </Card>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={saveDeck}
              className="flex-1"
              loading={isCreating}
              loadingText="Creating..."
            >
              Create Deck
            </Button>
            <Button
              onClick={() => router.push("/home")}
              variant="outline"
              className="flex-1 sm:flex-initial"
              disabled={isCreating}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
