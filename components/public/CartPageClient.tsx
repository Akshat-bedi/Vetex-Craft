"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import {
  MinecraftButton,
  MinecraftLinkButton,
} from "@/components/public/MinecraftButton";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";

export function CartPageClient({ currency = "USD" }: { currency?: string }) {
  const {
    items,
    subtotal,
    discount,
    total,
    appliedCoupon,
    setAppliedCoupon,
    updateQuantity,
    removeItem,
  } = useCart();

  const [couponInput, setCouponInput] = useState(appliedCoupon?.code ?? "");
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);

  async function applyCoupon() {
    setCouponError(null);
    setCouponLoading(true);

    try {
      const response = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponInput, subtotal }),
      });

      const data = await response.json();

      if (!response.ok) {
        setCouponError(data.error ?? "Invalid coupon");
        setAppliedCoupon(null);
        return;
      }

      setAppliedCoupon({ code: data.code, discount: data.discount });
    } catch {
      setCouponError("Failed to validate coupon.");
    } finally {
      setCouponLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
        <h1 className="font-pixel text-sm text-text-accent">YOUR CART</h1>
        <p className="mt-4 font-retro text-xl text-text-secondary">
          Your cart is empty.
        </p>
        <div className="mt-8">
          <MinecraftLinkButton href="/store">BROWSE STORE</MinecraftLinkButton>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="font-pixel text-sm text-text-accent sm:text-base">
        YOUR CART
      </h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <ul className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <li
              key={item.productId}
              className="flex gap-4 border-[3px] border-[#555] bg-bg-card p-4 shadow-pixel"
            >
              <div className="relative h-24 w-24 shrink-0 bg-bg-secondary">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  unoptimized
                  className="object-contain p-2"
                />
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <Link
                  href={`/store/${item.slug}`}
                  className="font-retro text-xl text-text-primary hover:text-text-accent"
                >
                  {item.name}
                </Link>
                <p className="font-retro text-lg text-text-gold">
                  {formatPrice(item.price, currency)}
                </p>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center border-2 border-black">
                    <button
                      type="button"
                      className="bg-bg-stone px-2 py-1"
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity - 1)
                      }
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="min-w-[2rem] px-2 text-center font-retro">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      className="bg-bg-stone px-2 py-1"
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity + 1)
                      }
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.productId)}
                    className="text-accent-red"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit border-[3px] border-[#555] bg-bg-card p-6 shadow-pixel lg:sticky lg:top-24">
          <h2 className="font-pixel text-xs text-text-gold">ORDER SUMMARY</h2>

          <div className="mt-4 space-y-2 font-retro text-lg">
            <div className="flex justify-between text-text-secondary">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal, currency)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-accent-green">
                <span>Discount ({appliedCoupon?.code})</span>
                <span>-{formatPrice(discount, currency)}</span>
              </div>
            )}
            <div className="flex justify-between border-t-2 border-[#555] pt-2 text-xl text-text-gold">
              <span>Total</span>
              <span>{formatPrice(total, currency)}</span>
            </div>
          </div>

          <div className="mt-6">
            <label className="font-retro text-sm text-text-gold">
              Coupon code
            </label>
            <div className="mt-2 flex gap-2">
              <input
                value={couponInput}
                onChange={(event) => setCouponInput(event.target.value)}
                placeholder="CRAFT20"
                className="flex-1 border-[3px] border-[#555] bg-bg-secondary px-3 py-2 font-retro uppercase"
              />
              <MinecraftButton
                type="button"
                onClick={applyCoupon}
                disabled={couponLoading}
                className="px-4"
              >
                APPLY
              </MinecraftButton>
            </div>
            {couponError && (
              <p className="mt-2 font-body text-sm text-accent-red">
                {couponError}
              </p>
            )}
          </div>

          <div className="mt-6">
            <MinecraftLinkButton href="/checkout" className="w-full">
              CHECKOUT
            </MinecraftLinkButton>
          </div>
        </aside>
      </div>
    </div>
  );
}
