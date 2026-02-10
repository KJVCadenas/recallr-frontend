"use client";

import { useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shuffle, ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import { useCards } from "@/hooks/useCards";
import { FloatingNavigationButtons } from "@/components/FloatingNavigationButtons";
import { ProgressWithLabel } from "@/components/ProgressBarWithLabel";
import { Spinner } from "@/components/ui/spinner";
import { CaseOpeningAnimation } from "@/components/CaseOpeningAnimation";

interface CardData {
  id: string;
  front: string;
  back: string;
}

function ReviewCard({
  card,
  isFlipped,
  onFlip,
}: {
  card: CardData;
  isFlipped: boolean;
  onFlip: () => void;
}) {
  return (
    <motion.div
      className="relative w-full max-w-md sm:max-w-lg md:max-w-xl mx-auto cursor-pointer aspect-square"
      style={{ perspective: "1000px" }}
      onClick={onFlip}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        {/* Front */}
        <div className="absolute inset-0 backface-hidden">
          <Card className="w-full h-full flex items-center justify-center">
            <CardContent className="text-center p-4 flex items-center justify-center h-full">
              <div className="text-lg sm:text-xl font-bold">{card.front}</div>
            </CardContent>
          </Card>
        </div>
        {/* Back */}
        <div
          className="absolute inset-0 backface-hidden"
          style={{ transform: "rotateY(180deg)" }}
        >
          <Card className="w-full h-full flex items-center justify-center bg-muted">
            <CardContent className="text-center p-4 flex items-center justify-center h-full">
              <div className="text-lg sm:text-xl text-primary font-bold">
                {card.back}
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ReviewPage() {
  const params = useParams();
  const router = useRouter();
  const deckId = params.id as string;

  const { data: cards = [], isLoading, error } = useCards(deckId);
  const [shuffledCards, setShuffledCards] = useState<CardData[]>([]);
  const [isShuffled, setIsShuffled] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const displayCards = isShuffled ? shuffledCards : cards;

  const shuffleCards = useCallback(() => {
    if (cards.length < 2) return;
    setIsAnimating(true);
  }, [cards]);

  const handleAnimationComplete = useCallback(
    (selectedIndex: number, newShuffledCards: CardData[]) => {
      setShuffledCards(newShuffledCards);
      setIsShuffled(true);
      setCurrentIndex(selectedIndex);
      setIsFlipped(false);
      setIsAnimating(false);
    },
    [],
  );

  const nextCard = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % displayCards.length);
    setIsFlipped(false);
  }, [displayCards.length]);

  const prevCard = useCallback(() => {
    setCurrentIndex(
      (prev) => (prev - 1 + displayCards.length) % displayCards.length,
    );
    setIsFlipped(false);
  }, [displayCards.length]);

  const resetReview = useCallback(() => {
    setIsShuffled(false);
    setShuffledCards([]);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, []);

  const flipCard = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Error loading cards</h2>
          <p className="text-muted-foreground">Please try again later.</p>
        </div>
      </div>
    );
  }

  if (displayCards.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">No cards in this deck</h2>
          <p className="text-muted-foreground mb-4">
            Add some cards to start reviewing.
          </p>
          <Button onClick={() => router.push("/home")}>Back to Home</Button>
        </div>
      </div>
    );
  }

  const currentCard = displayCards[currentIndex];

  return (
    <div className="h-full px-4 py-4 flex flex-col">
      {/* CS:GO Case Opening Animation */}
      <AnimatePresence>
        {isAnimating && (
          <CaseOpeningAnimation
            cards={cards}
            onComplete={handleAnimationComplete}
          />
        )}
      </AnimatePresence>

      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-4xl space-y-8">
          {/* Progress Bar */}
          <div className="w-full max-w-md sm:max-w-lg md:max-w-xl mx-auto">
            <ProgressWithLabel
              label={`Card ${currentIndex + 1} of ${displayCards.length}`}
              value={((currentIndex + 1) / displayCards.length) * 100}
              max={100}
              className="w-full"
            />
          </div>
          {/* Header */}
          <div className="text-center">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
              <Button
                onClick={shuffleCards}
                variant="outline"
                size="sm"
                disabled={isAnimating || cards.length < 2}
              >
                <Shuffle className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Shuffle</span>
              </Button>
              <Button onClick={resetReview} variant="outline" size="sm">
                <RotateCcw className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Reset</span>
              </Button>
            </div>
          </div>

          {/* Card */}
          <div className="flex justify-center px-4">
            <ReviewCard
              card={currentCard}
              isFlipped={isFlipped}
              onFlip={flipCard}
            />
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-2 sm:gap-4">
            <Button
              onClick={prevCard}
              variant="outline"
              disabled={displayCards.length <= 1}
              size="sm"
            >
              <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Previous</span>
            </Button>
            <Button
              onClick={nextCard}
              disabled={displayCards.length <= 1}
              size="sm"
            >
              <span className="hidden sm:inline">Next</span>
              <ArrowRight className="w-4 h-4 ml-1 sm:ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
