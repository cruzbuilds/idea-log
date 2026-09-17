import type { Idea } from "@prisma/client";
import { totalScore, hindsightTotal, scoreDelta } from "@/lib/scoring";

// Only ever called with ideas already scoped to the authenticated owner,
// so it's safe to include the raw shareToken (the owner needs it to copy the link).
export function serializeIdea(idea: Idea) {
  return {
    ...idea,
    totalScore: totalScore(idea),
    hindsightTotal: hindsightTotal(idea),
    delta: scoreDelta(idea),
    isShared: idea.shareToken != null,
  };
}
