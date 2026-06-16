import type { Product, Category } from "@/lib/generated/prisma/client";
import type { ProductCardData } from "@/types/product";

export function parseStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((item): item is string => typeof item === "string");
}

export function toProductCard(
  product: Product & { category: Category },
): ProductCardData {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    shortDescription: product.shortDescription,
    price: product.price,
    comparePrice: product.comparePrice,
    tier: product.tier,
    featured: product.featured,
    images: parseStringArray(product.images),
    category: {
      name: product.category.name,
      slug: product.category.slug,
    },
  };
}
