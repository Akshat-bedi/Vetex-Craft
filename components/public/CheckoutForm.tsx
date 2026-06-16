"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { MinecraftButton } from "@/components/public/MinecraftButton";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";

type CheckoutFormProps = {
  currency?: string;
  stripeEnabled: boolean;
  manualPaymentInstructions: string | null;
  defaultDeliveryInstructions: string | null;
};

export function CheckoutForm({
  currency = "USD",
  stripeEnabled,
  manualPaymentInstructions,
  defaultDeliveryInstructions,
}: CheckoutFormProps) {
  const router = useRouter();
  const {
    items,
    subtotal,
    discount,
    total,
    appliedCoupon,
    clearCart,
  } = useCart();

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [discordUsername, setDiscordUsername] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"manual" | "stripe">(
    stripeEnabled ? "stripe" : "manual",
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (!termsAccepted) {
      setError("Please accept the terms to continue.");
      return;
    }

    if (paymentMethod === "stripe" && stripeEnabled) {
      setError("Stripe checkout will be available in a future update. Use manual payment for now.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerEmail,
          discordUsername: discordUsername || undefined,
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
          couponCode: appliedCoupon?.code,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Failed to place order.");
        return;
      }

      clearCart();
      router.push(`/orders/${data.orderId}`);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="font-pixel text-sm text-text-accent sm:text-base">CHECKOUT</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <fieldset className="border-[3px] border-[#555] bg-bg-card p-6 shadow-pixel">
            <legend className="px-2 font-retro text-xl text-text-gold">
              Customer info
            </legend>
            <div className="mt-4 space-y-4">
              <div>
                <label className="font-retro text-sm text-text-secondary">
                  Name *
                </label>
                <input
                  required
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                  className="mt-1 w-full border-[3px] border-[#555] bg-bg-secondary px-3 py-2 font-body"
                />
              </div>
              <div>
                <label className="font-retro text-sm text-text-secondary">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(event) => setCustomerEmail(event.target.value)}
                  className="mt-1 w-full border-[3px] border-[#555] bg-bg-secondary px-3 py-2 font-body"
                />
              </div>
              <div>
                <label className="font-retro text-sm text-text-secondary">
                  Discord username
                </label>
                <input
                  value={discordUsername}
                  onChange={(event) => setDiscordUsername(event.target.value)}
                  placeholder="player#1234"
                  className="mt-1 w-full border-[3px] border-[#555] bg-bg-secondary px-3 py-2 font-body"
                />
              </div>
            </div>
          </fieldset>

          <fieldset className="border-[3px] border-[#555] bg-bg-card p-6 shadow-pixel">
            <legend className="px-2 font-retro text-xl text-text-gold">
              Payment
            </legend>
            <div className="mt-4 space-y-3">
              {stripeEnabled && (
                <label className="flex cursor-pointer items-center gap-2 font-body">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "stripe"}
                    onChange={() => setPaymentMethod("stripe")}
                  />
                  Pay with Stripe (card)
                </label>
              )}
              <label className="flex cursor-pointer items-center gap-2 font-body">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "manual"}
                  onChange={() => setPaymentMethod("manual")}
                />
                Manual payment
              </label>
            </div>
            {paymentMethod === "manual" && manualPaymentInstructions && (
              <div className="mt-4 border-2 border-black bg-bg-secondary p-4 font-body text-sm text-text-secondary whitespace-pre-wrap">
                {manualPaymentInstructions}
              </div>
            )}
          </fieldset>

          <label className="flex items-start gap-2 font-body text-sm">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(event) => setTermsAccepted(event.target.checked)}
              className="mt-1 accent-accent-green"
            />
            I agree to the terms of service and understand that digital products
            are non-refundable except as stated in our FAQ.
          </label>

          {error && (
            <p className="border-2 border-accent-red bg-bg-nether p-3 font-retro text-accent-red">
              {error}
            </p>
          )}

          <MinecraftButton type="submit" disabled={loading} className="w-full">
            {loading ? "PLACING ORDER..." : "PLACE ORDER"}
          </MinecraftButton>
        </div>

        <aside className="h-fit border-[3px] border-[#555] bg-bg-card p-6 shadow-pixel">
          <h2 className="font-pixel text-xs text-text-gold">ORDER SUMMARY</h2>
          <ul className="mt-4 space-y-3">
            {items.map((item) => (
              <li key={item.productId} className="flex gap-3">
                <div className="relative h-12 w-12 shrink-0 bg-bg-secondary">
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    unoptimized
                    className="object-contain"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-retro text-sm">{item.name}</p>
                  <p className="text-text-secondary">
                    ×{item.quantity} — {formatPrice(item.price * item.quantity, currency)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-1 border-t-2 border-[#555] pt-4 font-retro">
            <div className="flex justify-between text-text-secondary">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal, currency)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-accent-green">
                <span>Discount</span>
                <span>-{formatPrice(discount, currency)}</span>
              </div>
            )}
            <div className="flex justify-between text-xl text-text-gold">
              <span>Total</span>
              <span>{formatPrice(total, currency)}</span>
            </div>
          </div>
          {defaultDeliveryInstructions && (
            <p className="mt-4 font-body text-xs text-text-secondary">
              {defaultDeliveryInstructions}
            </p>
          )}
        </aside>
      </div>
    </form>
  );
}
