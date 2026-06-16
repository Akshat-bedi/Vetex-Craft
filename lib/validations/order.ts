import { z } from "zod";

export const orderItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(99),
});

export const createOrderSchema = z.object({
  customerName: z.string().min(2).max(100),
  customerEmail: z.string().email(),
  discordUsername: z.string().max(50).optional(),
  items: z.array(orderItemSchema).min(1),
  couponCode: z.string().optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

export const validateCouponSchema = z.object({
  code: z.string().min(1),
  subtotal: z.number().min(0),
});

export const updateOrderSchema = z.object({
  status: z
    .enum(["PENDING", "PROCESSING", "DELIVERED", "CANCELLED"])
    .optional(),
  internalNotes: z.string().optional().nullable(),
});

export const stripeCheckoutSchema = z.object({
  customerName: z.string().min(2).max(100),
  customerEmail: z.string().email(),
  discordUsername: z.string().max(50).optional(),
  items: z.array(orderItemSchema).min(1),
  couponCode: z.string().optional(),
});
