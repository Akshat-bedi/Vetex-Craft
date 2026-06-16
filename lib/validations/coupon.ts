import { z } from "zod";

export const createCouponSchema = z.object({
  code: z.string().min(1).max(50),
  type: z.enum(["PERCENTAGE", "FIXED"]),
  value: z.number().positive(),
  minOrderValue: z.number().min(0).default(0),
  usageLimit: z.number().int().min(0).default(0),
  expiryDate: z.string().datetime().optional().nullable(),
  active: z.boolean().default(true),
});

export const updateCouponSchema = createCouponSchema
  .omit({ code: true })
  .partial();
