import Link from "next/link";
import { ProductCard } from "@/components/public/ProductCard";
import { TextureSection } from "@/components/public/TextureSection";
import type { ProductCardData } from "@/types/product";

type FeaturedSectionProps = {
  products: ProductCardData[];
  currency?: string;
};

export function FeaturedSection({
  products,
  currency = "USD",
}: FeaturedSectionProps) {
  const featured = products.filter((product) => product.featured).slice(0, 4);

  if (featured.length === 0) {
    return null;
  }

  return (
    <TextureSection texture="grass" className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-pixel text-xs text-text-gold sm:text-sm">
              FEATURED PRODUCTS
            </h2>
            <p className="mt-1 font-retro text-lg text-text-secondary">
              Hand-picked bestsellers from our store
            </p>
          </div>
          <Link
            href="/store"
            className="font-retro text-xl text-text-accent underline-offset-4 hover:underline"
          >
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              currency={currency}
            />
          ))}
        </div>
      </div>
    </TextureSection>
  );
}
