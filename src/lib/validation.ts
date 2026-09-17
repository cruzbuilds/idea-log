import { z } from "zod";

export const score = z.number().int().min(1).max(5);

export const emailSchema = z.string().trim().toLowerCase().email().max(254);
export const passwordSchema = z.string().min(8).max(200);

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: z.string().trim().min(1).max(100).optional(),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1).max(200),
});

export const ideaStatusSchema = z.enum(["ACTIVE", "DONE", "ABANDONED"]);

export const ideaCreateSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(5000).optional().default(""),
  differentiation: score,
  evidence: score,
  cost: score,
  reversibility: score,
});

export const ideaUpdateSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  description: z.string().trim().max(5000).optional(),
  status: ideaStatusSchema.optional(),
  differentiation: score.optional(),
  evidence: score.optional(),
  cost: score.optional(),
  reversibility: score.optional(),
});

export const outcomeSchema = z.object({
  status: z.enum(["DONE", "ABANDONED"]),
  outcome: z.string().trim().min(1).max(5000),
  hDifferentiation: score,
  hEvidence: score,
  hCost: score,
  hReversibility: score,
});
