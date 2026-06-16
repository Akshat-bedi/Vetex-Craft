import { z } from "zod";

export const createBannerSchema = z.object({
  title: z.string().min(1).max(200),
  subtitle: z.string().max(300).optional().nullable(),
  imageUrl: z.string().min(1),
  ctaText: z.string().max(100).optional().nullable(),
  ctaLink: z.string().max(500).optional().nullable(),
  active: z.boolean().default(true),
  displayOrder: z.number().int().default(0),
});

export const updateBannerSchema = createBannerSchema.partial();

export const createTestimonialSchema = z.object({
  username: z.string().min(1).max(100),
  avatarUrl: z.string().url().optional().nullable().or(z.literal("")),
  review: z.string().min(1).max(1000),
  rating: z.number().int().min(1).max(5).default(5),
  active: z.boolean().default(true),
});

export const updateTestimonialSchema = createTestimonialSchema.partial();

export const createFaqSchema = z.object({
  question: z.string().min(1).max(300),
  answer: z.string().min(1).max(2000),
  category: z.string().max(100).default("General"),
  displayOrder: z.number().int().default(0),
});

export const updateFaqSchema = createFaqSchema.partial();
