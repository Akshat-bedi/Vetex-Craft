import type { Metadata } from "next";

type SiteSettingsMeta = {
  siteName: string;
  metaTitle: string | null;
  metaDescription: string | null;
  ogImageUrl: string | null;
} | null;

export function buildProductMetadata(
  product: {
    name: string;
    shortDescription: string | null;
    images: string[];
    slug: string;
  },
  settings: SiteSettingsMeta,
): Metadata {
  const siteName = settings?.siteName ?? "Minecraft Store";
  const title = `${product.name} | ${siteName}`;
  const description =
    product.shortDescription ??
    settings?.metaDescription ??
    `Buy ${product.name} at ${siteName}. Premium Minecraft packages with instant delivery.`;

  const image = product.images[0] ?? settings?.ogImageUrl ?? undefined;
  const canonical = `/store/${product.slug}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      type: "website",
      url: canonical,
      siteName,
      ...(image && {
        images: [{ url: image, alt: product.name }],
      }),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      ...(image && { images: [image] }),
    },
  };
}
