import { NextResponse } from "next/server";
import { jsonError, zodErrorResponse } from "@/lib/api-utils";
import { getSiteSettings } from "@/lib/data";
import { prisma } from "@/lib/db";
import { createOrderFromInput } from "@/lib/orders";
import { getStripeOrThrow } from "@/lib/stripe";
import { stripeCheckoutSchema } from "@/lib/validations/order";

function getBaseUrl() {
  return (
    process.env.AUTH_URL ??
    process.env.NEXTAUTH_URL ??
    "http://localhost:3000"
  );
}

export async function POST(request: Request) {
  try {
    const settings = await getSiteSettings();

    if (!settings?.stripeEnabled) {
      return jsonError("Stripe payments are not enabled.", 400);
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return jsonError("Stripe is not configured on the server.", 503);
    }

    const body = await request.json();
    const parsed = stripeCheckoutSchema.safeParse(body);

    if (!parsed.success) {
      return zodErrorResponse(parsed.error);
    }

    const orderResult = await createOrderFromInput(parsed.data);

    if (!orderResult.success) {
      return jsonError(orderResult.error, orderResult.status);
    }

    const order = await prisma.order.findUnique({
      where: { id: orderResult.orderId },
      include: {
        items: { include: { product: true } },
      },
    });

    if (!order) {
      return jsonError("Order not found after creation.", 500);
    }

    const stripe = getStripeOrThrow();
    const baseUrl = getBaseUrl();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: parsed.data.customerEmail,
      line_items: order.items.map((item) => ({
        quantity: item.quantity,
        price_data: {
          currency: (settings.currency ?? "USD").toLowerCase(),
          unit_amount: Math.round(item.price * 100),
          product_data: {
            name: item.product.name,
            description: item.product.shortDescription ?? undefined,
          },
        },
      })),
      metadata: {
        orderId: order.id,
      },
      success_url: `${baseUrl}/orders/${order.id}?success=true`,
      cancel_url: `${baseUrl}/checkout?canceled=true`,
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: session.id },
    });

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
      orderId: order.id,
    });
  } catch (error) {
    console.error("Stripe checkout failed:", error);
    return jsonError("Failed to create checkout session", 500);
  }
}
