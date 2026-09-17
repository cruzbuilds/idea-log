import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-auth";
import { outcomeSchema } from "@/lib/validation";
import { serializeIdea } from "@/lib/serialize-idea";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
  const { user, error } = await requireUser();
  if (error) return error;

  const { id } = await params;
  const existing = await prisma.idea.findFirst({ where: { id, userId: user.id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json().catch(() => null);
  const parsed = outcomeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const idea = await prisma.idea.update({
    where: { id },
    data: {
      status: parsed.data.status,
      outcome: parsed.data.outcome,
      outcomeRecordedAt: new Date(),
      hDifferentiation: parsed.data.hDifferentiation,
      hEvidence: parsed.data.hEvidence,
      hCost: parsed.data.hCost,
      hReversibility: parsed.data.hReversibility,
    },
  });

  return NextResponse.json({ idea: serializeIdea(idea) });
}
