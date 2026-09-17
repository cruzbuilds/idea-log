export type PredictionScores = {
  differentiation: number;
  evidence: number;
  cost: number;
  reversibility: number;
};

export type HindsightScores = {
  hDifferentiation: number | null;
  hEvidence: number | null;
  hCost: number | null;
  hReversibility: number | null;
};

export const DIMENSIONS = [
  { key: "differentiation", hKey: "hDifferentiation", label: "Differentiation" },
  { key: "evidence", hKey: "hEvidence", label: "Evidence" },
  { key: "cost", hKey: "hCost", label: "Cost" },
  { key: "reversibility", hKey: "hReversibility", label: "Reversibility" },
] as const;

export function totalScore(scores: PredictionScores): number {
  return (
    scores.differentiation + scores.evidence + scores.cost + scores.reversibility
  );
}

export function hindsightTotal(scores: HindsightScores): number | null {
  const { hDifferentiation, hEvidence, hCost, hReversibility } = scores;
  if (
    hDifferentiation == null ||
    hEvidence == null ||
    hCost == null ||
    hReversibility == null
  ) {
    return null;
  }
  return hDifferentiation + hEvidence + hCost + hReversibility;
}

export function scoreDelta(
  scores: PredictionScores & HindsightScores
): number | null {
  const hindsight = hindsightTotal(scores);
  if (hindsight == null) return null;
  return hindsight - totalScore(scores);
}
