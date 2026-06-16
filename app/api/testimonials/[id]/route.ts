import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { jsonError, zodErrorResponse } from "@/lib/api-utils";
import { prisma } from "@/lib/db";
import { updateTestimonialSchema } from "@/lib/validations/cms";

type RouteParams = { params: { id: string } };

export async function PUT(request: Request, { params }: RouteParams) {
  const admin = await requireAdmin();
  if (admin.response) return admin.response;

  try {
    const existing = await prisma.testimonial.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return jsonError("Testimonial not found", 404);
    }

    const body = await request.json();
    const parsed = updateTestimonialSchema.safeParse(body);

    if (!parsed.success) {
      return zodErrorResponse(parsed.error);
    }

    const data = parsed.data;
    const testimonial = await prisma.testimonial.update({
      where: { id: params.id },
      data: {
        ...(data.username !== undefined ? { username: data.username } : {}),
        ...(data.avatarUrl !== undefined
          ? { avatarUrl: data.avatarUrl || null }
          : {}),
        ...(data.review !== undefined ? { review: data.review } : {}),
        ...(data.rating !== undefined ? { rating: data.rating } : {}),
        ...(data.active !== undefined ? { active: data.active } : {}),
      },
    });

    return NextResponse.json(testimonial);
  } catch (error) {
    console.error("Update testimonial failed:", error);
    return jsonError("Failed to update testimonial", 500);
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const admin = await requireAdmin();
  if (admin.response) return admin.response;

  const existing = await prisma.testimonial.findUnique({
    where: { id: params.id },
  });

  if (!existing) {
    return jsonError("Testimonial not found", 404);
  }

  await prisma.testimonial.delete({ where: { id: params.id } });
  return NextResponse.json({ message: "Testimonial deleted." });
}
