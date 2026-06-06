import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const ALLOWED_ADMIN_ROLES = new Set(["admin", "super_admin"]);

export async function requireAdminSession() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return {
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  if (!session.user.role || !ALLOWED_ADMIN_ROLES.has(session.user.role)) {
    return {
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return { session };
}
