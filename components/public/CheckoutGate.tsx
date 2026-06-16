"use client";

import { MinecraftLinkButton } from "@/components/public/MinecraftButton";
import { CheckoutForm } from "@/components/public/CheckoutForm";
import { useCart } from "@/hooks/useCart";

type CheckoutGateProps = {
  currency: string;
  stripeEnabled: boolean;
  manualPaymentInstructions: string | null;
  defaultDeliveryInstructions: string | null;
};

export function CheckoutGate(props: CheckoutGateProps) {
  const { items } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="font-pixel text-sm text-text-accent">CHECKOUT</h1>
        <p className="mt-4 font-retro text-xl text-text-secondary">
          Your cart is empty.
        </p>
        <div className="mt-8">
          <MinecraftLinkButton href="/store">BROWSE STORE</MinecraftLinkButton>
        </div>
      </div>
    );
  }

  return <CheckoutForm {...props} />;
}
