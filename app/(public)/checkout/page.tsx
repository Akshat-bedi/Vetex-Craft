import { CheckoutGate } from "@/components/public/CheckoutGate";
import { getSiteSettings } from "@/lib/data";

export const metadata = {
  title: "Checkout | Minecraft Store",
};

export default async function CheckoutPage() {
  const settings = await getSiteSettings();

  return (
    <CheckoutGate
      currency={settings?.currency ?? "USD"}
      stripeEnabled={settings?.stripeEnabled ?? false}
      manualPaymentInstructions={settings?.manualPaymentInstructions ?? null}
      defaultDeliveryInstructions={settings?.defaultDeliveryInstructions ?? null}
    />
  );
}
