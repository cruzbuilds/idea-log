import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { totalScore, hindsightTotal, scoreDelta } from "@/lib/scoring";

type Params = { params: Promise<{ token: string }> };

// Public, unauthenticated read of a single shared idea. No PII beyond what the
// owner chose to write into the idea itself.
export async function GET(_req: Request, { params }: Params) {
  const { token } = await params;
  if (!token) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const idea = await prisma.idea.findUnique({ where: { shareToken: token } });
  if (!idea) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    idea: {
      title: idea.title,
      description: idea.description,
      status: idea.status,
      differentiation: idea.differentiation,
      evidence: idea.evidence,
      cost: idea.cost,
      reversibility: idea.reversibility,
      totalScore: totalScore(idea),
      outcome: idea.outcome,
      outcomeRecordedAt: idea.outcomeRecordedAt,
      hDifferentiation: idea.hDifferentiation,
      hEvidence: idea.hEvidence,
      hCost: idea.hCost,
      hReversibility: idea.hReversibility,
      hindsightTotal: hindsightTotal(idea),
      delta: scoreDelta(idea),
      createdAt: idea.createdAt,
    },
  });
}
