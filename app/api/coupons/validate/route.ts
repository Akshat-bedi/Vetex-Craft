import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  calculateCouponDiscount,
  isCouponValid,
} from "@/lib/coupon";
import { validateCouponSchema } from "@/lib/validations/order";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = validateCouponSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { code, subtotal } = parsed.data;
    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon) {
      return NextResponse.json({ error: "Invalid coupon code." }, { status: 404 });
    }

    const validationError = isCouponValid(coupon, subtotal);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const discount = calculateCouponDiscount(coupon, subtotal);

    return NextResponse.json({
      code: coupon.code,
      type: coupon.type,
      discount,
      total: Math.max(0, subtotal - discount),
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to validate coupon" },
      { status: 500 },
    );
  }
}
