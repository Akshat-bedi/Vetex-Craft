import { prisma } from "@/lib/db";
import {
  calculateCouponDiscount,
  isCouponValid,
} from "@/lib/coupon";
import type { CreateOrderInput } from "@/lib/validations/order";

export type CreateOrderResult =
  | { success: true; orderId: string; status: string; total: number }
  | { success: false; error: string; status: number };

export async function createOrderFromInput(
  input: CreateOrderInput,
): Promise<CreateOrderResult> {
  const { customerName, customerEmail, discordUsername, items, couponCode } =
    input;

  const productIds = items.map((item) => item.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, status: "PUBLISHED" },
  });

  if (products.length !== productIds.length) {
    return {
      success: false,
      error: "One or more products are unavailable.",
      status: 400,
    };
  }

  const productMap = new Map(products.map((product) => [product.id, product]));

  let subtotal = 0;
  const orderItemsData: {
    productId: string;
    quantity: number;
    price: number;
  }[] = [];

  for (const item of items) {
    const product = productMap.get(item.productId)!;

    if (product.stock !== -1 && product.stock < item.quantity) {
      return {
        success: false,
        error: `${product.name} has insufficient stock.`,
        status: 400,
      };
    }

    subtotal += product.price * item.quantity;
    orderItemsData.push({
      productId: product.id,
      quantity: item.quantity,
      price: product.price,
    });
  }

  let discount = 0;
  let appliedCouponCode: string | undefined;

  if (couponCode) {
    const coupon = await prisma.coupon.findUnique({
      where: { code: couponCode.toUpperCase() },
    });

    if (!coupon) {
      return { success: false, error: "Invalid coupon code.", status: 400 };
    }

    const validationError = isCouponValid(coupon, subtotal);
    if (validationError) {
      return { success: false, error: validationError, status: 400 };
    }

    discount = calculateCouponDiscount(coupon, subtotal);
    appliedCouponCode = coupon.code;
  }

  const total = Math.max(0, subtotal - discount);

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        customerName,
        customerEmail,
        discordUsername,
        subtotal,
        discount,
        total,
        couponCode: appliedCouponCode,
        status: "PENDING",
        items: { create: orderItemsData },
      },
    });

    if (appliedCouponCode) {
      await tx.coupon.update({
        where: { code: appliedCouponCode },
        data: { timesUsed: { increment: 1 } },
      });
    }

    for (const item of orderItemsData) {
      const product = productMap.get(item.productId)!;
      if (product.stock !== -1) {
        await tx.product.update({
          where: { id: product.id },
          data: { stock: { decrement: item.quantity } },
        });
      }
    }

    return created;
  });

  return {
    success: true,
    orderId: order.id,
    status: order.status,
    total,
  };
}
