"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function SignUpForm({ className }: { className?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    startTransition(async () => {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, displayName }),
      });

      const payload = await response.json();

      if (!response.ok) {
        setError(payload.error ?? "Unable to create account.");
        return;
      }

      // Redirect to check-email page after successful signup
      router.push("/check-email");
    });
  };

  return (
    <Card className={cn("w-full max-w-md border border-slate-200 bg-white/90", className)}>
      <CardHeader>
        <CardTitle className="text-2xl">Create account</CardTitle>
        <CardDescription>Start tracking your best chains and scores.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="grid gap-4">
          <div className="grid gap-1">
            <label htmlFor="displayName" className="text-sm font-medium text-slate-700">
              Display name (optional)
            </label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              placeholder="Player One"
              disabled={isPending}
            />
          </div>
          <div className="grid gap-1">
            <label htmlFor="email" className="text-sm font-medium text-slate-700">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              autoComplete="email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              disabled={isPending}
              required
            />
          </div>
          <div className="grid gap-1">
            <label htmlFor="password" className="text-sm font-medium text-slate-700">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              autoComplete="new-password"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              disabled={isPending}
              required
            />
          </div>
          {error ? (
            <p className="text-sm text-rose-600" role="alert">
              {error}
            </p>
          ) : null}
        </CardContent>
        <CardFooter className="flex flex-col items-stretch gap-3 mt-4">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Creating account…" : "Sign up"}
          </Button>
          <p className="text-center text-sm text-slate-500">
            Already have an account? <a href="/login" className="text-indigo-600 hover:underline">Log in</a>.
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
