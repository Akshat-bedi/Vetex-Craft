import { NextResponse } from "next/server";
import { auth, isAdminRole } from "@/lib/auth";

export function unauthorizedResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function requireAdmin() {
  const session = await auth();

  if (!session?.user || !isAdminRole(session.user.role)) {
    return { session: null, response: unauthorizedResponse() };
  }

  return { session, response: null };
}
