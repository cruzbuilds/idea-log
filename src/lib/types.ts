export type IdeaStatus = "ACTIVE" | "DONE" | "ABANDONED";

export type IdeaDTO = {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: IdeaStatus;
  differentiation: number;
  evidence: number;
  cost: number;
  reversibility: number;
  outcome: string | null;
  outcomeRecordedAt: string | null;
  hDifferentiation: number | null;
  hEvidence: number | null;
  hCost: number | null;
  hReversibility: number | null;
  shareToken: string | null;
  createdAt: string;
  updatedAt: string;
  totalScore: number;
  hindsightTotal: number | null;
  delta: number | null;
  isShared: boolean;
};

export type PublicIdeaDTO = {
  title: string;
  description: string;
  status: IdeaStatus;
  differentiation: number;
  evidence: number;
  cost: number;
  reversibility: number;
  totalScore: number;
  outcome: string | null;
  outcomeRecordedAt: string | null;
  hDifferentiation: number | null;
  hEvidence: number | null;
  hCost: number | null;
  hReversibility: number | null;
  hindsightTotal: number | null;
  delta: number | null;
  createdAt: string;
};
