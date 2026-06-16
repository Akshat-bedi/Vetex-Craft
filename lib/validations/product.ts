import { z } from "zod";

const tierEnum = z.enum(["WOOD", "IRON", "GOLD", "DIAMOND", "NETHERITE"]);
const statusEnum = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);

export const createProductSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).optional(),
  categoryId: z.string().min(1),
  shortDescription: z.string().max(500).optional().nullable(),
  longDescription: z.string().optional().nullable(),
  images: z.array(z.string()).default([]),
  price: z.number().positive(),
  comparePrice: z.number().positive().optional().nullable(),
  tier: tierEnum.default("WOOD"),
  tags: z.array(z.string()).default([]),
  whatsIncluded: z.array(z.string()).default([]),
  stock: z.number().int().default(-1),
  featured: z.boolean().default(false),
  status: statusEnum.default("DRAFT"),
  paymentLink: z.string().url().optional().nullable().or(z.literal("")),
  deliveryInstructions: z.string().optional().nullable(),
});

export const updateProductSchema = createProductSchema.partial();

export type CreateProductInput = z.infer<typeof createProductSchema>;
