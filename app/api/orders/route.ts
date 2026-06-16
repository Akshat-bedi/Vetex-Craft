import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { jsonError, zodErrorResponse } from "@/lib/api-utils";
import { prisma } from "@/lib/db";
import { createOrderFromInput } from "@/lib/orders";
import { createOrderSchema } from "@/lib/validations/order";

export async function GET(request: Request) {
  const admin = await requireAdmin();
  if (admin.response) return admin.response;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const limit = Math.min(Number(searchParams.get("limit") ?? 50), 100);

  const orders = await prisma.order.findMany({
    where: status
      ? { status: status as "PENDING" | "PROCESSING" | "DELIVERED" | "CANCELLED" }
      : undefined,
    include: {
      items: { include: { product: true } },
      coupon: true,
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return NextResponse.json(
    orders.map((order) => ({
      id: order.id,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      discordUsername: order.discordUsername,
      status: order.status,
      subtotal: order.subtotal,
      discount: order.discount,
      total: order.total,
      couponCode: order.couponCode,
      createdAt: order.createdAt,
      itemCount: order.items.length,
      items: order.items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        price: item.price,
        productName: item.product.name,
      })),
    })),
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createOrderSchema.safeParse(body);

    if (!parsed.success) {
      return zodErrorResponse(parsed.error);
    }

    const result = await createOrderFromInput(parsed.data);

    if (!result.success) {
      return jsonError(result.error, result.status);
    }

    return NextResponse.json({
      orderId: result.orderId,
      status: result.status,
    });
  } catch (error) {
    console.error("Order creation failed:", error);
    return jsonError("Failed to create order", 500);
  }
}
