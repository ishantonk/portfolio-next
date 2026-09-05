"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button, Field } from "@/components/ui";

const ADMIN_EMAIL = "ishantonk.w@gmail.com";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (isLoading) return;

    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!result || result.error) {
        setError("The email or password you entered is incorrect.");
        return;
      }

      router.replace("/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="container-shop flex min-h-[70vh] items-center justify-center py-12">
      <form
        onSubmit={submit}
        className="w-full max-w-md space-y-5 rounded-3xl border bg-white p-8 shadow-sm"
        noValidate
      >
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight">
            Welcome back, Ishan.
          </h1>

          <p className="text-sm text-gray-500">
            Sign in to continue to your portfolio dashboard.
          </p>
        </div>

        <Field
          label="Email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.toString())}
          disabled={isLoading}
          required
        />

        <Field
          label="Password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.toString())}
          placeholder="Enter your password"
          autoComplete="current-password"
          disabled={isLoading}
          required
        />

        {error && (
          <p
            role="alert"
            aria-live="polite"
            className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600"
          >
            {error}
          </p>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full justify-center"
        >
          {isLoading ? "Signing in..." : "Login"}
        </Button>
      </form>
    </main>
  );
}
