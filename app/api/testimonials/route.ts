import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { jsonError, zodErrorResponse } from "@/lib/api-utils";
import { prisma } from "@/lib/db";
import { createTestimonialSchema } from "@/lib/validations/cms";

export async function GET() {
  const admin = await requireAdmin();
  const includeInactive = admin.response === null;

  const testimonials = await prisma.testimonial.findMany({
    where: includeInactive ? undefined : { active: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(testimonials);
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (admin.response) return admin.response;

  try {
    const body = await request.json();
    const parsed = createTestimonialSchema.safeParse(body);

    if (!parsed.success) {
      return zodErrorResponse(parsed.error);
    }

    const data = parsed.data;
    const testimonial = await prisma.testimonial.create({
      data: {
        username: data.username,
        avatarUrl: data.avatarUrl || null,
        review: data.review,
        rating: data.rating,
        active: data.active,
      },
    });

    return NextResponse.json(testimonial, { status: 201 });
  } catch (error) {
    console.error("Create testimonial failed:", error);
    return jsonError("Failed to create testimonial", 500);
  }
}
