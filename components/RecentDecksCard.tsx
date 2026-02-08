"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "motion/react";
import { useDebouncedHover } from "@/hooks/useDebouncedHover";
import { Deck } from "@/lib/api/models/types";

interface RecentDecksCardProps {
  deck: Deck;
}

export default function RecentDecksCard({ deck }: RecentDecksCardProps) {
  const { debouncedHovered, onMouseEnter, onMouseLeave } =
    useDebouncedHover(1000);

  return (
    <div className="min-h-36 perspective-[1000px]">
      <motion.div
        className="relative h-full w-full cursor-pointer"
        animate={{ rotateY: debouncedHovered ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {/* Front of card */}
        <Card className="absolute inset-0 h-full w-full backface-hidden hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-primary">
              {deck.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Last reviewed: {new Date(deck.lastReviewed).toLocaleDateString()}
            </p>
            <p className="text-sm text-muted-foreground">
              {deck.cardCount} cards
            </p>
          </CardContent>
        </Card>

        {/* Back of card */}
        <Card
          className="absolute inset-0 h-full w-full backface-hidden hover:shadow-md transition-shadow"
          style={{ transform: "rotateY(180deg)" }}
        >
          <CardContent className="flex flex-col items-center justify-center h-full text-center p-4">
            <h3 className="text-lg font-semibold mb-2">{deck.name}</h3>
            <p className="text-sm text-muted-foreground">
              {deck.description ||
                "A comprehensive deck for learning and mastering key concepts through spaced repetition."}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
