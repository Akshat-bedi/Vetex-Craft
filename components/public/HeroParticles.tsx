"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";

const COLORS = [
  "bg-accent-green",
  "bg-text-diamond",
  "bg-accent-gold",
  "bg-accent-purple",
  "bg-accent-red",
] as const;

type Particle = {
  id: number;
  left: string;
  top: string;
  size: number;
  delay: string;
  duration: string;
  color: (typeof COLORS)[number];
};

export function HeroParticles({ count = 24 }: { count?: number }) {
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: count }, (_, id) => ({
      id,
      left: `${8 + ((id * 37) % 84)}%`,
      top: `${10 + ((id * 53) % 75)}%`,
      size: 3 + (id % 3),
      delay: `${(id * 0.35) % 6}s`,
      duration: `${5 + (id % 7)}s`,
      color: COLORS[id % COLORS.length]!,
    }));
  }, [count]);

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      <div className="hero-particles absolute inset-0 opacity-30" />
      {particles.map((particle) => (
        <span
          key={particle.id}
          className={cn(
            "hero-particle absolute block border border-black/40",
            particle.color,
          )}
          style={{
            left: particle.left,
            top: particle.top,
            width: particle.size,
            height: particle.size,
            animationDelay: particle.delay,
            animationDuration: particle.duration,
          }}
        />
      ))}
    </div>
  );
}
