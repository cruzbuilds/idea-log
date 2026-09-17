import { DIMENSIONS } from "@/lib/scoring";
import type { IdeaDTO } from "@/lib/types";

export type Calibration = {
  count: number;
  avgTotalDelta: number;
  perDimension: Array<{
    key: (typeof DIMENSIONS)[number]["key"];
    label: string;
    avgDelta: number;
  }>;
};

export function computeCalibration(ideas: IdeaDTO[]): Calibration | null {
  const withHindsight = ideas.filter((i) => i.hindsightTotal != null);
  if (withHindsight.length === 0) return null;

  const perDimension = DIMENSIONS.map((d) => {
    const diffs = withHindsight.map((i) => {
      const hindsight = i[d.hKey] as number | null;
      const predicted = i[d.key] as number;
      return (hindsight ?? predicted) - predicted;
    });
    const avgDelta = diffs.reduce((a, b) => a + b, 0) / diffs.length;
    return { key: d.key, label: d.label, avgDelta };
  });

  const avgTotalDelta =
    withHindsight.reduce((sum, i) => sum + (i.delta ?? 0), 0) / withHindsight.length;

  return { count: withHindsight.length, avgTotalDelta, perDimension };
}
