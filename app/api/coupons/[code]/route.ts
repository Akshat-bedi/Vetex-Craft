import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { jsonError, zodErrorResponse } from "@/lib/api-utils";
import { prisma } from "@/lib/db";
import { updateCouponSchema } from "@/lib/validations/coupon";

type RouteParams = { params: { code: string } };

export async function PUT(request: Request, { params }: RouteParams) {
  const admin = await requireAdmin();
  if (admin.response) return admin.response;

  try {
    const code = params.code.toUpperCase();
    const existing = await prisma.coupon.findUnique({ where: { code } });

    if (!existing) {
      return jsonError("Coupon not found", 404);
    }

    const body = await request.json();
    const parsed = updateCouponSchema.safeParse(body);

    if (!parsed.success) {
      return zodErrorResponse(parsed.error);
    }

    const data = parsed.data;

    const coupon = await prisma.coupon.update({
      where: { code },
      data: {
        ...(data.type !== undefined ? { type: data.type } : {}),
        ...(data.value !== undefined ? { value: data.value } : {}),
        ...(data.minOrderValue !== undefined
          ? { minOrderValue: data.minOrderValue }
          : {}),
        ...(data.usageLimit !== undefined
          ? { usageLimit: data.usageLimit }
          : {}),
        ...(data.expiryDate !== undefined
          ? {
              expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
            }
          : {}),
        ...(data.active !== undefined ? { active: data.active } : {}),
      },
    });

    return NextResponse.json(coupon);
  } catch (error) {
    console.error("Update coupon failed:", error);
    return jsonError("Failed to update coupon", 500);
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const admin = await requireAdmin();
  if (admin.response) return admin.response;

  const code = params.code.toUpperCase();
  const existing = await prisma.coupon.findUnique({ where: { code } });

  if (!existing) {
    return jsonError("Coupon not found", 404);
  }

  await prisma.coupon.delete({ where: { code } });
  return NextResponse.json({ message: "Coupon deleted." });
}
