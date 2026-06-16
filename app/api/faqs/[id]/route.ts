import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { jsonError, zodErrorResponse } from "@/lib/api-utils";
import { prisma } from "@/lib/db";
import { updateFaqSchema } from "@/lib/validations/cms";

type RouteParams = { params: { id: string } };

export async function PUT(request: Request, { params }: RouteParams) {
  const admin = await requireAdmin();
  if (admin.response) return admin.response;

  try {
    const existing = await prisma.faq.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return jsonError("FAQ not found", 404);
    }

    const body = await request.json();
    const parsed = updateFaqSchema.safeParse(body);

    if (!parsed.success) {
      return zodErrorResponse(parsed.error);
    }

    const data = parsed.data;
    const faq = await prisma.faq.update({
      where: { id: params.id },
      data: {
        ...(data.question !== undefined ? { question: data.question } : {}),
        ...(data.answer !== undefined ? { answer: data.answer } : {}),
        ...(data.category !== undefined ? { category: data.category } : {}),
        ...(data.displayOrder !== undefined
          ? { displayOrder: data.displayOrder }
          : {}),
      },
    });

    return NextResponse.json(faq);
  } catch (error) {
    console.error("Update FAQ failed:", error);
    return jsonError("Failed to update FAQ", 500);
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const admin = await requireAdmin();
  if (admin.response) return admin.response;

  const existing = await prisma.faq.findUnique({
    where: { id: params.id },
  });

  if (!existing) {
    return jsonError("FAQ not found", 404);
  }

  await prisma.faq.delete({ where: { id: params.id } });
  return NextResponse.json({ message: "FAQ deleted." });
}
