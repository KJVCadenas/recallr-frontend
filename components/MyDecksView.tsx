"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Deck } from "@/lib/api/models/types";

type MyDecksViewProps = {
  decks: Deck[];
};

function formatDate(value?: string) {
  if (!value) return "Never";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Never";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const containerVariants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function MyDecksView({ decks }: MyDecksViewProps) {
  return (
    <div className="relative h-full overflow-y-auto px-4 py-10">
      <motion.div
        className="pointer-events-none absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
      <motion.div
        className="pointer-events-none absolute -right-24 bottom-0 h-64 w-64 rounded-full bg-foreground/5 blur-3xl"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      />

      <motion.div
        className="relative mx-auto flex max-w-6xl flex-col gap-10"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <motion.div className="space-y-3" variants={itemVariants}>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Your Library
            </p>
            <h1 className="text-4xl font-semibold md:text-5xl">My Decks</h1>
            <p className="max-w-xl text-sm text-muted-foreground md:text-base">
              Keep your knowledge sharp. Hover a deck to reveal its rhythm and
              jump back into practice.
            </p>
          </motion.div>

          <motion.div className="flex items-center gap-3" variants={itemVariants}>
            <div className="rounded-full border border-border/60 bg-background/80 px-4 py-2 text-sm">
              <span className="text-muted-foreground">Total decks</span>{" "}
              <span className="font-semibold text-foreground">
                {decks.length}
              </span>
            </div>
            <Link href="/create-deck">
              <Button>New Deck</Button>
            </Link>
          </motion.div>
        </div>

        {decks.length === 0 ? (
          <motion.div
            className="rounded-3xl border border-dashed border-border/70 bg-card/60 p-10 text-center"
            variants={itemVariants}
          >
            <h2 className="text-2xl font-semibold">No decks yet</h2>
            <p className="mt-2 text-muted-foreground">
              Create your first deck and start building your study streak.
            </p>
            <div className="mt-6">
              <Link href="/create-deck">
                <Button>Build a Deck</Button>
              </Link>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
            variants={containerVariants}
          >
            {decks.map((deck, index) => (
              <motion.div
                key={deck.id}
                variants={itemVariants}
                custom={index}
                whileHover={{ y: -10, rotate: 0.6 }}
                transition={{ type: "spring", stiffness: 220, damping: 18 }}
              >
                <Link href={`/deck/${deck.id}/review`}>
                  <motion.article className="group relative h-full overflow-hidden rounded-3xl border border-border/60 bg-card/80 p-6 shadow-sm">
                    <motion.div
                      className="pointer-events-none absolute inset-0"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="absolute -left-10 top-0 h-32 w-32 rounded-full bg-primary/25 blur-2xl" />
                      <div className="absolute -bottom-12 right-0 h-24 w-24 rounded-full bg-foreground/10 blur-2xl" />
                    </motion.div>

                    <motion.div
                      className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-primary/60 to-transparent"
                      initial={{ opacity: 0, scaleX: 0.6 }}
                      whileHover={{ opacity: 1, scaleX: 1 }}
                      transition={{ duration: 0.35 }}
                    />

                    <motion.div
                      className="absolute inset-0"
                      initial={{ x: "-120%" }}
                      whileHover={{ x: "120%" }}
                      transition={{ duration: 0.9, ease: "easeInOut" }}
                      style={{
                        background:
                          "linear-gradient(120deg, transparent 20%, oklch(0.9 0.18 92 / 18%) 45%, transparent 70%)",
                      }}
                    />

                    <div className="relative z-10 flex h-full flex-col gap-5">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                            Deck
                          </p>
                          <h2 className="mt-2 text-2xl font-semibold leading-tight">
                            {deck.name || "Untitled Deck"}
                          </h2>
                        </div>
                        <motion.div
                          className="rounded-full border border-border/60 bg-background/80 px-3 py-1 text-xs font-semibold text-foreground"
                          whileHover={{ scale: 1.04 }}
                        >
                          {deck.cardCount ?? 0} cards
                        </motion.div>
                      </div>

                      <p className="line-clamp-3 text-sm text-muted-foreground">
                        {deck.description ||
                          "Add a description to shape your study focus."}
                      </p>

                      <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground">
                        <span>Last reviewed</span>
                        <span className="font-medium text-foreground">
                          {formatDate(deck.lastReviewed)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Created</span>
                        <span className="font-medium text-foreground">
                          {formatDate(deck.createdAt)}
                        </span>
                      </div>

                      <motion.div
                        className="mt-2 flex items-center justify-between text-sm font-medium text-primary"
                        whileHover={{ x: 4 }}
                      >
                        <span>Open deck</span>
                        <span>→</span>
                      </motion.div>
                    </div>
                  </motion.article>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
