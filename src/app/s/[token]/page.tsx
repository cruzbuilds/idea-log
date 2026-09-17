import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { totalScore, hindsightTotal, DIMENSIONS } from "@/lib/scoring";
import { Card, DeltaBadge, StatusBadge } from "@/components/ui";

async function getSharedIdea(token: string) {
  const idea = await prisma.idea.findUnique({ where: { shareToken: token } });
  return idea;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ token: string }>;
}): Promise<Metadata> {
  const { token } = await params;
  const idea = await getSharedIdea(token);
  return {
    title: idea ? `${idea.title} — Idea Log` : "Shared idea — Idea Log",
  };
}

export default async function SharedIdeaPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const idea = await getSharedIdea(token);
  if (!idea) notFound();

  const total = totalScore(idea);
  const hTotal = hindsightTotal(idea);
  const delta = hTotal == null ? null : hTotal - total;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <p className="mb-4 text-xs font-medium uppercase tracking-wide text-muted">
        Shared idea · read only
      </p>

      <Card className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-semibold">{idea.title}</h1>
              <StatusBadge status={idea.status} />
            </div>
            {idea.description && (
              <p className="mt-2 whitespace-pre-wrap text-sm text-muted">{idea.description}</p>
            )}
          </div>
          <div className="shrink-0 text-right">
            <div className="text-3xl font-semibold tabular-nums leading-none">{total}</div>
            <div className="text-xs text-muted">/ 20</div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {DIMENSIONS.map((d) => (
            <div key={d.key} className="rounded-lg border border-border bg-background/40 p-3">
              <div className="text-[11px] text-muted">{d.label}</div>
              <div className="mt-1 text-lg font-semibold tabular-nums">
                {idea[d.key as keyof typeof idea] as number}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {idea.outcome && (
        <Card className="mt-4 p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Hindsight</h2>
            <DeltaBadge delta={delta} />
          </div>
          <p className="mt-3 whitespace-pre-wrap text-sm">{idea.outcome}</p>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {DIMENSIONS.map((d) => {
              const predicted = idea[d.key as keyof typeof idea] as number;
              const hindsight = idea[d.hKey as keyof typeof idea] as number | null;
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
        </Card>
      )}

      <p className="mt-6 text-center text-xs text-muted">
        Shared from <span className="font-medium">Idea Log</span>
      </p>
    </div>
  );
}
