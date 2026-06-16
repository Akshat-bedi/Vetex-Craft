"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { MinecraftButton } from "@/components/public/MinecraftButton";
import { useCart } from "@/hooks/useCart";
import { getTierStyle } from "@/lib/tier";
import { formatPrice, resolveProductMedia } from "@/lib/utils";
import type { ProductCardData } from "@/types/product";

type ProductCardProps = {
  product: ProductCardData;
  currency?: string;
};

export function ProductCard({ product, currency = "USD" }: ProductCardProps) {
  const { addItem } = useCart();
  const tierStyle = getTierStyle(product.tier);
  const media = resolveProductMedia(product.images[0]);
  const onSale =
    product.comparePrice != null && product.comparePrice > product.price;
  const discountPercent = onSale
    ? Math.round(
        ((product.comparePrice! - product.price) / product.comparePrice!) *
          100,
      )
    : 0;

  const borderColor = product.featured
    ? "var(--accent-gold)"
    : "var(--accent-diamond)";

  const glowColor = product.featured
    ? "rgba(255, 170, 0, 0.45)"
    : "rgba(93, 230, 230, 0.45)";

  function handleAddToCart() {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: media.cartImageSrc,
    });
  }

  return (
    <article
      className="pixel-hover-card group relative flex flex-col bg-bg-card border-[3px] border-solid shadow-pixel"
      style={
        {
          borderColor,
          ["--glow-color" as string]: glowColor,
        } as CSSProperties
      }
    >
      <span
        className="absolute left-2 top-2 z-10 border-2 border-black px-2 py-0.5 font-retro text-sm uppercase"
        style={{
          backgroundColor: tierStyle.bg,
          borderColor: tierStyle.border,
          color: tierStyle.text,
        }}
      >
        {tierStyle.label}
      </span>

      {onSale && (
        <span className="absolute right-2 top-2 z-10 border-2 border-black bg-accent-red px-2 py-0.5 font-retro text-sm text-white">
          -{discountPercent}%
        </span>
      )}

      {media.youtubeUrl ? (
        <a
          href={media.youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Watch ${product.name} preview on YouTube`}
          className="group/media relative flex h-[200px] items-center justify-center overflow-hidden bg-bg-secondary"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={media.thumbnailSrc}
            alt={`${product.name} video thumbnail`}
            className="h-full w-full object-cover transition-opacity group-hover/media:opacity-90"
          />
          <span className="absolute flex h-14 w-14 items-center justify-center border-[3px] border-black bg-accent-red/90 shadow-pixel">
            <span className="ml-1 border-y-[10px] border-l-[16px] border-y-transparent border-l-white" />
          </span>
        </a>
      ) : (
        <Link
          href={`/store/${product.slug}`}
          className="relative flex h-[200px] items-center justify-center bg-bg-secondary p-4"
        >
          <Image
            src={media.thumbnailSrc}
            alt={product.name}
            width={200}
            height={200}
            unoptimized
            className="h-[200px] w-[200px] object-contain"
          />
        </Link>
      )}

      <div className="flex flex-1 flex-col gap-3 border-t-[3px] border-[#555] p-4">
        {product.category && (
          <span className="font-retro text-sm uppercase text-text-diamond">
            {product.category.name}
          </span>
        )}

        <Link href={`/store/${product.slug}`}>
          <h3 className="font-pixel text-[10px] leading-relaxed text-text-primary transition-colors group-hover:text-text-accent sm:text-xs">
            {product.name}
          </h3>
        </Link>

        {product.shortDescription && (
          <p className="line-clamp-2 font-body text-sm text-text-secondary">
            {product.shortDescription}
          </p>
        )}

        <div className="mt-auto flex flex-wrap items-end gap-2">
          <span className="font-retro text-2xl text-text-gold">
            {formatPrice(product.price, currency)}
          </span>
          {onSale && (
            <span className="font-retro text-lg text-text-secondary line-through">
              {formatPrice(product.comparePrice!, currency)}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <MinecraftButton
            type="button"
            className="flex-1"
            onClick={handleAddToCart}
          >
            ADD TO CART
          </MinecraftButton>
          <MinecraftButton
            type="button"
            variant="gold"
            className="flex-1"
            onClick={handleAddToCart}
          >
            BUY NOW
          </MinecraftButton>
        </div>
      </div>
    </article>
  );
}
