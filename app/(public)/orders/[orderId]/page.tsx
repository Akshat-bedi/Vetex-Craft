import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { OrderStatusBadge } from "@/components/public/OrderStatusBadge";
import { MinecraftLinkButton } from "@/components/public/MinecraftButton";
import { getSiteSettings } from "@/lib/data";
import { prisma } from "@/lib/db";
import { parseStringArray } from "@/lib/product";
import { formatPrice } from "@/lib/utils";

type PageProps = { params: { orderId: string } };

export const metadata = {
  title: "Order Confirmation | Minecraft Store",
};

export default async function OrderConfirmationPage({ params }: PageProps) {
  const [order, settings] = await Promise.all([
    prisma.order.findUnique({
      where: { id: params.orderId },
      include: {
        items: { include: { product: true } },
      },
    }),
    getSiteSettings(),
  ]);

  if (!order) {
    notFound();
  }

  const currency = settings?.currency ?? "USD";
  const defaultDelivery =
    settings?.defaultDeliveryInstructions ??
    "Check your email for delivery details.";

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="border-[3px] border-[#555] bg-bg-card p-8 shadow-pixel texture-overlay texture-grass">
        <p className="font-retro text-lg text-text-diamond">Order placed!</p>
        <h1 className="mt-2 font-pixel text-sm text-text-accent">
          ORDER #{order.id.slice(-8).toUpperCase()}
        </h1>
        <div className="mt-4">
          <OrderStatusBadge status={order.status} />
        </div>
        <p className="mt-4 font-body text-text-secondary">
          Thank you, {order.customerName}. A confirmation was sent to{" "}
          <span className="text-text-primary">{order.customerEmail}</span>.
        </p>
      </div>

      <section className="mt-8 border-[3px] border-[#555] bg-bg-secondary p-6 shadow-pixel">
        <h2 className="font-pixel text-xs text-text-gold">ITEMS</h2>
        <ul className="mt-4 space-y-4">
          {order.items.map((item) => {
            const images = parseStringArray(item.product.images);
            return (
              <li key={item.id} className="flex gap-4">
                <div className="relative h-16 w-16 shrink-0 bg-bg-card">
                  <Image
                    src={images[0] ?? "/textures/stone.png"}
                    alt=""
                    fill
                    unoptimized
                    className="object-contain p-1"
                  />
                </div>
                <div>
                  <Link
                    href={`/store/${item.product.slug}`}
                    className="font-retro text-lg text-text-primary hover:text-text-accent"
                  >
                    {item.product.name}
                  </Link>
                  <p className="font-body text-sm text-text-secondary">
                    ×{item.quantity} — {formatPrice(item.price * item.quantity, currency)}
                  </p>
                  {(item.product.deliveryInstructions || defaultDelivery) && (
                    <p className="mt-2 font-body text-xs text-text-diamond">
                      {item.product.deliveryInstructions ?? defaultDelivery}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
        <div className="mt-6 border-t-2 border-[#555] pt-4 font-retro text-lg">
          <div className="flex justify-between text-text-secondary">
            <span>Subtotal</span>
            <span>{formatPrice(order.subtotal, currency)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-accent-green">
              <span>Discount</span>
              <span>-{formatPrice(order.discount, currency)}</span>
            </div>
          )}
          <div className="flex justify-between text-xl text-text-gold">
            <span>Total</span>
            <span>{formatPrice(order.total, currency)}</span>
          </div>
        </div>
      </section>

      {order.status === "PENDING" && settings?.manualPaymentInstructions && (
        <section className="mt-6 border-[3px] border-[#555] bg-bg-nether p-6 shadow-pixel">
          <h2 className="font-pixel text-xs text-text-gold">PAYMENT INSTRUCTIONS</h2>
          <p className="mt-3 whitespace-pre-wrap font-body text-sm text-text-secondary">
            {settings.manualPaymentInstructions}
          </p>
          <p className="mt-2 font-retro text-sm text-text-gold">
            Include order ID: {order.id}
          </p>
        </section>
      )}

      <div className="mt-8 flex flex-wrap gap-4">
        <MinecraftLinkButton href="/store">CONTINUE SHOPPING</MinecraftLinkButton>
        {settings?.discordLink && (
          <MinecraftLinkButton href={settings.discordLink} variant="gold">
            JOIN DISCORD
          </MinecraftLinkButton>
        )}
      </div>
    </div>
  );
}
