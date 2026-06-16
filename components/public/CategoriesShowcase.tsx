import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { TextureSection } from "@/components/public/TextureSection";
import { cn } from "@/lib/utils";

export type CategoryTile = {
  slug: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  productCount: number;
};

const TEXTURES = [
  "/textures/grass.png",
  "/textures/dirt.png",
  "/textures/stone.png",
  "/textures/wood.png",
];

export function CategoriesShowcase({
  categories,
}: {
  categories: CategoryTile[];
}) {
  return (
    <TextureSection
      texture="stone"
      className="border-y-[3px] border-[#555] bg-bg-secondary py-12"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="font-pixel text-xs text-text-gold sm:text-sm">
          CATEGORIES
        </h2>
        <p className="mt-1 font-retro text-lg text-text-secondary">
          Browse by type of package
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <Link
              key={category.slug}
              href={`/store?category=${category.slug}`}
              className={cn(
                "pixel-hover-card group relative overflow-hidden border-[3px] border-[#555] bg-bg-card p-6 shadow-pixel",
                "hover:border-accent-diamond",
              )}
              style={
                { "--glow-color": "rgba(93, 230, 230, 0.4)" } as CSSProperties
              }
            >
              <div className="absolute right-2 top-2 opacity-20">
                <Image
                  src={category.imageUrl ?? TEXTURES[index % TEXTURES.length]}
                  alt=""
                  width={64}
                  height={64}
                  unoptimized
                  className="object-contain"
                />
              </div>
              <h3 className="font-pixel text-[10px] text-text-accent group-hover:text-text-gold">
                {category.name.toUpperCase()}
              </h3>
              {category.description && (
                <p className="mt-2 font-body text-sm text-text-secondary line-clamp-2">
                  {category.description}
                </p>
              )}
              <p className="mt-4 font-retro text-lg text-text-diamond">
                {category.productCount} product
                {category.productCount === 1 ? "" : "s"}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </TextureSection>
  );
}
