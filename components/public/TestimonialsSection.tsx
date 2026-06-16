"use client";

import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { TextureSection } from "@/components/public/TextureSection";
import { cn } from "@/lib/utils";

export type TestimonialData = {
  id: string;
  username: string;
  avatarUrl: string | null;
  review: string;
  rating: number;
};

export function TestimonialsSection({
  testimonials,
}: {
  testimonials: TestimonialData[];
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  if (testimonials.length === 0) return null;

  const current = testimonials[index]!;

  return (
    <TextureSection
      texture="wood"
      className="border-y-[3px] border-[#555] bg-bg-card py-12"
    >
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <h2 className="font-pixel text-xs text-text-gold sm:text-sm">
          PLAYER REVIEWS
        </h2>
        <blockquote className="mt-6 border-[3px] border-[#555] bg-bg-secondary p-6 shadow-pixel">
          <div className="mb-3 flex justify-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-5 w-5",
                  i < current.rating
                    ? "fill-accent-gold text-accent-gold"
                    : "text-text-secondary",
                )}
              />
            ))}
          </div>
          <p className="font-body text-lg text-text-primary">
            &ldquo;{current.review}&rdquo;
          </p>
          <footer className="mt-4 font-retro text-xl text-text-diamond">
            — {current.username}
          </footer>
        </blockquote>
        {testimonials.length > 1 && (
          <div className="mt-4 flex justify-center gap-2">
            {testimonials.map((item, i) => (
              <button
                key={item.id}
                type="button"
                aria-label={`Review ${i + 1}`}
                onClick={() => setIndex(i)}
                className={cn(
                  "h-2 w-8 border border-black",
                  i === index ? "bg-accent-green" : "bg-bg-stone",
                )}
              />
            ))}
          </div>
        )}
      </div>
    </TextureSection>
  );
}
