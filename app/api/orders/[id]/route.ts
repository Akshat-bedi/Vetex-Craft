import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { jsonError, zodErrorResponse } from "@/lib/api-utils";
import type { Prisma } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/db";
import { parseStringArray } from "@/lib/product";
import { updateOrderSchema } from "@/lib/validations/order";

type RouteParams = { params: { id: string } };

const orderInclude = {
  items: { include: { product: { include: { category: true } } } },
  coupon: true,
} satisfies Prisma.OrderInclude;

type OrderWithItems = Prisma.OrderGetPayload<{ include: typeof orderInclude }>;

function serializeOrder(order: OrderWithItems) {
  return {
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
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    items: order.items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      price: item.price,
      product: {
        id: item.product.id,
        name: item.product.name,
        slug: item.product.slug,
        images: parseStringArray(item.product.images),
        deliveryInstructions: item.product.deliveryInstructions,
      },
    })),
  };
}

export async function GET(_request: Request, { params }: RouteParams) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: orderInclude,
  });

  if (!order) {
    return jsonError("Order not found", 404);
  }

  return NextResponse.json(serializeOrder(order));
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const admin = await requireAdmin();
  if (admin.response) return admin.response;

  try {
    const body = await request.json();
    const parsed = updateOrderSchema.safeParse(body);

    if (!parsed.success) {
      return zodErrorResponse(parsed.error);
    }

    const existing = await prisma.order.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return jsonError("Order not found", 404);
    }

    const order = await prisma.order.update({
      where: { id: params.id },
      data: {
        ...(parsed.data.status !== undefined
          ? { status: parsed.data.status }
          : {}),
        ...(parsed.data.internalNotes !== undefined
          ? { internalNotes: parsed.data.internalNotes }
          : {}),
      },
      include: orderInclude,
    });

    return NextResponse.json(serializeOrder(order));
  } catch (error) {
    console.error("Update order failed:", error);
    return jsonError("Failed to update order", 500);
  }
}
