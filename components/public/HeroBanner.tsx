"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { HeroParticles } from "@/components/public/HeroParticles";
import { MinecraftLinkButton } from "@/components/public/MinecraftButton";
import { cn } from "@/lib/utils";

export type BannerData = {
  id: string;
  title: string;
  subtitle: string | null;
  imageUrl: string;
  ctaText: string | null;
  ctaLink: string | null;
};

export function HeroBanner({ banners }: { banners: BannerData[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (banners.length === 0) {
    return (
      <section className="relative min-h-[320px] overflow-hidden border-b-[3px] border-[#555] bg-bg-card py-16 sm:min-h-[420px] sm:py-20">
        <HeroParticles />
        <div className="relative z-[1] mx-auto max-w-7xl px-4 text-center sm:px-6">
          <h1 className="font-pixel text-sm text-text-accent sm:text-base">
            MINECRAFT STORE
          </h1>
          <p className="mt-4 font-retro text-2xl text-text-gold">
            Premium packages for your block world
          </p>
          <div className="mt-8">
            <MinecraftLinkButton href="/store">BROWSE STORE</MinecraftLinkButton>
          </div>
        </div>
      </section>
    );
  }

  const banner = banners[index]!;

  return (
    <section className="relative min-h-[320px] overflow-hidden border-b-[3px] border-[#555] sm:min-h-[420px]">
      {banners.map((item, i) => (
        <div
          key={item.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-700",
            i === index ? "opacity-100" : "opacity-0",
          )}
        >
          <Image
            src={item.imageUrl}
            alt=""
            fill
            unoptimized
            className="object-cover opacity-30"
            priority={i === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/80 to-transparent" />
        </div>
      ))}

      <HeroParticles />

      <div className="relative z-[1] mx-auto flex min-h-[320px] max-w-7xl flex-col justify-center px-4 py-12 sm:min-h-[420px] sm:px-6 sm:py-16">
        <h1 className="max-w-2xl font-pixel text-sm leading-relaxed text-text-accent sm:text-base md:text-lg">
          {banner.title}
        </h1>
        {banner.subtitle && (
          <p className="mt-4 max-w-xl font-retro text-2xl text-text-gold md:text-3xl">
            {banner.subtitle}
          </p>
        )}
        {banner.ctaText && banner.ctaLink && (
          <div className="mt-8">
            <MinecraftLinkButton href={banner.ctaLink}>
              {banner.ctaText.toUpperCase()}
            </MinecraftLinkButton>
          </div>
        )}
      </div>

      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          {banners.map((item, i) => (
            <button
              key={item.id}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={cn(
                "h-3 w-3 border-2 border-black",
                i === index ? "bg-accent-green" : "bg-bg-stone",
              )}
            />
          ))}
        </div>
      )}
    </section>
  );
}
