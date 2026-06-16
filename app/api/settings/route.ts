import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { jsonError, zodErrorResponse } from "@/lib/api-utils";
import { getSiteSettings } from "@/lib/data";
import { prisma } from "@/lib/db";
import { updateSettingsSchema } from "@/lib/validations/settings";

function serializeSettings(
  settings: NonNullable<Awaited<ReturnType<typeof getSiteSettings>>>,
) {
  return {
    id: settings.id,
    siteName: settings.siteName,
    tagline: settings.tagline,
    logoUrl: settings.logoUrl,
    faviconUrl: settings.faviconUrl,
    currency: settings.currency,
    contactEmail: settings.contactEmail,
    discordLink: settings.discordLink,
    twitterLink: settings.twitterLink,
    youtubeLink: settings.youtubeLink,
    instagramLink: settings.instagramLink,
    tiktokLink: settings.tiktokLink,
    stripeEnabled: settings.stripeEnabled,
    manualPaymentInstructions: settings.manualPaymentInstructions,
    defaultDeliveryInstructions: settings.defaultDeliveryInstructions,
    metaTitle: settings.metaTitle,
    metaDescription: settings.metaDescription,
    ogImageUrl: settings.ogImageUrl,
  };
}

export async function GET() {
  const settings = await getSiteSettings();

  if (!settings) {
    return jsonError("Settings not found", 404);
  }

  return NextResponse.json(serializeSettings(settings));
}

export async function PUT(request: Request) {
  const admin = await requireAdmin();
  if (admin.response) return admin.response;

  try {
    const body = await request.json();
    const parsed = updateSettingsSchema.safeParse(body);

    if (!parsed.success) {
      return zodErrorResponse(parsed.error);
    }

    const data = parsed.data;

    const settings = await prisma.siteSettings.upsert({
      where: { id: "singleton" },
      update: {
        ...(data.siteName !== undefined ? { siteName: data.siteName } : {}),
        ...(data.tagline !== undefined ? { tagline: data.tagline } : {}),
        ...(data.logoUrl !== undefined
          ? { logoUrl: data.logoUrl || null }
          : {}),
        ...(data.faviconUrl !== undefined
          ? { faviconUrl: data.faviconUrl || null }
          : {}),
        ...(data.currency !== undefined ? { currency: data.currency } : {}),
        ...(data.contactEmail !== undefined
          ? { contactEmail: data.contactEmail || null }
          : {}),
        ...(data.discordLink !== undefined
          ? { discordLink: data.discordLink || null }
          : {}),
        ...(data.twitterLink !== undefined
          ? { twitterLink: data.twitterLink || null }
          : {}),
        ...(data.youtubeLink !== undefined
          ? { youtubeLink: data.youtubeLink || null }
          : {}),
        ...(data.instagramLink !== undefined
          ? { instagramLink: data.instagramLink || null }
          : {}),
        ...(data.tiktokLink !== undefined
          ? { tiktokLink: data.tiktokLink || null }
          : {}),
        ...(data.stripeEnabled !== undefined
          ? { stripeEnabled: data.stripeEnabled }
          : {}),
        ...(data.manualPaymentInstructions !== undefined
          ? { manualPaymentInstructions: data.manualPaymentInstructions }
          : {}),
        ...(data.defaultDeliveryInstructions !== undefined
          ? { defaultDeliveryInstructions: data.defaultDeliveryInstructions }
          : {}),
        ...(data.metaTitle !== undefined ? { metaTitle: data.metaTitle } : {}),
        ...(data.metaDescription !== undefined
          ? { metaDescription: data.metaDescription }
          : {}),
        ...(data.ogImageUrl !== undefined
          ? { ogImageUrl: data.ogImageUrl || null }
          : {}),
      },
      create: {
        id: "singleton",
        siteName: data.siteName ?? "My Minecraft Store",
        tagline: data.tagline ?? null,
        logoUrl: data.logoUrl || null,
        faviconUrl: data.faviconUrl || null,
        currency: data.currency ?? "USD",
        contactEmail: data.contactEmail || null,
        discordLink: data.discordLink || null,
        twitterLink: data.twitterLink || null,
        youtubeLink: data.youtubeLink || null,
        instagramLink: data.instagramLink || null,
        tiktokLink: data.tiktokLink || null,
        stripeEnabled: data.stripeEnabled ?? false,
        manualPaymentInstructions: data.manualPaymentInstructions ?? null,
        defaultDeliveryInstructions: data.defaultDeliveryInstructions ?? null,
        metaTitle: data.metaTitle ?? null,
        metaDescription: data.metaDescription ?? null,
        ogImageUrl: data.ogImageUrl || null,
      },
    });

    return NextResponse.json(serializeSettings(settings));
  } catch (error) {
    console.error("Update settings failed:", error);
    return jsonError("Failed to update settings", 500);
  }
}
