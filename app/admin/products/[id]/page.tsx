import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { prisma } from "@/lib/db";
import { parseStringArray } from "@/lib/product";

type PageProps = { params: { id: string } };

export default async function EditProductPage({ params }: PageProps) {
  const product = await prisma.product.findFirst({
    where: { OR: [{ id: params.id }, { slug: params.id }] },
  });

  if (!product) {
    notFound();
  }

  return (
    <ProductForm
      productId={product.id}
      initial={{
        name: product.name,
        slug: product.slug,
        categoryId: product.categoryId,
        shortDescription: product.shortDescription ?? "",
        longDescription: product.longDescription ?? "",
        images: parseStringArray(product.images),
        price: product.price,
        comparePrice: product.comparePrice,
        tier: product.tier,
        tags: parseStringArray(product.tags),
        whatsIncluded: parseStringArray(product.whatsIncluded),
        stock: product.stock,
        featured: product.featured,
        status: product.status,
        paymentLink: product.paymentLink ?? "",
        deliveryInstructions: product.deliveryInstructions ?? "",
      }}
    />
  );
}
