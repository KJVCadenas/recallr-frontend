import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navigation() {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-background">
      <h1 className="font-bold text-primary text-4xl">Recallr</h1>
      <nav className="flex space-x-6">
        <Link href="/home">
          <Button variant="ghost" className="text-primary">
            Home
          </Button>
        </Link>
        <Link href="/my-decks">
          <Button variant="ghost" className="text-primary">
            My Decks
          </Button>
        </Link>
        <Link href="/profile">
          <Button variant="ghost" className="text-primary">
            My Profile
          </Button>
        </Link>
        <Link href="/settings">
          <Button variant="ghost" className="text-primary">
            Settings
          </Button>
        </Link>
      </nav>
    </header>
  );
}
