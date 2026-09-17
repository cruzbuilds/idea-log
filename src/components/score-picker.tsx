"use client";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function ScorePicker({
  label,
  hint,
  value,
  onChange,
  disabled,
}: {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-2">
        <span className="text-xs font-medium text-muted">{label}</span>
        {hint ? <span className="text-[11px] text-muted">{hint}</span> : null}
      </div>
      <div className="flex gap-1.5" role="radiogroup" aria-label={label}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            disabled={disabled}
            onClick={() => onChange(n)}
            className={cx(
              "flex h-9 flex-1 items-center justify-center rounded-md border text-sm font-medium tabular-nums transition-colors disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
              value === n
                ? "border-accent bg-accent text-accent-foreground"
                : "border-border bg-surface hover:bg-surface-hover"
            )}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}
