"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import { useEffect } from "react";
import { MinecraftLinkButton } from "@/components/public/MinecraftButton";
import { useCart } from "@/hooks/useCart";
import { cn, formatPrice } from "@/lib/utils";

type CartDrawerProps = {
  currency?: string;
};

export function CartDrawer({ currency = "USD" }: CartDrawerProps) {
  const {
    items,
    itemCount,
    subtotal,
    discount,
    total,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
  } = useCart();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true">
      <button
        type="button"
        aria-label="Close cart"
        className="absolute inset-0 bg-black/60"
        onClick={closeCart}
      />

      <aside
        className={cn(
          "absolute right-0 top-0 flex h-full w-full max-w-full flex-col sm:max-w-md",
          "border-l-[3px] border-[#555] bg-bg-secondary shadow-pixel",
          "animate-slide-in-right",
        )}
      >
        <header className="flex items-center justify-between border-b-[3px] border-[#555] bg-bg-card px-4 py-3 sm:px-5 sm:py-4">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-text-accent" />
            <h2 className="font-pixel text-xs text-text-accent">YOUR CART</h2>
            <span className="font-retro text-lg text-text-gold">({itemCount})</span>
          </div>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close"
            className="pixel-hover border-2 border-black bg-bg-stone p-1 text-text-primary"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <ShoppingCart className="h-12 w-12 text-text-secondary" />
              <p className="font-retro text-xl text-text-secondary">
                Your inventory is empty
              </p>
              <MinecraftLinkButton href="/store" onClick={closeCart}>
                BROWSE STORE
              </MinecraftLinkButton>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={item.productId}
                  className="flex gap-3 border-[3px] border-[#555] bg-bg-card p-3 shadow-pixel"
                >
                  <div className="relative h-16 w-16 shrink-0 bg-bg-primary">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      unoptimized
                      className="object-contain p-1"
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <Link
                      href={`/store/${item.slug}`}
                      onClick={closeCart}
                      className="truncate font-retro text-lg text-text-primary hover:text-text-accent"
                    >
                      {item.name}
                    </Link>
                    <p className="font-retro text-xl text-text-gold">
                      {formatPrice(item.price, currency)}
                    </p>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center border-2 border-black">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          className="bg-bg-stone px-2 py-1 hover:bg-bg-dirt"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1)
                          }
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="min-w-[2rem] bg-bg-secondary px-2 py-1 text-center font-retro text-lg">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          className="bg-bg-stone px-2 py-1 hover:bg-bg-dirt"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1)
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <button
                        type="button"
                        aria-label="Remove item"
                        className="text-accent-red hover:text-text-primary"
                        onClick={() => removeItem(item.productId)}
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <footer className="border-t-[3px] border-[#555] bg-bg-card p-5">
            <div className="mb-4 space-y-1">
              <div className="flex items-center justify-between font-retro text-lg text-text-secondary">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal, currency)}</span>
              </div>
              {discount > 0 && (
                <div className="flex items-center justify-between font-retro text-lg text-accent-green">
                  <span>Discount</span>
                  <span>-{formatPrice(discount, currency)}</span>
                </div>
              )}
              <div className="flex items-center justify-between font-retro text-2xl text-text-gold">
                <span>Total</span>
                <span>{formatPrice(total, currency)}</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <MinecraftLinkButton
                href="/cart"
                className="w-full"
                onClick={closeCart}
              >
                VIEW CART
              </MinecraftLinkButton>
              <MinecraftLinkButton
                href="/checkout"
                variant="gold"
                className="w-full"
                onClick={closeCart}
              >
                CHECKOUT
              </MinecraftLinkButton>
            </div>
          </footer>
        )}
      </aside>
    </div>
  );
}
