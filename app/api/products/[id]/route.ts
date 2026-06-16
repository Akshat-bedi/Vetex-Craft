import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { jsonError, zodErrorResponse } from "@/lib/api-utils";
import { prisma } from "@/lib/db";
import { parseStringArray, toProductCard } from "@/lib/product";
import { slugify } from "@/lib/utils";
import { updateProductSchema } from "@/lib/validations/product";

type RouteParams = { params: { id: string } };

async function findProduct(id: string) {
  return prisma.product.findFirst({
    where: { OR: [{ id }, { slug: id }] },
    include: { category: true },
  });
}

export async function GET(_request: Request, { params }: RouteParams) {
  const admin = await requireAdmin();
  const isAdmin = !admin.response;

  const product = await prisma.product.findFirst({
    where: {
      OR: [{ id: params.id }, { slug: params.id }],
      ...(!isAdmin ? { status: "PUBLISHED" } : {}),
    },
    include: { category: true },
  });

  if (!product) {
    return jsonError("Product not found", 404);
  }

  return NextResponse.json({
    ...toProductCard(product),
    longDescription: product.longDescription,
    tags: parseStringArray(product.tags),
    whatsIncluded: parseStringArray(product.whatsIncluded),
    stock: product.stock,
    paymentLink: product.paymentLink,
    deliveryInstructions: product.deliveryInstructions,
    status: product.status,
    categoryId: product.categoryId,
  });
}

export async function PUT(request: Request, { params }: RouteParams) {
  const admin = await requireAdmin();
  if (admin.response) return admin.response;

  try {
    const existing = await findProduct(params.id);
    if (!existing) {
      return jsonError("Product not found", 404);
    }

    const body = await request.json();
    const parsed = updateProductSchema.safeParse(body);

    if (!parsed.success) {
      return zodErrorResponse(parsed.error);
    }

    const data = parsed.data;
    const slug =
      data.slug?.trim() ||
      (data.name ? slugify(data.name) : existing.slug);

    if (slug !== existing.slug) {
      const conflict = await prisma.product.findUnique({ where: { slug } });
      if (conflict) {
        return jsonError("A product with this slug already exists.", 409);
      }
    }

    if (data.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: data.categoryId },
      });
      if (!category) {
        return jsonError("Category not found.", 404);
      }
    }

    const product = await prisma.product.update({
      where: { id: existing.id },
      data: {
        ...(data.name !== undefined ? { name: data.name } : {}),
        slug,
        ...(data.categoryId !== undefined
          ? { categoryId: data.categoryId }
          : {}),
        ...(data.shortDescription !== undefined
          ? { shortDescription: data.shortDescription }
          : {}),
        ...(data.longDescription !== undefined
          ? { longDescription: data.longDescription }
          : {}),
        ...(data.images !== undefined ? { images: data.images } : {}),
        ...(data.price !== undefined ? { price: data.price } : {}),
        ...(data.comparePrice !== undefined
          ? { comparePrice: data.comparePrice }
          : {}),
        ...(data.tier !== undefined ? { tier: data.tier } : {}),
        ...(data.tags !== undefined ? { tags: data.tags } : {}),
        ...(data.whatsIncluded !== undefined
          ? { whatsIncluded: data.whatsIncluded }
          : {}),
        ...(data.stock !== undefined ? { stock: data.stock } : {}),
        ...(data.featured !== undefined ? { featured: data.featured } : {}),
        ...(data.status !== undefined ? { status: data.status } : {}),
        ...(data.paymentLink !== undefined
          ? { paymentLink: data.paymentLink || null }
          : {}),
        ...(data.deliveryInstructions !== undefined
          ? { deliveryInstructions: data.deliveryInstructions }
          : {}),
      },
      include: { category: true },
    });

    return NextResponse.json({
      ...toProductCard(product),
      status: product.status,
      tags: parseStringArray(product.tags),
      whatsIncluded: parseStringArray(product.whatsIncluded),
    });
  } catch (error) {
    console.error("Update product failed:", error);
    return jsonError("Failed to update product", 500);
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const admin = await requireAdmin();
  if (admin.response) return admin.response;

  const existing = await findProduct(params.id);
  if (!existing) {
    return jsonError("Product not found", 404);
  }

  const orderItemCount = await prisma.orderItem.count({
    where: { productId: existing.id },
  });

  if (orderItemCount > 0) {
    await prisma.product.update({
      where: { id: existing.id },
      data: { status: "ARCHIVED" },
    });
    return NextResponse.json({
      message: "Product archived (has existing orders).",
      archived: true,
    });
  }

  await prisma.product.delete({ where: { id: existing.id } });
  return NextResponse.json({ message: "Product deleted." });
}
