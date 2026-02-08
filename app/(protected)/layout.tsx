import { Navigation } from "@/components/Navigation";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="h-[calc(100vh-72px)]">{children}</main>
    </div>
  );
}
