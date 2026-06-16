import { Suspense } from "react";
import { StorePageClient } from "@/components/public/StorePageClient";
import { getCategoriesWithCounts, getPublishedProducts, getSiteSettings } from "@/lib/data";
import { parseStringArray, toProductCard } from "@/lib/product";

export const metadata = {
  title: "Store | Minecraft Store",
  description: "Browse modpacks, plugins, maps, and more.",
};

export default async function StorePage() {
  const [products, categories, settings] = await Promise.all([
    getPublishedProducts(),
    getCategoriesWithCounts(),
    getSiteSettings(),
  ]);

  const productCards = products.map((product) => ({
    ...toProductCard(product),
    tags: parseStringArray(product.tags),
  }));

  const maxPrice = Math.ceil(
    Math.max(...products.map((product) => product.price), 50),
  );

  return (
    <Suspense
      fallback={
        <p className="p-10 text-center font-retro text-xl">Loading store...</p>
      }
    >
      <StorePageClient
        products={productCards}
        categories={categories.map((category) => ({
          slug: category.slug,
          name: category.name,
        }))}
        currency={settings?.currency ?? "USD"}
        maxPrice={maxPrice}
      />
    </Suspense>
  );
}
