"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Card, DeltaBadge, Input, Label, StatusBadge, Textarea } from "@/components/ui";
import { ScorePicker } from "@/components/score-picker";
import { OutcomeForm } from "@/components/outcome-form";
import { ShareControl } from "@/components/share-control";
import { DIMENSIONS } from "@/lib/scoring";
import type { IdeaDTO } from "@/lib/types";

const DIMENSION_FIELDS = [
  { key: "differentiation", label: "Differentiation" },
  { key: "evidence", label: "Evidence" },
  { key: "cost", label: "Cost" },
  { key: "reversibility", label: "Reversibility" },
] as const;

type PredictionScores = Record<(typeof DIMENSION_FIELDS)[number]["key"], number>;

export function IdeaDetail({ idea: initialIdea }: { idea: IdeaDTO }) {
  const router = useRouter();
  const [idea, setIdea] = useState(initialIdea);
  const [editing, setEditing] = useState(false);
  const [showOutcomeForm, setShowOutcomeForm] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [title, setTitle] = useState(idea.title);
  const [description, setDescription] = useState(idea.description);
  const [scores, setScores] = useState<PredictionScores>({
    differentiation: idea.differentiation,
    evidence: idea.evidence,
    cost: idea.cost,
    reversibility: idea.reversibility,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function startEditing() {
    setTitle(idea.title);
    setDescription(idea.description);
    setScores({
      differentiation: idea.differentiation,
      evidence: idea.evidence,
      cost: idea.cost,
      reversibility: idea.reversibility,
    });
    setError(null);
    setEditing(true);
  }

  async function saveEdits() {
    setSaving(true);
    setError(null);
    const res = await fetch(`/api/ideas/${idea.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, ...scores }),
    });
    setSaving(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Could not save changes");
      return;
    }
    const data = await res.json();
    setIdea(data.idea);
    setEditing(false);
  }

  async function deleteIdea() {
    setDeleting(true);
    const res = await fetch(`/api/ideas/${idea.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/ideas");
      router.refresh();
    } else {
      setDeleting(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link href="/ideas" className="text-sm text-muted hover:text-foreground">
        ← All ideas
      </Link>

      <Card className="mt-4 p-6">
        {!editing ? (
          <>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl font-semibold">{idea.title}</h1>
                  <StatusBadge status={idea.status} />
                </div>
                {idea.description && (
                  <p className="mt-2 whitespace-pre-wrap text-sm text-muted">
                    {idea.description}
                  </p>
                )}
              </div>
              <div className="shrink-0 text-right">
                <div className="text-3xl font-semibold tabular-nums leading-none">
                  {idea.totalScore}
                </div>
                <div className="text-xs text-muted">/ 20</div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {DIMENSION_FIELDS.map((f) => (
                <ScoreDisplay key={f.key} label={f.label} value={idea[f.key]} />
              ))}
            </div>

            <div className="mt-5 flex justify-end">
              <Button variant="secondary" size="sm" onClick={startEditing}>
                Edit
              </Button>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Idea</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
              <Button variant="secondary" onClick={() => setEditing(false)} disabled={saving}>
                Cancel
              </Button>
              <Button onClick={saveEdits} disabled={saving}>
                {saving ? "Saving…" : "Save changes"}
              </Button>
            </div>
          </div>
        )}
      </Card>

      <Card className="mt-4 p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">Hindsight</h2>
          {idea.outcome && !showOutcomeForm && (
            <DeltaBadge delta={idea.delta} />
          )}
        </div>

        {showOutcomeForm ? (
          <div className="mt-4">
            <OutcomeForm
              idea={idea}
              onCancel={() => setShowOutcomeForm(false)}
              onSaved={(updated) => {
                setIdea(updated);
                setShowOutcomeForm(false);
              }}
            />
          </div>
        ) : idea.outcome ? (
          <div className="mt-4 space-y-4">
            <p className="whitespace-pre-wrap text-sm">{idea.outcome}</p>
            {idea.outcomeRecordedAt && (
              <p className="text-xs text-muted">
                Recorded {new Date(idea.outcomeRecordedAt).toLocaleDateString()}
              </p>
            )}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {DIMENSIONS.map((d) => {
                const predicted = idea[d.key] as number;
                const hindsight = idea[d.hKey] as number | null;
                return (
                  <div key={d.key}>
                    <div className="text-[11px] text-muted">{d.label}</div>
                    <div className="mt-0.5 flex items-baseline gap-1.5 text-sm tabular-nums">
                      <span className="text-muted line-through">{predicted}</span>
                      <span className="font-semibold">{hindsight}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-end">
              <Button variant="secondary" size="sm" onClick={() => setShowOutcomeForm(true)}>
                Edit outcome
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-4 flex items-center justify-between gap-3">
            <p className="text-sm text-muted">
              No outcome recorded yet. When you finish or abandon this idea, log what
              happened and re-score it in hindsight.
            </p>
            <Button size="sm" onClick={() => setShowOutcomeForm(true)}>
              Record outcome
            </Button>
          </div>
        )}
      </Card>

      <Card className="mt-4 p-6">
        <h2 className="font-medium">Share</h2>
        <div className="mt-4">
          <ShareControl
            ideaId={idea.id}
            shareToken={idea.shareToken}
            onChange={(shareToken) => setIdea((prev) => ({ ...prev, shareToken, isShared: shareToken != null }))}
          />
        </div>
      </Card>

      <Card className="mt-4 border-danger-soft p-6">
        <h2 className="font-medium text-danger">Danger zone</h2>
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-sm text-muted">Delete this idea permanently.</p>
          {confirmingDelete ? (
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => setConfirmingDelete(false)}>
                Cancel
              </Button>
              <Button variant="danger" size="sm" onClick={deleteIdea} disabled={deleting}>
                {deleting ? "Deleting…" : "Confirm delete"}
              </Button>
            </div>
          ) : (
            <Button variant="danger" size="sm" onClick={() => setConfirmingDelete(true)}>
              Delete idea
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}

function ScoreDisplay({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border bg-background/40 p-3">
      <div className="text-[11px] text-muted">{label}</div>
      <div className="mt-1 flex items-center gap-2">
        <div className="text-lg font-semibold tabular-nums">{value}</div>
        <div className="flex flex-1 gap-0.5">
          {[1, 2, 3, 4, 5].map((n) => (
            <div
              key={n}
              className={`h-1.5 flex-1 rounded-full ${n <= value ? "bg-accent" : "bg-surface-hover"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
