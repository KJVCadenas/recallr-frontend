import Image from "next/image";
import loginImage from "@/assets/Reading-by-Luriko-Yamaguchi.jpg";
import { LoginForm } from "@/components/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login to Recallr - Sign In to Your Account",
  description:
    "Access your Recallr account by signing in. Manage your reading lists, track progress, and discover new books.",
  keywords: "login, sign in, Recallr, reading app, book tracking",
  openGraph: {
    title: "Login to Recallr",
    description: "Sign in to Recallr to continue your reading journey.",
    type: "website",
  },
};

export default function LoginPage() {
  return (
    <div className="h-screen grid grid-cols-2">
      <LoginForm />
      <div className="relative h-full">
        <Image
          src={loginImage}
          alt="Reading a Book"
          fill
          className="object-contain"
        />
      </div>
    </div>
  );
}
