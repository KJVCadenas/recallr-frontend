import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import LogoutButton from "../../../components/LogoutButton";
import RecentDecksCard from "../../../components/RecentDecksCard";

export const metadata: Metadata = {
  title: "Recallr - Home Dashboard",
  description:
    "Welcome to Recallr, your flashcard learning platform. Review your decks and continue your learning journey.",
  keywords: ["flashcards", "learning", "study", "recall", "education"],
  openGraph: {
    title: "Recallr - Home Dashboard",
    description: "Welcome to Recallr, your flashcard learning platform.",
    type: "website",
  },
};

function HomePage() {
  // Mock data for recently reviewed decks
  const recentDecks = [
    {
      id: 1,
      name: "Spanish Vocabulary",
      lastReviewed: "2 hours ago",
      cards: 50,
      description:
        "Master essential Spanish words and phrases for everyday conversation and travel.",
    },
    {
      id: 2,
      name: "JavaScript Basics",
      lastReviewed: "1 day ago",
      cards: 30,
      description:
        "Learn fundamental JavaScript concepts including variables, functions, and control flow.",
    },
    {
      id: 3,
      name: "World Capitals",
      lastReviewed: "3 days ago",
      cards: 25,
      description:
        "Test your knowledge of capital cities around the world with this geography deck.",
    },
  ];

  const user = "John Doe"; // This would typically come from your authentication context or API

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
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Recently Reviewed Decks
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentDecks.map((deck) => (
              <RecentDecksCard key={deck.id} deck={deck} />
            ))}
          </div>
        </div>

        {/* Create New Deck Card */}
        <Card className="border-dashed border-2 hover:border-primary transition-colors cursor-pointer">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-4xl mb-4">+</div>
            <h3 className="text-lg font-semibold mb-2">Create New Deck</h3>
            <p className="text-muted-foreground text-center mb-4">
              Start building your next flashcard deck
            </p>
            <Button>Create Deck</Button>
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
