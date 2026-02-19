import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import ReviewClient from "./ReviewClient";
import { Deck } from "@/lib/api/models/types";

const getBaseUrl = () => {
  const rawUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  return rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`;
};

export default async function ReviewPage({
  params,
}: {
  params: { id: string };
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;

  if (!token) {
    redirect("/login");
  }

  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}/api/decks/${params.id}`, {
    headers: {
      Cookie: `auth-token=${token}`,
    },
    cache: "no-store",
  });

  if (response.status === 401) {
    redirect("/login");
  }

  if (!response.ok) {
    notFound();
  }

  const deck: Deck = await response.json();

  return <ReviewClient deckId={deck.id} deckName={deck.name} />;
}
