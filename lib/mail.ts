import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

type OrderEmailPayload = {
  orderId: string;
  customerEmail: string;
  customerName: string;
  total: number;
  currency: string;
};

export async function sendOrderConfirmationEmail(
  payload: OrderEmailPayload,
): Promise<void> {
  if (!resend || !process.env.FROM_EMAIL) {
    return;
  }

  const formattedTotal = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: payload.currency,
  }).format(payload.total);

  await resend.emails.send({
    from: process.env.FROM_EMAIL,
    to: payload.customerEmail,
    subject: `Order confirmed — #${payload.orderId.slice(-8).toUpperCase()}`,
    html: `
      <p>Hi ${payload.customerName},</p>
      <p>Your order <strong>#${payload.orderId.slice(-8).toUpperCase()}</strong> has been received.</p>
      <p>Total: <strong>${formattedTotal}</strong></p>
      <p>View your order status at ${process.env.AUTH_URL ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/orders/${payload.orderId}</p>
    `,
  });
}
