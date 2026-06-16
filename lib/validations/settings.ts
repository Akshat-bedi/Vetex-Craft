import { z } from "zod";

export const updateSettingsSchema = z.object({
  siteName: z.string().min(1).max(200).optional(),
  tagline: z.string().max(300).optional().nullable(),
  logoUrl: z.string().url().optional().nullable().or(z.literal("")),
  faviconUrl: z.string().url().optional().nullable().or(z.literal("")),
  currency: z.string().length(3).optional(),
  contactEmail: z.string().email().optional().nullable().or(z.literal("")),
  discordLink: z.string().url().optional().nullable().or(z.literal("")),
  twitterLink: z.string().url().optional().nullable().or(z.literal("")),
  youtubeLink: z.string().url().optional().nullable().or(z.literal("")),
  instagramLink: z.string().url().optional().nullable().or(z.literal("")),
  tiktokLink: z.string().url().optional().nullable().or(z.literal("")),
  stripeEnabled: z.boolean().optional(),
  manualPaymentInstructions: z.string().optional().nullable(),
  defaultDeliveryInstructions: z.string().optional().nullable(),
  metaTitle: z.string().max(200).optional().nullable(),
  metaDescription: z.string().max(500).optional().nullable(),
  ogImageUrl: z.string().url().optional().nullable().or(z.literal("")),
});
