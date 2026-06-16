import { Suspense } from "react";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";
import { auth } from "@/lib/auth";

export const metadata = {
  title: "Admin Login | Minecraft Store",
};

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/admin");
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden p-4">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: "url(/textures/stone.png)",
          backgroundSize: "64px 64px",
          backgroundRepeat: "repeat",
        }}
      />

      <div className="relative w-full max-w-md border-[3px] border-[#555] bg-bg-card p-8 shadow-pixel">
        <div className="mb-8 text-center">
          <p className="font-retro text-lg text-text-diamond">Admin Portal</p>
          <h1 className="mt-2 font-pixel text-sm leading-relaxed text-text-accent sm:text-base">
            MINECRAFT STORE
          </h1>
          <p className="mt-3 font-body text-sm text-text-secondary">
            Sign in to manage products, orders, and settings.
          </p>
        </div>

        <Suspense
          fallback={
            <p className="font-retro text-center text-xl text-text-secondary">
              Loading...
            </p>
          }
        >
          <LoginForm />
        </Suspense>

        <p className="mt-6 text-center font-body text-xs text-text-secondary">
          Seeded admin: admin@minecraftstore.local
        </p>
      </div>
    </main>
  );
}
