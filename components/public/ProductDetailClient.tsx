"use client";

import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { useState } from "react";
import { Check } from "lucide-react";
import { ProductCard } from "@/components/public/ProductCard";
import { MinecraftButton } from "@/components/public/MinecraftButton";
import { useCart } from "@/hooks/useCart";
import { getTierStyle } from "@/lib/tier";
import { cn, formatPrice, resolveProductMedia } from "@/lib/utils";
import type { ProductCardData } from "@/types/product";

export type ProductDetailData = ProductCardData & {
  longDescription: string | null;
  tags: string[];
  whatsIncluded: string[];
  stock: number;
  deliveryInstructions: string | null;
};

type ProductDetailClientProps = {
  product: ProductDetailData;
  related: ProductCardData[];
  currency?: string;
};

export function ProductDetailClient({
  product,
  related,
  currency = "USD",
}: ProductDetailClientProps) {
  const { addItem, openCart } = useCart();
  const [activeSource, setActiveSource] = useState(product.images[0] ?? "");
  const activeMedia = resolveProductMedia(activeSource);
  const tierStyle = getTierStyle(product.tier);
  const onSale =
    product.comparePrice != null && product.comparePrice > product.price;

  function handleAddToCart(goToCheckout = false) {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: activeMedia.cartImageSrc,
    });
    if (goToCheckout) {
      window.location.href = "/checkout";
    } else {
      openCart();
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          {activeMedia.youtubeUrl ? (
            <a
              href={activeMedia.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Watch ${product.name} preview on YouTube`}
              className="group/media relative flex h-[240px] items-center justify-center overflow-hidden border-[3px] border-[#555] bg-bg-secondary shadow-pixel sm:h-[320px]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeMedia.thumbnailSrc}
                alt={`${product.name} video thumbnail`}
                className="h-full w-full object-cover transition-opacity group-hover/media:opacity-90"
              />
              <span className="absolute flex h-16 w-16 items-center justify-center border-[3px] border-black bg-accent-red/90 shadow-pixel sm:h-20 sm:w-20">
                <span className="ml-1 border-y-[12px] border-l-[20px] border-y-transparent border-l-white sm:border-y-[14px] sm:border-l-[24px]" />
              </span>
            </a>
          ) : (
            <div className="relative flex h-[240px] items-center justify-center border-[3px] border-[#555] bg-bg-secondary p-4 shadow-pixel sm:h-[320px] sm:p-6">
              <Image
                src={activeMedia.thumbnailSrc}
                alt={product.name}
                width={280}
                height={280}
                unoptimized
                className="object-contain"
              />
            </div>
          )}
          {product.images.length > 1 && (
            <div className="mt-4 flex gap-2 overflow-x-auto">
              {product.images.map((source) => {
                const thumbMedia = resolveProductMedia(source);

                if (thumbMedia.youtubeUrl) {
                  return (
                    <a
                      key={source}
                      href={thumbMedia.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Watch video on YouTube"
                      onMouseEnter={() => setActiveSource(source)}
                      onFocus={() => setActiveSource(source)}
                      className={cn(
                        "relative h-16 w-24 shrink-0 overflow-hidden border-2 border-black bg-bg-card",
                        activeSource === source && "ring-2 ring-accent-green",
                      )}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={thumbMedia.thumbnailSrc}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </a>
                  );
                }

                return (
                  <button
                    key={source}
                    type="button"
                    onClick={() => setActiveSource(source)}
                    className={cn(
                      "relative h-16 w-16 shrink-0 border-2 border-black bg-bg-card",
                      activeSource === source && "ring-2 ring-accent-green",
                    )}
                  >
                    <Image
                      src={thumbMedia.thumbnailSrc}
                      alt=""
                      fill
                      unoptimized
                      className="object-contain p-1"
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div>
          <span
            className="inline-block border-2 border-black px-2 py-0.5 font-retro text-sm uppercase"
            style={{
              backgroundColor: tierStyle.bg,
              color: tierStyle.text,
            }}
          >
            {tierStyle.label}
          </span>
          <h1 className="mt-4 font-pixel text-sm leading-relaxed sm:text-base">
            {product.name}
          </h1>
          {product.category && (
            <Link
              href={`/store?category=${product.category.slug}`}
              className="mt-2 inline-block font-retro text-lg text-text-diamond hover:underline"
            >
              {product.category.name}
            </Link>
          )}
          <p className="mt-4 font-retro text-2xl text-text-gold">
            {formatPrice(product.price, currency)}
            {onSale && (
              <span className="ml-3 text-lg text-text-secondary line-through">
                {formatPrice(product.comparePrice!, currency)}
              </span>
            )}
          </p>
          {product.shortDescription && (
            <p className="mt-4 font-retro text-xl text-text-primary">
              {product.shortDescription}
            </p>
          )}
          {product.stock !== -1 && (
            <p className="mt-2 font-body text-sm text-text-secondary">
              {product.stock > 0
                ? `${product.stock} left in stock`
                : "Out of stock"}
            </p>
          )}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <MinecraftButton
              type="button"
              onClick={() => handleAddToCart(false)}
              disabled={product.stock === 0}
            >
              ADD TO CART
            </MinecraftButton>
            <MinecraftButton
              type="button"
              variant="gold"
              onClick={() => handleAddToCart(true)}
              disabled={product.stock === 0}
            >
              BUY NOW
            </MinecraftButton>
          </div>
          {product.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="border border-black bg-bg-stone px-2 font-retro text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {product.longDescription && (
        <section className="mt-12 border-[3px] border-[#555] bg-bg-card p-6 shadow-pixel">
          <h2 className="font-pixel text-xs text-text-gold">DESCRIPTION</h2>
          <div className="prose prose-invert mt-4 max-w-none font-body text-text-secondary prose-headings:font-retro prose-headings:text-text-gold prose-a:text-text-accent">
            <ReactMarkdown>{product.longDescription}</ReactMarkdown>
          </div>
        </section>
      )}

      {product.whatsIncluded.length > 0 && (
        <section className="mt-8 border-[3px] border-[#555] bg-bg-secondary p-6 shadow-pixel">
          <h2 className="font-pixel text-xs text-text-gold">
            WHAT&apos;S INCLUDED
          </h2>
          <ul className="mt-4 space-y-2">
            {product.whatsIncluded.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 font-body text-text-primary"
              >
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-accent-green" />
                {item}
              </li>
            ))}
          </ul>
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="font-pixel text-xs text-text-gold">RELATED PRODUCTS</h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} currency={currency} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
