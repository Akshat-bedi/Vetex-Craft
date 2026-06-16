import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getSiteSettings } from "@/lib/data";
import { prisma } from "@/lib/db";
import { sendOrderConfirmationEmail } from "@/lib/mail";
import { getStripeOrThrow } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 503 },
    );
  }

  try {
    const stripe = getStripeOrThrow();
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 },
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (error) {
      console.error("Webhook signature verification failed:", error);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;

      if (orderId) {
        const order = await prisma.order.update({
          where: { id: orderId },
          data: { status: "PROCESSING" },
        });

        const settings = await getSiteSettings();

        await sendOrderConfirmationEmail({
          orderId: order.id,
          customerEmail: order.customerEmail,
          customerName: order.customerName,
          total: order.total,
          currency: settings?.currency ?? "USD",
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 },
    );
  }
}
