import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { jsonError, zodErrorResponse } from "@/lib/api-utils";
import { prisma } from "@/lib/db";
import { createFaqSchema } from "@/lib/validations/cms";

export async function GET() {
  const faqs = await prisma.faq.findMany({
    orderBy: [{ category: "asc" }, { displayOrder: "asc" }],
  });

  return NextResponse.json(faqs);
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (admin.response) return admin.response;

  try {
    const body = await request.json();
    const parsed = createFaqSchema.safeParse(body);

    if (!parsed.success) {
      return zodErrorResponse(parsed.error);
    }

    const faq = await prisma.faq.create({ data: parsed.data });
    return NextResponse.json(faq, { status: 201 });
  } catch (error) {
    console.error("Create FAQ failed:", error);
    return jsonError("Failed to create FAQ", 500);
  }
}
