import { CartPageClient } from "@/components/public/CartPageClient";
import { getSiteSettings } from "@/lib/data";

export const metadata = {
  title: "Cart | Minecraft Store",
};

export default async function CartPage() {
  const settings = await getSiteSettings();

  return <CartPageClient currency={settings?.currency ?? "USD"} />;
}
