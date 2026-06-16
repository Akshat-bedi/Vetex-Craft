import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { jsonError, zodErrorResponse } from "@/lib/api-utils";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/utils";
import {
  createCategorySchema,
} from "@/lib/validations/category";

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { displayOrder: "asc" },
    include: {
      _count: { select: { products: true } },
    },
  });

  return NextResponse.json(
    categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      imageUrl: category.imageUrl,
      displayOrder: category.displayOrder,
      productCount: category._count.products,
      createdAt: category.createdAt,
    })),
  );
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (admin.response) return admin.response;

  try {
    const body = await request.json();
    const parsed = createCategorySchema.safeParse(body);

    if (!parsed.success) {
      return zodErrorResponse(parsed.error);
    }

    const data = parsed.data;
    const slug = data.slug?.trim() || slugify(data.name);

    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) {
      return jsonError("A category with this slug already exists.", 409);
    }

    const category = await prisma.category.create({
      data: {
        name: data.name,
        slug,
        description: data.description ?? null,
        imageUrl: data.imageUrl || null,
        displayOrder: data.displayOrder,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("Create category failed:", error);
    return jsonError("Failed to create category", 500);
  }
}
