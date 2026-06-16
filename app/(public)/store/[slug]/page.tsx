import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductDetailClient } from "@/components/public/ProductDetailClient";
import { getSiteSettings } from "@/lib/data";
import { prisma } from "@/lib/db";
import { buildProductMetadata } from "@/lib/metadata";
import { parseStringArray, toProductCard } from "@/lib/product";

type PageProps = { params: { slug: string } };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const [product, settings] = await Promise.all([
    prisma.product.findFirst({
      where: { slug: params.slug, status: "PUBLISHED" },
    }),
    getSiteSettings(),
  ]);

  if (!product) {
    return { title: "Product Not Found" };
  }

  const images = parseStringArray(product.images);

  return buildProductMetadata(
    {
      name: product.name,
      shortDescription: product.shortDescription,
      images,
      slug: product.slug,
    },
    settings,
  );
}

export default async function ProductDetailPage({ params }: PageProps) {
  const product = await prisma.product.findFirst({
    where: { slug: params.slug, status: "PUBLISHED" },
    include: { category: true },
  });

  if (!product) {
    notFound();
  }

  const [related, settings] = await Promise.all([
    prisma.product.findMany({
      where: {
        status: "PUBLISHED",
        categoryId: product.categoryId,
        id: { not: product.id },
      },
      include: { category: true },
      take: 4,
    }),
    getSiteSettings(),
  ]);

  return (
    <ProductDetailClient
      product={{
        ...toProductCard(product),
        longDescription: product.longDescription,
        tags: parseStringArray(product.tags),
        whatsIncluded: parseStringArray(product.whatsIncluded),
        stock: product.stock,
        deliveryInstructions: product.deliveryInstructions,
      }}
      related={related.map(toProductCard)}
      currency={settings?.currency ?? "USD"}
    />
  );
}
