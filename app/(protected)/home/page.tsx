"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import LogoutButton from "../../../components/LogoutButton";
import RecentDecksCard from "../../../components/RecentDecksCard";
import Link from "next/link";

interface Deck {
  id: number;
  name: string;
  lastReviewed: string;
  cards: number;
  description?: string;
}

function HomePage() {
  const [recentDecks, setRecentDecks] = useState<Deck[]>([]);
  const [user, setUser] = useState("");

  useEffect(() => {
    const decks = JSON.parse(localStorage.getItem("decks") || "[]");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRecentDecks(decks);
    const userName = localStorage.getItem("userName") || "User";
    setUser(userName);
  }, []);

  return (
    <div className="h-full px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Welcome Section */}
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">
            Welcome back, <span className="text-primary">{user}</span>!
          </h1>
          <p className="text-white/80">
            Ready to continue your learning journey?
          </p>
        </div>

        {/* Recently Reviewed Decks */}
        {recentDecks && recentDecks.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Your Decks</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentDecks.map((deck) => (
                <RecentDecksCard key={deck.id} deck={deck} />
              ))}
            </div>
          </div>
        )}

        {/* Create New Deck Card */}
        <Card className="border-dashed border-2 hover:border-primary transition-colors cursor-pointer">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-4xl mb-4">+</div>
            <h3 className="text-lg font-semibold mb-2">Create New Deck</h3>
            <p className="text-muted-foreground text-center mb-4">
              Start building your next flashcard deck
            </p>
            <Link href="/create-deck">
              <Button variant="default">Create Deck</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Logout Button */}
        <div className="flex justify-center">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
