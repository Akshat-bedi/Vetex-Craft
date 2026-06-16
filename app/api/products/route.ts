import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { jsonError, zodErrorResponse } from "@/lib/api-utils";
import { getPublishedProducts } from "@/lib/data";
import { prisma } from "@/lib/db";
import { parseStringArray, toProductCard } from "@/lib/product";
import { slugify } from "@/lib/utils";
import { createProductSchema } from "@/lib/validations/product";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const featured = searchParams.get("featured");
  const status = searchParams.get("status");

  const admin = await requireAdmin();
  const isAdmin = !admin.response;

  if (isAdmin && (status || searchParams.get("all") === "true")) {
    const products = await prisma.product.findMany({
      where: {
        ...(status ? { status: status as "DRAFT" | "PUBLISHED" | "ARCHIVED" } : {}),
        ...(category
          ? { category: { slug: category } }
          : {}),
        ...(featured === "true" ? { featured: true } : {}),
      },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      products.map((product) => ({
        ...toProductCard(product),
        status: product.status,
        tags: parseStringArray(product.tags),
        whatsIncluded: parseStringArray(product.whatsIncluded),
        stock: product.stock,
        longDescription: product.longDescription,
        paymentLink: product.paymentLink,
        deliveryInstructions: product.deliveryInstructions,
        categoryId: product.categoryId,
      })),
    );
  }

  let products = await getPublishedProducts();

  if (category) {
    products = products.filter((product) => product.category.slug === category);
  }

  if (featured === "true") {
    products = products.filter((product) => product.featured);
  }

  return NextResponse.json(products.map(toProductCard));
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (admin.response) return admin.response;

  try {
    const body = await request.json();
    const parsed = createProductSchema.safeParse(body);

    if (!parsed.success) {
      return zodErrorResponse(parsed.error);
    }

    const data = parsed.data;
    const slug = data.slug?.trim() || slugify(data.name);

    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) {
      return jsonError("A product with this slug already exists.", 409);
    }

    const category = await prisma.category.findUnique({
      where: { id: data.categoryId },
    });
    if (!category) {
      return jsonError("Category not found.", 404);
    }

    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug,
        categoryId: data.categoryId,
        shortDescription: data.shortDescription ?? null,
        longDescription: data.longDescription ?? null,
        images: data.images,
        price: data.price,
        comparePrice: data.comparePrice ?? null,
        tier: data.tier,
        tags: data.tags,
        whatsIncluded: data.whatsIncluded,
        stock: data.stock,
        featured: data.featured,
        status: data.status,
        paymentLink: data.paymentLink || null,
        deliveryInstructions: data.deliveryInstructions ?? null,
      },
      include: { category: true },
    });

    return NextResponse.json(
      {
        ...toProductCard(product),
        status: product.status,
        tags: parseStringArray(product.tags),
        whatsIncluded: parseStringArray(product.whatsIncluded),
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create product failed:", error);
    return jsonError("Failed to create product", 500);
  }
}
