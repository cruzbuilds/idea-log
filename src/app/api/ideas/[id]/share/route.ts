import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-auth";
import { serializeIdea } from "@/lib/serialize-idea";

type Params = { params: Promise<{ id: string }> };

// Enable sharing (or rotate the link with { regenerate: true } in the body).
export async function POST(req: Request, { params }: Params) {
  const { user, error } = await requireUser();
  if (error) return error;

  const { id } = await params;
  const existing = await prisma.idea.findFirst({ where: { id, userId: user.id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const regenerate = Boolean(body?.regenerate);

  const shareToken =
    existing.shareToken && !regenerate ? existing.shareToken : nanoid(24);

  const idea = await prisma.idea.update({
    where: { id },
    data: { shareToken },
  });

  return NextResponse.json({ idea: serializeIdea(idea) });
}

// Revoke sharing.
export async function DELETE(_req: Request, { params }: Params) {
  const { user, error } = await requireUser();
  if (error) return error;

  const { id } = await params;
  const existing = await prisma.idea.findFirst({ where: { id, userId: user.id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const idea = await prisma.idea.update({
    where: { id },
    data: { shareToken: null },
  });

  return NextResponse.json({ idea: serializeIdea(idea) });
}
