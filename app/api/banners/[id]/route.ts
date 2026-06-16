import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { jsonError, zodErrorResponse } from "@/lib/api-utils";
import { prisma } from "@/lib/db";
import { updateBannerSchema } from "@/lib/validations/cms";

type RouteParams = { params: { id: string } };

export async function PUT(request: Request, { params }: RouteParams) {
  const admin = await requireAdmin();
  if (admin.response) return admin.response;

  try {
    const existing = await prisma.banner.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return jsonError("Banner not found", 404);
    }

    const body = await request.json();
    const parsed = updateBannerSchema.safeParse(body);

    if (!parsed.success) {
      return zodErrorResponse(parsed.error);
    }

    const data = parsed.data;
    const banner = await prisma.banner.update({
      where: { id: params.id },
      data: {
        ...(data.title !== undefined ? { title: data.title } : {}),
        ...(data.subtitle !== undefined ? { subtitle: data.subtitle } : {}),
        ...(data.imageUrl !== undefined ? { imageUrl: data.imageUrl } : {}),
        ...(data.ctaText !== undefined ? { ctaText: data.ctaText } : {}),
        ...(data.ctaLink !== undefined ? { ctaLink: data.ctaLink } : {}),
        ...(data.active !== undefined ? { active: data.active } : {}),
        ...(data.displayOrder !== undefined
          ? { displayOrder: data.displayOrder }
          : {}),
      },
    });

    return NextResponse.json(banner);
  } catch (error) {
    console.error("Update banner failed:", error);
    return jsonError("Failed to update banner", 500);
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const admin = await requireAdmin();
  if (admin.response) return admin.response;

  const existing = await prisma.banner.findUnique({
    where: { id: params.id },
  });

  if (!existing) {
    return jsonError("Banner not found", 404);
  }

  await prisma.banner.delete({ where: { id: params.id } });
  return NextResponse.json({ message: "Banner deleted." });
}
