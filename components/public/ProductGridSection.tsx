"use client";

import { useMemo, useState } from "react";
import { CategoryFilter } from "@/components/public/CategoryFilter";
import { ProductCard } from "@/components/public/ProductCard";
import type { CategoryOption } from "@/components/public/CategoryFilter";
import type { ProductCardData } from "@/types/product";

type ProductGridSectionProps = {
  products: ProductCardData[];
  categories: CategoryOption[];
  currency?: string;
};

export function ProductGridSection({
  products,
  categories,
  currency = "USD",
}: ProductGridSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    if (!selectedCategory) {
      return products;
    }
    return products.filter(
      (product) => product.category?.slug === selectedCategory,
    );
  }, [products, selectedCategory]);

  return (
    <section className="space-y-6">
      <CategoryFilter
        categories={categories}
        selected={selectedCategory}
        onChange={setSelectedCategory}
      />
      {filteredProducts.length === 0 ? (
        <p className="font-retro text-xl text-text-secondary">
          No products in this category.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              currency={currency}
            />
          ))}
        </div>
      )}
    </section>
  );
}
