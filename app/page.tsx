"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function MarketingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center space-y-8 max-w-2xl mx-auto px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white">
          Welcome to Recallr
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Your personal memory assistant. Capture, organize, and recall your
          thoughts effortlessly.
        </p>
        <div className="space-x-4">
          <Link
            href="/login"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md border border-transparent bg-primary text-primary-foreground text-sm font-medium h-10 gap-1.5 px-2.5 transition-all hover:bg-primary/80"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md border border-border bg-background text-foreground text-sm font-medium h-10 gap-1.5 px-2.5 transition-all hover:bg-muted hover:text-foreground shadow-xs"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated");
    if (auth) {
      router.push("/home");
    }
  }, [router]);

  return <MarketingPage />;
}
