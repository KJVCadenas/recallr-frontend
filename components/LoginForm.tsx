"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLogin, useRegister } from "@/hooks/useAuth";
import { useGoogleReCaptcha } from '@google-recaptcha/react';

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");

  const router = useRouter();
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const googleReCaptcha = useGoogleReCaptcha();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!googleReCaptcha) {
      setError("reCAPTCHA not loaded. Please refresh and try again.");
      return;
    }

    const recaptcha = googleReCaptcha;
    // @ts-expect-error: executeV3 is available but not typed in the library
    const token = await recaptcha.executeV3(isLogin ? 'login' : 'register');
    if (!token) {
      setError("reCAPTCHA verification failed. Please try again.");
      return;
    }

    try {
      if (isLogin) {
        await loginMutation.mutateAsync({ email, password, recaptchaToken: token });
      } else {
        await registerMutation.mutateAsync({ email, password, recaptchaToken: token });
      }
      router.push("/home");
    } catch (err) {
      const error = err as { response?: { status?: number }; message?: string };
      if (error.response?.status === 401) {
        setError("Invalid email or password. Please try again.");
      } else if (error.message) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
    }
  };

  const isLoading = loginMutation.isPending || registerMutation.isPending;

  return (
    <div className="flex items-center justify-center p-4 h-full">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-primary font-bold text-lg">
            {isLogin ? "Sign In to Recallr" : "Sign Up"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete={isLogin ? "current-password" : "new-password"}
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}
            <Button
              type="submit"
              className="w-full"
              loading={isLoading}
              loadingText="Loading..."
            >
              {isLogin ? "Sign In" : "Sign Up"}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <Button
              variant="link"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm"
            >
              {isLogin
                ? "Need an account? Sign up"
                : "Already have an account? Sign in"}
            </Button>
          </div>
          <div className="mt-4 text-center">
            <Link
              href="/"
              className="text-primary underline-offset-4 hover:underline text-sm"
            >
              Back to Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
