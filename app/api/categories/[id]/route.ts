import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { jsonError, zodErrorResponse } from "@/lib/api-utils";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/utils";
import { updateCategorySchema } from "@/lib/validations/category";

type RouteParams = { params: { id: string } };

export async function PUT(request: Request, { params }: RouteParams) {
  const admin = await requireAdmin();
  if (admin.response) return admin.response;

  try {
    const existing = await prisma.category.findFirst({
      where: { OR: [{ id: params.id }, { slug: params.id }] },
    });

    if (!existing) {
      return jsonError("Category not found", 404);
    }

    const body = await request.json();
    const parsed = updateCategorySchema.safeParse(body);

    if (!parsed.success) {
      return zodErrorResponse(parsed.error);
    }

    const data = parsed.data;
    const slug =
      data.slug?.trim() ||
      (data.name ? slugify(data.name) : existing.slug);

    if (slug !== existing.slug) {
      const conflict = await prisma.category.findUnique({ where: { slug } });
      if (conflict) {
        return jsonError("A category with this slug already exists.", 409);
      }
    }

    const category = await prisma.category.update({
      where: { id: existing.id },
      data: {
        ...(data.name !== undefined ? { name: data.name } : {}),
        slug,
        ...(data.description !== undefined
          ? { description: data.description }
          : {}),
        ...(data.imageUrl !== undefined
          ? { imageUrl: data.imageUrl || null }
          : {}),
        ...(data.displayOrder !== undefined
          ? { displayOrder: data.displayOrder }
          : {}),
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("Update category failed:", error);
    return jsonError("Failed to update category", 500);
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const admin = await requireAdmin();
  if (admin.response) return admin.response;

  const existing = await prisma.category.findFirst({
    where: { OR: [{ id: params.id }, { slug: params.id }] },
    include: { _count: { select: { products: true } } },
  });

  if (!existing) {
    return jsonError("Category not found", 404);
  }

  if (existing._count.products > 0) {
    return jsonError(
      "Cannot delete category with products. Reassign products first.",
      400,
    );
  }

  await prisma.category.delete({ where: { id: existing.id } });
  return NextResponse.json({ message: "Category deleted." });
}
