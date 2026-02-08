"use client";

import { Button } from "@/components/ui/button";

function HomePage() {
  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center space-y-8 max-w-2xl mx-auto px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white">
          Welcome Home
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          You are logged in to Recallr. This is your dashboard.
        </p>
        <Button onClick={handleLogout} variant="outline">
          Logout
        </Button>
      </div>
    </div>
  );
}

export default HomePage;
