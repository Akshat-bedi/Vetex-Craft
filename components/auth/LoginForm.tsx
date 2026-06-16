"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { MinecraftButton } from "@/components/public/MinecraftButton";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password. Try again.");
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="font-retro text-xl text-text-gold">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="border-[3px] border-[#555] bg-bg-secondary px-4 py-3 font-retro text-xl text-text-primary shadow-pixel outline-none ring-accent-green focus:ring-2"
          placeholder="admin@minecraftstore.local"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="font-retro text-xl text-text-gold">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="border-[3px] border-[#555] bg-bg-secondary px-4 py-3 font-retro text-xl text-text-primary shadow-pixel outline-none ring-accent-green focus:ring-2"
          placeholder="••••••••"
        />
      </div>

      {error && (
        <p
          role="alert"
          className="border-[3px] border-accent-red bg-bg-nether px-4 py-2 font-retro text-lg text-accent-red"
        >
          {error}
        </p>
      )}

      <MinecraftButton
        type="submit"
        disabled={loading}
        className="w-full justify-center"
      >
        {loading ? "LOGGING IN..." : "ENTER REALM"}
      </MinecraftButton>
    </form>
  );
}
