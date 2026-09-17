import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import type { User } from "@prisma/client";

export async function requireUser(): Promise<
  { user: User; error: null } | { user: null; error: NextResponse }
> {
  const user = await getCurrentUser();
  if (!user) {
    return {
      user: null,
      error: NextResponse.json({ error: "Not authenticated" }, { status: 401 }),
    };
  }
  return { user, error: null };
}
