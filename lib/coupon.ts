import type { Coupon } from "@/lib/generated/prisma/client";

export function calculateCouponDiscount(
  coupon: Coupon,
  subtotal: number,
): number {
  if (subtotal < coupon.minOrderValue) {
    return 0;
  }

  if (coupon.type === "PERCENTAGE") {
    return Math.round(((subtotal * coupon.value) / 100) * 100) / 100;
  }

  return Math.min(coupon.value, subtotal);
}

export function isCouponValid(coupon: Coupon, subtotal: number): string | null {
  if (!coupon.active) {
    return "This coupon is no longer active.";
  }

  if (coupon.expiryDate && coupon.expiryDate < new Date()) {
    return "This coupon has expired.";
  }

  if (coupon.usageLimit > 0 && coupon.timesUsed >= coupon.usageLimit) {
    return "This coupon has reached its usage limit.";
  }

  if (subtotal < coupon.minOrderValue) {
    return `Minimum order value is $${coupon.minOrderValue.toFixed(2)}.`;
  }

  return null;
}
