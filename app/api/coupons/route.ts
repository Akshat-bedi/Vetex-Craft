import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { jsonError, zodErrorResponse } from "@/lib/api-utils";
import { prisma } from "@/lib/db";
import { createCouponSchema } from "@/lib/validations/coupon";

export async function GET() {
  const admin = await requireAdmin();
  if (admin.response) return admin.response;

  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(coupons);
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (admin.response) return admin.response;

  try {
    const body = await request.json();
    const parsed = createCouponSchema.safeParse(body);

    if (!parsed.success) {
      return zodErrorResponse(parsed.error);
    }

    const data = parsed.data;
    const code = data.code.toUpperCase();

    const existing = await prisma.coupon.findUnique({ where: { code } });
    if (existing) {
      return jsonError("Coupon code already exists.", 409);
    }

    const coupon = await prisma.coupon.create({
      data: {
        code,
        type: data.type,
        value: data.value,
        minOrderValue: data.minOrderValue,
        usageLimit: data.usageLimit,
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
        active: data.active,
      },
    });

    return NextResponse.json(coupon, { status: 201 });
  } catch (error) {
    console.error("Create coupon failed:", error);
    return jsonError("Failed to create coupon", 500);
  }
}
