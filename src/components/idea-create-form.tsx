"use client";

import { useState, type FormEvent } from "react";
import { Button, Input, Label, Textarea } from "@/components/ui";
import { ScorePicker } from "@/components/score-picker";
import type { IdeaDTO } from "@/lib/types";

const DIMENSION_FIELDS = [
  { key: "differentiation", label: "Differentiation", hint: "1 = commodity, 5 = nothing like it exists" },
  { key: "evidence", label: "Evidence", hint: "1 = pure hunch, 5 = validated demand" },
  { key: "cost", label: "Cost", hint: "1 = expensive/slow, 5 = cheap/fast to try" },
  { key: "reversibility", label: "Reversibility", hint: "1 = hard to undo, 5 = easy to walk away" },
] as const;

type Scores = Record<(typeof DIMENSION_FIELDS)[number]["key"], number>;

export function IdeaCreateForm({
  onCreated,
  onCancel,
}: {
  onCreated: (idea: IdeaDTO) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [scores, setScores] = useState<Scores>({
    differentiation: 3,
    evidence: 3,
    cost: 3,
    reversibility: 3,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/ideas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, ...scores }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Could not save idea");
      setLoading(false);
      return;
    }

    const data = await res.json();
    onCreated(data.idea);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 p-5">
      <div>
        <Label htmlFor="title">Idea</Label>
        <Input
          id="title"
          required
          autoFocus
          placeholder="What's the idea?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="description">Description (optional)</Label>
        <Textarea
          id="description"
          rows={3}
          placeholder="What is it, who is it for, why now?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {DIMENSION_FIELDS.map((f) => (
          <ScorePicker
            key={f.key}
            label={f.label}
            hint={f.hint}
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
          {loading ? "Saving…" : "Save idea"}
        </Button>
      </div>
    </form>
  );
}
