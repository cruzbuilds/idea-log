-- Enforce 1-5 range on prediction scores and hindsight scores at the database level.
ALTER TABLE "Idea"
  ADD CONSTRAINT "Idea_differentiation_range" CHECK ("differentiation" BETWEEN 1 AND 5),
  ADD CONSTRAINT "Idea_evidence_range" CHECK ("evidence" BETWEEN 1 AND 5),
  ADD CONSTRAINT "Idea_cost_range" CHECK ("cost" BETWEEN 1 AND 5),
  ADD CONSTRAINT "Idea_reversibility_range" CHECK ("reversibility" BETWEEN 1 AND 5),
  ADD CONSTRAINT "Idea_hDifferentiation_range" CHECK ("hDifferentiation" IS NULL OR "hDifferentiation" BETWEEN 1 AND 5),
  ADD CONSTRAINT "Idea_hEvidence_range" CHECK ("hEvidence" IS NULL OR "hEvidence" BETWEEN 1 AND 5),
  ADD CONSTRAINT "Idea_hCost_range" CHECK ("hCost" IS NULL OR "hCost" BETWEEN 1 AND 5),
  ADD CONSTRAINT "Idea_hReversibility_range" CHECK ("hReversibility" IS NULL OR "hReversibility" BETWEEN 1 AND 5);
