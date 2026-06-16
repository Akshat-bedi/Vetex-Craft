import { prisma } from "@/lib/db";

export async function getSiteSettings() {
  return prisma.siteSettings.findUnique({ where: { id: "singleton" } });
}

export async function getPublishedProducts() {
  return prisma.product.findMany({
    where: { status: "PUBLISHED" },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getCategoriesWithCounts() {
  const categories = await prisma.category.findMany({
    orderBy: { displayOrder: "asc" },
    include: {
      products: {
        where: { status: "PUBLISHED" },
        select: { id: true },
      },
    },
  });

  return categories.map(({ products, ...category }) => ({
    ...category,
    _count: { products: products.length },
  }));
}
