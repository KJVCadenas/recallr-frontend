"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import {
  motion,
  useAnimate,
  useMotionValue,
  useVelocity,
  useTransform,
  useMotionTemplate,
  AnimatePresence,
} from "motion/react";
import { Card, CardContent } from "@/components/ui/card";

interface CardData {
  id: string;
  front: string;
  back: string;
}

interface CaseOpeningAnimationProps {
  cards: CardData[];
  onComplete: (selectedIndex: number, shuffledCards: CardData[]) => void;
}

// Card dimensions for the strip
const CARD_WIDTH = 160;
const CARD_HEIGHT = 140;
const CARD_GAP = 12;
const CARD_TOTAL = CARD_WIDTH + CARD_GAP;

// How many extra copies of the deck to pre-fill the strip for scrolling room
const REPEAT_COUNT = 6;

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * A single card in the scrolling strip — shows front text with
 * scale/opacity micro-animation when near the center selection line.
 */
function StripCard({
  card,
  isNearCenter,
  isSelected,
}: {
  card: CardData;
  isNearCenter: boolean;
  isSelected: boolean;
}) {
  return (
    <motion.div
      className="shrink-0 relative"
      style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
      animate={{
        scale: isSelected ? 1.08 : isNearCenter ? 1.04 : 1,
        opacity: isNearCenter ? 1 : 0.6,
      }}
      transition={{ duration: 0.15 }}
    >
      <div
        className={`
          w-full h-full rounded-lg border bg-card text-card-foreground
          flex items-center justify-center p-3 transition-shadow duration-150
          ${isSelected ? "case-card-glow border-primary/60" : "border-border/40"}
        `}
      >
        <span className="text-sm font-semibold text-center line-clamp-3 select-none">
          {card.front}
        </span>
      </div>
    </motion.div>
  );
}

/**
 * CS:GO-style case opening animation.
 *
 * Flow:
 *  1. Overlay fades in, glass tube appears
 *  2. Card strip scrolls rapidly left (spring physics + velocity blur)
 *  3. Deceleration → card aligns at center
 *  4. Dramatic pause → selected card rises + 3D flip
 *  5. Tube dissolves, card expands to fill review area
 *  6. Calls onComplete with the selected card
 */
