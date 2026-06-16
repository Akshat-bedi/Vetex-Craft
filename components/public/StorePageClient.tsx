"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CategoryFilter } from "@/components/public/CategoryFilter";
import { ProductCard } from "@/components/public/ProductCard";
import type { CategoryOption } from "@/components/public/CategoryFilter";
import type { ProductCardData } from "@/types/product";
import { cn } from "@/lib/utils";

type SortOption = "newest" | "price-asc" | "price-desc" | "popular";

type StorePageClientProps = {
  products: ProductCardData[];
  categories: CategoryOption[];
  currency?: string;
  maxPrice: number;
};

export function StorePageClient({
  products,
  categories,
  currency = "USD",
  maxPrice,
}: StorePageClientProps) {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category");

  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : [],
  );
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [priceMax, setPriceMax] = useState(maxPrice);
  const [sort, setSort] = useState<SortOption>("newest");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    products.forEach((product) => {
      (product as ProductCardData & { tags?: string[] }).tags?.forEach((tag) =>
        tags.add(tag),
      );
    });
    return Array.from(tags).sort();
  }, [products]);

  const filtered = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.shortDescription?.toLowerCase().includes(query) ||
          product.category?.name.toLowerCase().includes(query),
      );
    }

    if (selectedCategories.length > 0) {
      result = result.filter((product) =>
        selectedCategories.includes(product.category?.slug ?? ""),
      );
    }

    if (selectedTags.length > 0) {
      result = result.filter((product) => {
        const tags =
          (product as ProductCardData & { tags?: string[] }).tags ?? [];
        return selectedTags.some((tag) => tags.includes(tag));
      });
    }

    result = result.filter((product) => product.price <= priceMax);

    switch (sort) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "popular":
        result.sort((a, b) => Number(b.featured) - Number(a.featured));
        break;
      default:
        break;
    }

    return result;
  }, [products, search, selectedCategories, selectedTags, priceMax, sort]);

  function toggleCategory(slug: string) {
    setSelectedCategories((current) =>
      current.includes(slug)
        ? current.filter((item) => item !== slug)
        : [...current, slug],
    );
  }

  function toggleTag(tag: string) {
    setSelectedTags((current) =>
      current.includes(tag)
        ? current.filter((item) => item !== tag)
        : [...current, tag],
    );
  }

  const filterPanel = (
    <div className="space-y-6">
      <div>
        <h3 className="font-retro text-xl text-text-gold">Category</h3>
        <div className="mt-2 space-y-2">
          {categories.map((category) => (
            <label
              key={category.slug}
              className="flex cursor-pointer items-center gap-2 font-body text-sm"
            >
              <input
                type="checkbox"
                checked={selectedCategories.includes(category.slug)}
                onChange={() => toggleCategory(category.slug)}
                className="h-4 w-4 accent-accent-green"
              />
              {category.name}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-retro text-xl text-text-gold">
          Max price: ${priceMax.toFixed(0)}
        </h3>
        <input
          type="range"
          min={0}
          max={maxPrice}
          step={1}
          value={priceMax}
          onChange={(event) => setPriceMax(Number(event.target.value))}
          className="mt-2 w-full accent-accent-green"
        />
      </div>

      {allTags.length > 0 && (
        <div>
          <h3 className="font-retro text-xl text-text-gold">Tags</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={cn(
                  "border-2 border-black px-2 py-1 font-retro text-sm",
                  selectedTags.includes(tag)
                    ? "bg-accent-green text-black"
                    : "bg-bg-stone text-text-primary",
                )}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="font-retro text-xl text-text-gold">Sort by</h3>
        <select
          value={sort}
          onChange={(event) => setSort(event.target.value as SortOption)}
          className="mt-2 w-full border-[3px] border-[#555] bg-bg-secondary px-3 py-2 font-retro text-lg"
        >
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="popular">Popular</option>
        </select>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="font-pixel text-sm text-text-accent sm:text-base">STORE</h1>
        <p className="mt-2 font-retro text-xl text-text-secondary">
          {filtered.length} product{filtered.length === 1 ? "" : "s"} found
        </p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-secondary" />
        <input
          type="search"
          placeholder="Search products..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="w-full border-[3px] border-[#555] bg-bg-card py-3 pl-10 pr-4 font-retro text-xl shadow-pixel focus:outline-none focus:ring-2 focus:ring-accent-green"
        />
      </div>

      <div className="mb-4 lg:hidden">
        <button
          type="button"
          onClick={() => setMobileFiltersOpen(true)}
          className="flex items-center gap-2 border-[3px] border-[#555] bg-bg-card px-4 py-2 font-retro text-lg shadow-pixel"
        >
          <SlidersHorizontal className="h-5 w-5" />
          Filters
        </button>
      </div>

      <div className="flex gap-8">
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24 border-[3px] border-[#555] bg-bg-card p-4 shadow-pixel">
            {filterPanel}
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <CategoryFilter
            categories={categories}
            selected={selectedCategories[0] ?? null}
            onChange={(slug) =>
              setSelectedCategories(slug ? [slug] : [])
            }
            className="mb-6 lg:hidden"
          />
          {filtered.length === 0 ? (
            <p className="font-retro text-xl text-text-secondary">
              No products match your filters.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
              {filtered.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  currency={currency}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-[90] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileFiltersOpen(false)}
            aria-label="Close filters"
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[80vh] overflow-y-auto border-t-[3px] border-[#555] bg-bg-secondary p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-pixel text-xs text-text-gold">FILTERS</h2>
              <button type="button" onClick={() => setMobileFiltersOpen(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>
            {filterPanel}
          </div>
        </div>
      )}
    </div>
  );
}
