"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button, Card, DeltaBadge, StatusBadge } from "@/components/ui";
import { IdeaCreateForm } from "@/components/idea-create-form";
import { computeCalibration } from "@/lib/calibration";
import type { IdeaDTO, IdeaStatus } from "@/lib/types";

const TABS: Array<{ key: IdeaStatus | "ALL"; label: string }> = [
  { key: "ALL", label: "All" },
  { key: "ACTIVE", label: "Active" },
  { key: "DONE", label: "Done" },
  { key: "ABANDONED", label: "Abandoned" },
];

export function IdeasDashboard({ initialIdeas }: { initialIdeas: IdeaDTO[] }) {
  const [ideas, setIdeas] = useState<IdeaDTO[]>(initialIdeas);
  const [tab, setTab] = useState<IdeaStatus | "ALL">("ALL");
  const [showForm, setShowForm] = useState(false);

  const filtered = useMemo(() => {
    const list = tab === "ALL" ? ideas : ideas.filter((i) => i.status === tab);
    return [...list].sort((a, b) => b.totalScore - a.totalScore);
  }, [ideas, tab]);

  const calibration = useMemo(() => computeCalibration(ideas), [ideas]);

  function handleCreated(idea: IdeaDTO) {
    setIdeas((prev) => [idea, ...prev]);
    setShowForm(false);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Your ideas</h1>
          <p className="mt-1 text-sm text-muted">
            Ranked by total score — differentiation + evidence + cost + reversibility.
          </p>
        </div>
        {!showForm && <Button onClick={() => setShowForm(true)}>New idea</Button>}
      </div>

      {showForm && (
        <Card className="mt-6">
          <IdeaCreateForm onCreated={handleCreated} onCancel={() => setShowForm(false)} />
        </Card>
      )}

      {calibration && (
        <Card className="mt-6 p-5">
          <h2 className="text-sm font-medium">
            Calibration{" "}
            <span className="font-normal text-muted">
              — based on {calibration.count} idea{calibration.count === 1 ? "" : "s"} with a recorded outcome
            </span>
          </h2>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-5">
            <CalibrationStat label="Overall" avg={calibration.avgTotalDelta} />
            {calibration.perDimension.map((d) => (
              <CalibrationStat key={d.key} label={d.label} avg={d.avgDelta} />
            ))}
          </div>
          <p className="mt-3 text-xs text-muted">
            Positive means hindsight scored higher than your prediction (you were too
            pessimistic); negative means you were too optimistic.
          </p>
        </Card>
      )}

      <div className="mt-8 flex gap-1 border-b border-border">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`-mb-px cursor-pointer border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
              tab === t.key
                ? "border-accent text-foreground"
                : "border-transparent text-muted hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-2">
        {filtered.length === 0 && (
          <Card className="p-8 text-center text-sm text-muted">
            {ideas.length === 0
              ? "No ideas yet. Log your first one above."
              : "No ideas in this view."}
          </Card>
        )}

        {filtered.map((idea, i) => (
          <Link key={idea.id} href={`/ideas/${idea.id}`} className="block">
            <Card className="flex items-center gap-4 p-4 transition-colors hover:bg-surface-hover">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-hover text-xs font-medium text-muted tabular-nums">
                {i + 1}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate font-medium">{idea.title}</h3>
                  <StatusBadge status={idea.status} />
                  {idea.isShared && (
                    <span className="shrink-0 text-[11px] text-muted">shared</span>
                  )}
                </div>
                {idea.description && (
                  <p className="mt-0.5 truncate text-sm text-muted">{idea.description}</p>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <DeltaBadge delta={idea.delta} />
                <div className="text-right">
                  <div className="text-lg font-semibold tabular-nums leading-none">
                    {idea.totalScore}
                  </div>
                  <div className="text-[11px] text-muted">/ 20</div>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

function CalibrationStat({ label, avg }: { label: string; avg: number }) {
  const rounded = Math.round(avg * 10) / 10;
  const positive = rounded > 0;
  const zero = rounded === 0;
  return (
    <div>
      <div className="text-[11px] text-muted">{label}</div>
      <div
        className={`text-lg font-semibold tabular-nums ${
          zero ? "" : positive ? "text-success" : "text-danger"
        }`}
      >
        {zero ? "±0" : positive ? `+${rounded}` : rounded}
      </div>
    </div>
  );
}
