import { Navigation } from "@/components/Navigation";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;

  if (!token) {
    redirect("/login");
  }

  const rawBaseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const baseUrl = rawBaseUrl.startsWith("http")
    ? rawBaseUrl
    : `https://${rawBaseUrl}`;

  // Verify authentication via API
  const authResponse = await fetch(`${baseUrl}/api/auth/verify`, {
    headers: {
      Cookie: `auth-token=${token}`,
    },
  });

  if (!authResponse.ok) {
    redirect("/login");
  }
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="h-[calc(100vh-72px)]">{children}</main>
    </div>
  );
}
