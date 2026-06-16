import { notFound } from "next/navigation";
import { OrderDetailForm } from "@/components/admin/OrderDetailForm";
import { prisma } from "@/lib/db";
import { parseStringArray } from "@/lib/product";

type PageProps = { params: { id: string } };

export default async function AdminOrderDetailPage({ params }: PageProps) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      items: { include: { product: true } },
    },
  });

  if (!order) {
    notFound();
  }

  return (
    <OrderDetailForm
      order={{
        id: order.id,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        discordUsername: order.discordUsername,
        status: order.status,
        subtotal: order.subtotal,
        discount: order.discount,
        total: order.total,
        couponCode: order.couponCode,
        stripeSessionId: order.stripeSessionId,
        internalNotes: order.internalNotes,
        createdAt: order.createdAt.toISOString(),
        items: order.items.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price,
          product: {
            name: item.product.name,
            slug: item.product.slug,
            images: parseStringArray(item.product.images),
            deliveryInstructions: item.product.deliveryInstructions,
          },
        })),
      }}
    />
  );
}
