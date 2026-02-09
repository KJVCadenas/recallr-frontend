import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Deck } from "@/lib/api/models/types";
import MyDecksView from "@/components/MyDecksView";

export default async function MyDecksPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;

  if (!token) {
    redirect("/login");
  }

  const rawBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const baseUrl = rawBaseUrl.startsWith("http")
    ? rawBaseUrl
    : `https://${rawBaseUrl}`;

  const decksResponse = await fetch(`${baseUrl}/api/decks`, {
    headers: {
      Cookie: `auth-token=${token}`,
    },
  });

  if (!decksResponse.ok) {
    redirect("/login");
  }

  const decks: Deck[] = await decksResponse.json();

  return <MyDecksView decks={decks} />;
}
