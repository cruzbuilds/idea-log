"use client";

import { useState, type FormEvent } from "react";
import { Button, Label, Textarea } from "@/components/ui";
import { ScorePicker } from "@/components/score-picker";
import type { IdeaDTO } from "@/lib/types";

const DIMENSION_FIELDS = [
  { key: "hDifferentiation", label: "Differentiation (in hindsight)" },
  { key: "hEvidence", label: "Evidence (in hindsight)" },
  { key: "hCost", label: "Cost (in hindsight)" },
  { key: "hReversibility", label: "Reversibility (in hindsight)" },
] as const;

type HindsightScores = Record<(typeof DIMENSION_FIELDS)[number]["key"], number>;

export function OutcomeForm({
  idea,
  onSaved,
  onCancel,
}: {
  idea: IdeaDTO;
  onSaved: (idea: IdeaDTO) => void;
  onCancel: () => void;
}) {
  const [status, setStatus] = useState<"DONE" | "ABANDONED">(
    idea.status === "ABANDONED" ? "ABANDONED" : "DONE"
  );
  const [outcome, setOutcome] = useState(idea.outcome ?? "");
  const [scores, setScores] = useState<HindsightScores>({
    hDifferentiation: idea.hDifferentiation ?? idea.differentiation,
    hEvidence: idea.hEvidence ?? idea.evidence,
    hCost: idea.hCost ?? idea.cost,
    hReversibility: idea.hReversibility ?? idea.reversibility,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch(`/api/ideas/${idea.id}/outcome`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, outcome, ...scores }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Could not save outcome");
      setLoading(false);
      return;
    }

    const data = await res.json();
    onSaved(data.idea);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <Label>What happened?</Label>
        <div className="flex gap-2">
          {(["DONE", "ABANDONED"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              className={`cursor-pointer rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                status === s
                  ? "border-accent bg-accent text-accent-foreground"
                  : "border-border bg-surface hover:bg-surface-hover"
              }`}
            >
              {s === "DONE" ? "Finished" : "Abandoned"}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="outcome">What actually happened</Label>
        <Textarea
          id="outcome"
          required
          rows={4}
          placeholder="What did you ship or learn? Why did it end here?"
          value={outcome}
          onChange={(e) => setOutcome(e.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {DIMENSION_FIELDS.map((f) => (
          <ScorePicker
            key={f.key}
            label={f.label}
            value={scores[f.key]}
            onChange={(v) => setScores((s) => ({ ...s, [f.key]: v }))}
          />
        ))}
      </div>

      {error && (
        <p className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">{error}</p>
      )}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving…" : "Save outcome"}
        </Button>
      </div>
    </form>
  );
}