export function CaseOpeningAnimation({
  cards,
  onComplete,
}: CaseOpeningAnimationProps) {
  const [phase, setPhase] = useState<
    "enter" | "scrolling" | "stopped" | "reveal" | "exit"
  >("enter");
  const [scope, animate] = useAnimate();
  const stripX = useMotionValue(0);
  const stripVelocity = useVelocity(stripX);
  const blur = useTransform(stripVelocity, [-8000, 0, 8000], [14, 0, 14]);
  const filterVal = useMotionTemplate`blur(${blur}px)`;

  const [nearCenterIdx, setNearCenterIdx] = useState<number | null>(null);
  const [selectedStripIdx, setSelectedStripIdx] = useState<number | null>(null);
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);
  const [showFlip, setShowFlip] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  // Build the shuffled strip once on mount
  const { stripCards, winnerStripIdx, shuffledDeck } = useMemo(() => {
    const shuffled = shuffleArray(cards);
    // Build a long strip by repeating the shuffled deck many times
    const strip: CardData[] = [];
    for (let i = 0; i < REPEAT_COUNT; i++) {
      strip.push(...shuffled);
    }
    // Find a strip index in the landing zone that matches shuffled[0]
    // so the animation always lands on the first card of the shuffled deck
    const minIdx = Math.floor(strip.length * 0.6);
    const maxIdx = Math.floor(strip.length * 0.85);
    const firstCardId = shuffled[0].id;
    let winner = -1;
    for (let i = minIdx; i <= maxIdx; i++) {
      if (strip[i].id === firstCardId) {
        winner = i;
        break;
      }
    }
    // Fallback: if not found (shouldn't happen), pick any in range
    if (winner === -1) {
      winner = minIdx + Math.floor(Math.random() * (maxIdx - minIdx));
    }
    return {
      stripCards: strip,
      winnerStripIdx: winner,
      shuffledDeck: shuffled,
    };
  }, [cards]);

  // Track which card is near center during scroll (for glow effect)
  const updateNearCenter = useCallback(() => {
    if (!containerRef.current) return;
    const containerWidth = containerRef.current.offsetWidth;
    const centerX = containerWidth / 2;
    const currentX = stripX.get();
    // The strip starts at x=0 where the first card's left edge is at position 0
    // Center of card i = i * CARD_TOTAL + CARD_WIDTH/2 + currentX
    const nearIdx = Math.round(
      (centerX - currentX - CARD_WIDTH / 2) / CARD_TOTAL,
    );
    const clamped = Math.max(0, Math.min(nearIdx, stripCards.length - 1));
    setNearCenterIdx(clamped);
    if (phase === "scrolling") {
      rafRef.current = requestAnimationFrame(updateNearCenter);
    }
  }, [stripX, stripCards.length, phase]);

  // Compute the target x offset to center the winner card
  const getTargetX = useCallback(() => {
    if (!containerRef.current) return 0;
    const containerWidth = containerRef.current.offsetWidth;
    const cardCenter = winnerStripIdx * CARD_TOTAL + CARD_WIDTH / 2;
    return -(cardCenter - containerWidth / 2);
  }, [winnerStripIdx]);

  // Run the animation sequence
  useEffect(() => {
    if (phase !== "enter") return;

    const runAnimation = async () => {
      // Brief delay for overlay fade-in
      await new Promise((r) => setTimeout(r, 400));
      setPhase("scrolling");

      // Start tracking near-center
      rafRef.current = requestAnimationFrame(updateNearCenter);

      const target = getTargetX();

      // Animate the strip with spring physics for natural deceleration
      await animate(stripX, target, {
        type: "spring",
        stiffness: 60,
        damping: 55,
        mass: 1.0,
        velocity: -4000,
        restSpeed: 1,
        restDelta: 1,
      });

      // Stop tracking
      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      // Mark stopped
      setPhase("stopped");
      setSelectedStripIdx(winnerStripIdx);
      setSelectedCard(stripCards[winnerStripIdx]);

      // Dramatic pause
      await new Promise((r) => setTimeout(r, 600));

      // Reveal phase — card rises + flips
      setPhase("reveal");
      setShowFlip(true);

      // Let flip animation play
      await new Promise((r) => setTimeout(r, 1200));

      // Exit — dissolve tube, expand card
      setPhase("exit");

      // Wait for exit animation
      await new Promise((r) => setTimeout(r, 800));

      // Always start at the first card of the shuffled deck
      onComplete(0, shuffledDeck);
    };

    runAnimation();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Restart near-center tracking when phase becomes scrolling
  useEffect(() => {
    if (phase === "scrolling") {
      rafRef.current = requestAnimationFrame(updateNearCenter);
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [phase, updateNearCenter]);

  return (
    <AnimatePresence>
      {phase !== "exit" ? (
        <motion.div
          key="case-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Dimmed background */}
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          />

          {/* Glass tube container */}
          <motion.div
            ref={containerRef}
            className="relative w-[90vw] max-w-4xl overflow-hidden glass-tube rounded-xl"
            style={{ height: 180 }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{
              duration: 0.35,
              delay: 0.15,
              ease: "easeOut",
            }}
          >
            {/* Selection line — center */}
            <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-0.75 selection-line z-20 pointer-events-none" />

            {/* Top & bottom edge highlights */}
            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/40 to-transparent" />

            {/* Scrolling card strip */}
            <motion.div
              ref={scope}
              className="absolute top-0 bottom-0 flex items-center gap-3 px-2"
              style={{
                x: stripX,
                filter: filterVal,
                willChange: "transform",
              }}
            >
              {stripCards.map((card, i) => (
                <StripCard
                  key={`${card.id}-${i}`}
                  card={card}
                  isNearCenter={nearCenterIdx === i}
                  isSelected={selectedStripIdx === i}
                />
              ))}
            </motion.div>
          </motion.div>

          {/* Selected card — rises above the tube with glow */}
          <AnimatePresence>
            {showFlip && selectedCard && (
              <motion.div
                key="reveal-card"
                className="absolute z-30"
                initial={{ y: 0, scale: 1, opacity: 0 }}
                animate={{
                  y: -40,
                  scale: 1.25,
                  opacity: 1,
                }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                  mass: 0.8,
                }}
              >
                <Card
                  className="flex items-center justify-center case-card-glow"
                  style={{
                    width: CARD_WIDTH * 1.5,
                    height: CARD_HEIGHT * 1.5,
                  }}
                >
                  <CardContent className="text-center p-4 flex items-center justify-center h-full">
                    <span className="text-lg font-bold">
                      {selectedCard.front}
                    </span>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ) : (
        /* Exit phase — everything fades out */
        <motion.div
          key="case-exit"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
      )}
    </AnimatePresence>
  );
}
