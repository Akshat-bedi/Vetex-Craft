import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { jsonError, zodErrorResponse } from "@/lib/api-utils";
import { prisma } from "@/lib/db";
import { createBannerSchema } from "@/lib/validations/cms";

export async function GET() {
  const admin = await requireAdmin();
  const includeInactive = admin.response === null;

  const banners = await prisma.banner.findMany({
    where: includeInactive ? undefined : { active: true },
    orderBy: { displayOrder: "asc" },
  });

  return NextResponse.json(banners);
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (admin.response) return admin.response;

  try {
    const body = await request.json();
    const parsed = createBannerSchema.safeParse(body);

    if (!parsed.success) {
      return zodErrorResponse(parsed.error);
    }

    const banner = await prisma.banner.create({ data: parsed.data });
    return NextResponse.json(banner, { status: 201 });
  } catch (error) {
    console.error("Create banner failed:", error);
    return jsonError("Failed to create banner", 500);
  }
}
