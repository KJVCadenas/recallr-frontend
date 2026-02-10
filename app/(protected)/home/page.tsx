import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import LogoutButton from "../../../components/LogoutButton";
import RecentDecksCard from "../../../components/RecentDecksCard";
import Link from "next/link";
import { Deck } from "@/lib/api/models/types";

export default async function HomePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;

  if (!token) {
    redirect("/login");
  }

  const rawBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const baseUrl = rawBaseUrl.startsWith("http")
    ? rawBaseUrl
    : `https://${rawBaseUrl}`;

  // Verify authentication via API
  const authResponse = await fetch(
    `${baseUrl}/api/auth/verify`,
    {
      headers: {
        Cookie: `auth-token=${token}`,
      },
    },
  );

  if (!authResponse.ok) {
    redirect("/login");
  }

  const authData = await authResponse.json();
  const user = authData.user?.email || "User";

  // Fetch decks via API
  const decksResponse = await fetch(
    `${baseUrl}/api/decks`,
    {
      headers: {
        Cookie: `auth-token=${token}`,
      },
    },
  );

  let decks: Deck[] = [];
  if (decksResponse.ok) {
    decks = await decksResponse.json();
  }

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
        {decks && decks.length > 0 ? (
          <div>
            <h2 className="text-xl font-semibold mb-4">Your Decks</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {decks.map((deck) => (
                <RecentDecksCard key={deck.id} deck={deck} />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-semibold">No decks yet</h2>
            <p className="text-muted-foreground mb-4">
              Create your first flashcard deck to get started!
            </p>
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
