import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-auth";
import { ideaCreateSchema, ideaStatusSchema } from "@/lib/validation";
import { serializeIdea } from "@/lib/serialize-idea";

export async function GET(req: Request) {
  const { user, error } = await requireUser();
  if (error) return error;

  const { searchParams } = new URL(req.url);
  const statusParam = searchParams.get("status");
  const statusFilter = statusParam ? ideaStatusSchema.safeParse(statusParam) : null;

  const ideas = await prisma.idea.findMany({
    where: {
      userId: user.id,
      ...(statusFilter?.success ? { status: statusFilter.data } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  const ranked = ideas
    .map(serializeIdea)
    .sort((a, b) => b.totalScore - a.totalScore);

  return NextResponse.json({ ideas: ranked });
}

export async function POST(req: Request) {
  const { user, error } = await requireUser();
  if (error) return error;

  const body = await req.json().catch(() => null);
  const parsed = ideaCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const idea = await prisma.idea.create({
    data: {
      userId: user.id,
      title: parsed.data.title,
      description: parsed.data.description,
      differentiation: parsed.data.differentiation,
      evidence: parsed.data.evidence,
      cost: parsed.data.cost,
      reversibility: parsed.data.reversibility,
    },
  });

  return NextResponse.json({ idea: serializeIdea(idea) }, { status: 201 });
}
